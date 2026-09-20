-- Schéma AM : comptes, favoris, avis, newsletter, porte d'entrée, commandes.
-- À exécuter en une fois dans Supabase (Dashboard > SQL Editor > New query),
-- ou via `supabase db push` si tu utilises la CLI reliée à ce projet.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles : une ligne par compte, créée automatiquement à l'inscription
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  prenom text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Crée la ligne profiles dès qu'un compte auth.users est créé (email ou Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, prenom)
  values (new.id, new.raw_user_meta_data ->> 'prenom')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- wishlist : favoris (un produit AM = un slug du fichier de config)
-- ---------------------------------------------------------------------
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

alter table public.wishlist enable row level security;

drop policy if exists "wishlist_select_own" on public.wishlist;
create policy "wishlist_select_own" on public.wishlist
  for select using (auth.uid() = user_id);

drop policy if exists "wishlist_insert_own" on public.wishlist;
create policy "wishlist_insert_own" on public.wishlist
  for insert with check (auth.uid() = user_id);

drop policy if exists "wishlist_delete_own" on public.wishlist;
create policy "wishlist_delete_own" on public.wishlist
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- reviews : avis clients (note + commentaire), un avis par personne et
-- par produit, visibles par tout le monde
-- ---------------------------------------------------------------------
-- Référence profiles (et non auth.users) pour pouvoir récupérer le prénom
-- de l'auteur en une seule requête (PostgREST embed) depuis le site.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_slug text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- newsletter_subscribers : inscription email depuis le footer
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_insert_anyone" on public.newsletter_subscribers;
create policy "newsletter_insert_anyone" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------
-- gate_signups : prénom + email saisis à la porte d'entrée du site
-- ---------------------------------------------------------------------
create table if not exists public.gate_signups (
  id uuid primary key default gen_random_uuid(),
  prenom text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.gate_signups enable row level security;

drop policy if exists "gate_signups_insert_anyone" on public.gate_signups;
create policy "gate_signups_insert_anyone" on public.gate_signups
  for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------
-- orders : commandes, remplies uniquement par le webhook Stripe (étape 7)
-- via la clé service role, qui contourne la RLS — aucune policy d'écriture
-- n'est donc ouverte ici depuis le navigateur.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  stripe_session_id text not null unique,
  items jsonb not null,
  amount_total integer not null,
  promo_code text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

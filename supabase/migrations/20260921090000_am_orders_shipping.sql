-- Ajoute l'adresse de livraison collectée par Stripe Checkout aux commandes.
alter table public.orders add column if not exists shipping_address jsonb;

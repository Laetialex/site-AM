# AM — All Money

Site officiel de AM, marque de vêtements streetwear premium. Premier drop en
précommande uniquement, sans stock permanent.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion (animations)
- Supabase (comptes, avis, favoris, newsletter)
- Stripe Checkout (paiement)
- Resend (emails transactionnels)
- Déploiement Vercel

## Configuration du site

**Tout ce qui change souvent est dans `src/config/site.config.ts`** : dates
du drop, produits, prix, stock affiché, frais de livraison, codes promo,
preuve sociale. Modifie ce fichier pour mettre le site à jour — pas besoin
de toucher au reste du code.

Les images sont dans `public/images/` (voir `public/images/README.md` pour
savoir où déposer tes photos).

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur http://localhost:3000.

## Variables d'environnement

Copie `.env.example` vers `.env.local` et remplis les valeurs au fur et à
mesure des étapes (voir les commentaires dans le fichier). `.env.local`
n'est jamais commité.

## Supabase

Le projet Supabase (comptes, favoris, avis, newsletter, porte d'entrée) est
créé et branché. Le schéma complet (tables + policies RLS) vit dans
`supabase/migrations/` — à réappliquer via le SQL Editor du dashboard si tu
recrées un projet ou changes d'environnement (ex. staging vs prod).

Le service d'emails gratuit de Supabase a une limite basse (quelques emails
par heure) : pratique pour développer, mais à remplacer par un fournisseur
SMTP dédié (Resend, déjà prévu à l'étape 7) avant un vrai lancement, sinon
les emails de confirmation/réinitialisation de mot de passe seront bloqués
en cas de pic d'inscriptions. Se configure dans Supabase sous
**Authentication → Settings → SMTP Settings**.

## Stripe & Resend

Code prêt (Checkout, webhook, emails de confirmation) mais pas encore testé
en conditions réelles : les clés secrètes (`STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
seront renseignées directement dans les variables d'environnement Vercel au
moment du déploiement (étape 10), pas dans ce dépôt ni dans le chat. Les
noms exacts attendus sont dans `.env.example`.

## Avancement

Le projet avance par étapes (voir le fil de conversation pour le détail) :

1. ✅ Nettoyage du dépôt, arborescence, fichier de config
2. ✅ Design system + header/footer
3. ✅ Porte d'entrée + page d'accueil + catalogue
4. ✅ Fiche produit complète
5. ✅ Panier, code promo, livraison
6. ✅ Supabase (comptes, favoris, avis, newsletter)
7. ✅ Stripe Checkout + webhook + emails (code prêt, test en direct à l'étape 10)
8. ⬜ Compte à rebours + états du drop
9. ⬜ Pages de contenu (à propos, contact, guide des tailles, légales)
10. ⬜ Tests, déploiement, mode réel, domaine

// Tant que le projet Supabase n'est pas créé (étape 6), toutes les
// fonctionnalités qui en dépendent (comptes, favoris, avis, newsletter,
// porte d'entrée) se désactivent proprement au lieu de faire planter le site.
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

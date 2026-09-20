import { createClient } from "@supabase/supabase-js";

// Client "admin" — utilise la clé service role qui contourne la RLS.
// Réservé au webhook Stripe (écriture de commandes) : ne jamais l'importer
// dans un composant ou une route accessible depuis le navigateur.
export const supabaseAdminConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export function createAdminClient() {
  if (!supabaseAdminConfigured) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

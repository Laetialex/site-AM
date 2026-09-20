"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterState = { success?: boolean; error?: string };

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email invalide." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "La newsletter n'est pas encore activée sur ce site." };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  // Code 23505 = email déjà inscrit (contrainte unique) — on l'affiche
  // comme un succès, pas besoin d'exposer cette info à l'utilisateur.
  if (error && error.code !== "23505") {
    return { error: "Une erreur est survenue, réessaie plus tard." };
  }

  return { success: true };
}

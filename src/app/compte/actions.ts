"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: string };

const NOT_CONFIGURED_ERROR = "Les comptes ne sont pas encore activés sur ce site.";

async function getOrigin() {
  // NEXT_PUBLIC_SITE_URL est fiable en production ; en local/preview on
  // retombe sur l'en-tête Host de la requête.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${h.get("host")}`;
}

/** N'autorise que les chemins internes ("/favoris"), jamais une URL externe. */
function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/compte";
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect(next);
}

export async function signUp(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };

  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { prenom },
      emailRedirectTo: `${origin}/auth/callback?next=${next}`,
    },
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return {
        error: "Trop de tentatives d'inscription récentes — réessaie dans quelques minutes.",
      };
    }
    return { error: "Impossible de créer ce compte. Cet email est peut-être déjà utilisé." };
  }

  if (!data.session) {
    return {
      success: "Compte créé — vérifie tes emails pour confirmer ton adresse.",
    };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };

  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/compte/reinitialiser`,
  });

  if (error?.code === "over_email_send_rate_limit") {
    return {
      error: "Trop de demandes récentes — réessaie dans quelques minutes.",
    };
  }

  // Toujours le même message, qu'un compte existe ou non pour cet email
  // (évite de révéler si une adresse est inscrite).
  return {
    success: "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.",
  };
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Le lien a expiré. Refais une demande de réinitialisation." };
  }

  redirect("/compte");
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  if (!supabase) redirect("/compte?oauth_error=1");

  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${next}` },
  });

  if (error || !data.url) {
    redirect("/compte?oauth_error=1");
  }

  redirect(data.url);
}

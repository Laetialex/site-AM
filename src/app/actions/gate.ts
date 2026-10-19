"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE } from "@/lib/gate";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";

const ONE_YEAR = 60 * 60 * 24 * 365;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitGate(formData: FormData) {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!prenom || !isValidEmail(email)) {
    // Filet de sécurité si la validation HTML5 du formulaire est contournée :
    // on ne pose pas le cookie, la porte d'entrée reste affichée.
    redirect("/");
  }

  if (supabaseAdminConfigured) {
    const admin = createAdminClient()!;
    // onConflict: une même adresse qui repasse la porte ne crée pas de doublon.
    const { error } = await admin
      .from("gate_signups")
      .upsert({ prenom, email }, { onConflict: "email", ignoreDuplicates: true });
    if (error) {
      console.error("Erreur enregistrement gate_signups :", error);
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(GATE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  redirect("/");
}

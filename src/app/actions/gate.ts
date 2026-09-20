"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE } from "@/lib/gate";

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

  // TODO (étape 6) : enregistrer { prenom, email } dans la table Supabase
  // gate_signups, une fois le projet Supabase créé.

  const cookieStore = await cookies();
  cookieStore.set(GATE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  redirect("/");
}

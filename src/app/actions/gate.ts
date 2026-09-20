"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE } from "@/lib/gate";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  if (supabase) {
    // onConflict: une même adresse qui repasse la porte ne crée pas de doublon.
    await supabase
      .from("gate_signups")
      .upsert({ prenom, email }, { onConflict: "email", ignoreDuplicates: true });
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

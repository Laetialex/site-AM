"use server";

import { resendConfigured, sendContactEmail } from "@/lib/email";

export type ContactState = { success?: boolean; error?: string };

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Merci de remplir tous les champs." };
  }

  if (!resendConfigured) {
    return { error: "Le formulaire n'est pas encore activé — écris-nous directement par email." };
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch {
    return { error: "Une erreur est survenue, réessaie plus tard." };
  }

  return { success: true };
}

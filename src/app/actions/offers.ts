"use server";

import { cookies } from "next/headers";
import { siteConfig } from "@/config/site.config";
import { getAnthropic, anthropicConfigured } from "@/lib/anthropic";
import { getResend, resendConfigured, renderOfferEmailHtml } from "@/lib/email";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";
import { getOrigin } from "@/lib/origin";
import { ADMIN_COOKIE } from "@/lib/admin";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

export type GenerateOfferState = {
  subject?: string;
  body?: string;
  error?: string;
};

export async function generateOfferEmail(
  _prev: GenerateOfferState,
  formData: FormData,
): Promise<GenerateOfferState> {
  if (!(await isAdmin())) {
    return { error: "Non autorisé." };
  }

  if (!anthropicConfigured) {
    return { error: "La génération IA n'est pas encore configurée (ANTHROPIC_API_KEY manquant)." };
  }

  const brief = String(formData.get("brief") ?? "").trim();
  if (!brief) {
    return { error: "Décris l'offre en quelques mots." };
  }

  const anthropic = getAnthropic()!;

  let raw: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2048,
      output_config: { effort: "low" },
      system: `Tu rédiges des emails marketing pour ${siteConfig.brand.fullName} (marque "${siteConfig.brand.name}"), une marque de streetwear premium au ton sobre, élégant, direct — jamais de superlatifs excessifs ni d'emojis. Réponds UNIQUEMENT avec un objet JSON strict de la forme {"subject": "...", "body": "..."}. "subject" est l'objet de l'email (court, percutant). "body" est le texte de l'email en français, sans balises HTML, sans salutation ni signature (celles-ci sont ajoutées automatiquement par le template). Par défaut reste concis (3 à 5 phrases courtes) ; si la demande précise une longueur ou un niveau de détail différent (ex. "en 15 phrases", "plus détaillé", "version longue"), respecte-la précisément.`,
      messages: [{ role: "user", content: `Rédige un email annonçant : ${brief}` }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { error: "Réponse IA vide, réessaie." };
    }
    raw = textBlock.text.trim();
  } catch (err) {
    console.error("Erreur génération email IA :", err);
    return { error: "Erreur lors de la génération, réessaie dans un instant." };
  }

  // L'IA répond parfois avec un bloc ```json ... ``` malgré la consigne —
  // on retire l'enrobage éventuel avant de parser.
  const jsonText = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");

  let parsed: { subject?: string; body?: string };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { error: "Réponse IA invalide, réessaie." };
  }

  if (!parsed.subject || !parsed.body) {
    return { error: "Réponse IA incomplète, réessaie." };
  }

  return { subject: parsed.subject, body: parsed.body };
}

export async function getSubscriberCount(): Promise<number> {
  if (!(await isAdmin()) || !supabaseAdminConfigured) {
    return 0;
  }
  const admin = createAdminClient()!;
  const { count } = await admin
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export type SendTestState = { success?: boolean; error?: string };

export async function sendTestOfferEmail(
  subject: string,
  body: string,
  testEmail: string,
): Promise<SendTestState> {
  if (!(await isAdmin())) {
    return { error: "Non autorisé." };
  }
  if (!resendConfigured) {
    return { error: "Resend n'est pas encore configuré." };
  }
  if (!subject.trim() || !body.trim() || !testEmail.trim()) {
    return { error: "Sujet, contenu et email de test requis." };
  }

  const origin = await getOrigin();
  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";
  const resend = getResend()!;

  await resend.emails.send({
    from,
    to: testEmail.trim(),
    subject: `[Test] ${subject}`,
    html: renderOfferEmailHtml({
      body,
      // Pas de vrai abonné associé à un envoi de test — lien neutre.
      unsubscribeUrl: `${origin}/api/desinscription?id=test`,
    }),
  });

  return { success: true };
}

export type SendOfferState = { success?: boolean; count?: number; error?: string };

export async function sendOfferEmail(subject: string, body: string): Promise<SendOfferState> {
  if (!(await isAdmin())) {
    return { error: "Non autorisé." };
  }

  if (!resendConfigured) {
    return { error: "Resend n'est pas encore configuré." };
  }
  if (!supabaseAdminConfigured) {
    return { error: "Supabase n'est pas encore configuré." };
  }
  if (!subject.trim() || !body.trim()) {
    return { error: "Sujet et contenu requis." };
  }

  const admin = createAdminClient()!;
  const { data: subscribers, error } = await admin
    .from("newsletter_subscribers")
    .select("id,email");

  if (error) {
    return { error: "Erreur de lecture des abonnés." };
  }
  if (!subscribers || subscribers.length === 0) {
    return { error: "Aucun destinataire pour le moment." };
  }

  const origin = await getOrigin();
  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";
  const resend = getResend()!;

  const emails = subscribers.map((s) => ({
    from,
    to: s.email,
    subject,
    html: renderOfferEmailHtml({
      body,
      unsubscribeUrl: `${origin}/api/desinscription?id=${s.id}`,
    }),
  }));

  const chunkSize = 100;
  for (let i = 0; i < emails.length; i += chunkSize) {
    await resend.batch.send(emails.slice(i, i + chunkSize));
  }

  return { success: true, count: subscribers.length };
}

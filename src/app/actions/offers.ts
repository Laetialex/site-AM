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
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: `Tu rédiges des emails marketing courts pour ${siteConfig.brand.fullName} (marque "${siteConfig.brand.name}"), une marque de streetwear premium au ton sobre, élégant, direct — jamais de superlatifs excessifs ni d'emojis. Réponds UNIQUEMENT avec un objet JSON strict de la forme {"subject": "...", "body": "..."}. "subject" est l'objet de l'email (court, percutant). "body" est le texte de l'email en français, 3 à 5 phrases courtes, sans balises HTML, sans salutation ni signature (celles-ci sont ajoutées automatiquement par le template).`,
      messages: [{ role: "user", content: `Rédige un email annonçant : ${brief}` }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { error: "Réponse IA vide, réessaie." };
    }
    raw = textBlock.text.trim();
  } catch {
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

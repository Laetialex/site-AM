import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { siteConfig } from "@/config/site.config";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail } from "@/lib/email";

function parseItems(metadataItems: string) {
  return metadataItems
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [slug, size, quantity] = entry.split(":");
      const product = siteConfig.products.find((p) => p.slug === slug);
      return {
        slug,
        size,
        quantity: Number(quantity) || 1,
        name: product?.name ?? slug,
        price: product?.price ?? 0,
      };
    });
}

export async function POST(request: NextRequest) {
  if (!stripeConfigured) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const stripe = getStripe()!;
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const items = parseItems(session.metadata?.items ?? "");
    const email = session.customer_details?.email ?? "";

    if (supabaseAdminConfigured) {
      const admin = createAdminClient()!;
      const { error } = await admin.from("orders").insert({
        user_id: session.metadata?.user_id || null,
        email,
        stripe_session_id: session.id,
        items,
        amount_total: session.amount_total ?? 0,
        promo_code: session.metadata?.promo_code || null,
        shipping_address: session.collected_information?.shipping_details ?? null,
        status: "paid",
      });

      // 23505 = webhook déjà traité pour cette session (Stripe peut renvoyer
      // le même événement plusieurs fois) — on ignore, ce n'est pas une erreur.
      if (error && error.code !== "23505") {
        console.error("Erreur enregistrement commande Supabase :", error);
      }
    }

    if (email) {
      try {
        await sendOrderConfirmationEmail({
          to: email,
          items,
          amountTotalCents: session.amount_total ?? 0,
        });
      } catch (err) {
        console.error("Erreur envoi email de confirmation :", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

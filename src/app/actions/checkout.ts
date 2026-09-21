"use server";

import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { findPromoCode, computeDiscount } from "@/lib/promo";
import { computeShipping } from "@/lib/shipping";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/origin";
import { isDropEnded } from "@/lib/drop";
import type { CartItem } from "@/lib/cart";

export type CheckoutState = { error?: string };

export async function createCheckoutSession(
  items: CartItem[],
  promoCode: string | null,
): Promise<CheckoutState> {
  if (!stripeConfigured) {
    return { error: "Le paiement n'est pas encore activé sur ce site." };
  }

  if (isDropEnded()) {
    return { error: `${siteConfig.drop.endedTitle} — ${siteConfig.drop.endedMessage}` };
  }

  if (items.length === 0) {
    return { error: "Ton panier est vide." };
  }

  const lines = items.flatMap((item) => {
    const product = siteConfig.products.find((p) => p.slug === item.slug);
    return product && product.sizes.includes(item.size) ? [{ item, product }] : [];
  });

  if (lines.length === 0) {
    return { error: "Ton panier ne contient plus de produits valides." };
  }

  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + product.price * item.quantity,
    0,
  );
  const promo = findPromoCode(promoCode ?? "");
  const discount = computeDiscount(subtotal, promo);
  const ratio = subtotal > 0 ? (subtotal - discount) / subtotal : 1;
  const shipping = computeShipping(subtotal);

  const stripe = getStripe()!;
  const origin = await getOrigin();
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const line_items = lines.map(({ item, product }) => ({
    quantity: item.quantity,
    price_data: {
      currency: "eur",
      unit_amount: Math.round(product.price * 100 * ratio),
      product_data: {
        name: product.name,
        description: `Taille ${item.size}`,
      },
    },
  }));

  if (shipping > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(shipping * 100),
        product_data: { name: "Livraison", description: "" },
      },
    });
  }

  // Format compact "slug:taille:qte,slug2:taille2:qte2" — plus léger que du
  // JSON pour tenir dans la limite de 500 caractères des métadonnées Stripe.
  const itemsMetadata = lines
    .map(({ item }) => `${item.slug}:${item.size}:${item.quantity}`)
    .join(",");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/panier`,
    customer_email: user?.email,
    client_reference_id: user?.id,
    shipping_address_collection: {
      allowed_countries: siteConfig.shipping.allowedCountries as Array<
        "FR" | "BE" | "CH" | "LU" | "MC"
      >,
    },
    metadata: {
      items: itemsMetadata,
      promo_code: promo?.code ?? "",
      user_id: user?.id ?? "",
    },
  });

  if (!session.url) {
    return { error: "Impossible de créer la session de paiement." };
  }

  redirect(session.url);
}

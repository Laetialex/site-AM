import Stripe from "stripe";

export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripe() {
  if (!stripeConfigured) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

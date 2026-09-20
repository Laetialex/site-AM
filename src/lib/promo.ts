import { siteConfig, type PromoCode } from "@/config/site.config";

export function findPromoCode(code: string): PromoCode | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  return siteConfig.promoCodes.find((p) => p.code.toUpperCase() === normalized);
}

export function computeDiscount(subtotal: number, promo: PromoCode | undefined) {
  if (!promo) return 0;
  const raw = promo.type === "percent" ? (subtotal * promo.value) / 100 : promo.value;
  return Math.min(raw, subtotal);
}

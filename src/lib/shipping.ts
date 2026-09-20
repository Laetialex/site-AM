import { siteConfig } from "@/config/site.config";

/** Frais de port estimés sur le sous-total (avant code promo). */
export function computeShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= siteConfig.shipping.freeAboveAmount ? 0 : siteConfig.shipping.flatRate;
}

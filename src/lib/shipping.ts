import { siteConfig } from "@/config/site.config";

/**
 * Frais de port estimés sur le sous-total (avant code promo). Gratuits au-delà
 * du seuil habituel, ou si le panier contient tous les produits listés dans
 * shipping.freeWithAllProducts (ex. le t-shirt + le sweat achetés ensemble).
 */
export function computeShipping(subtotal: number, itemSlugs: string[] = []) {
  if (subtotal <= 0) return 0;

  const { freeAboveAmount, freeWithAllProducts, flatRate } = siteConfig.shipping;
  const hasBundle = freeWithAllProducts.every((slug) => itemSlugs.includes(slug));

  return hasBundle || subtotal >= freeAboveAmount ? 0 : flatRate;
}

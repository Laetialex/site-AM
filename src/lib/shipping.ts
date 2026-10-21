import { siteConfig } from "@/config/site.config";

/**
 * Frais de port estimés sur le sous-total (avant code promo). Gratuits si le
 * panier contient tous les produits listés dans shipping.freeWithAllProducts
 * (ex. le t-shirt + le sweat achetés ensemble).
 */
export function computeShipping(subtotal: number, itemSlugs: string[] = []) {
  if (subtotal <= 0) return 0;

  const { freeWithAllProducts, flatRate } = siteConfig.shipping;
  const hasBundle = freeWithAllProducts.every((slug) => itemSlugs.includes(slug));

  return hasBundle ? 0 : flatRate;
}

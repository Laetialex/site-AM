import type { Product } from "@/config/site.config";

export function isSoldOut(product: Product) {
  return product.stockDisplayed === 0;
}

export function availabilityLabel(product: Product, { long = false } = {}) {
  if (product.stockDisplayed === null) return "Précommande ouverte";
  if (product.stockDisplayed <= 0) return "Épuisé";
  return long
    ? `Plus que ${product.stockDisplayed} pièces disponibles`
    : `Plus que ${product.stockDisplayed}`;
}

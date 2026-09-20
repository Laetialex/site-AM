import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function StreetwearPage() {
  const products = siteConfig.products.filter((p) => p.universe === "streetwear");

  return (
    <Catalog
      products={products}
      title="Streetwear"
      description="Coupes oversize, pièces signature, esprit rue."
    />
  );
}

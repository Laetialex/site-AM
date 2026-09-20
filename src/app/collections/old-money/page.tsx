import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function OldMoneyPage() {
  const products = siteConfig.products.filter((p) => p.universe === "old-money");

  return (
    <Catalog
      products={products}
      title="Old Money"
      description="Coupes classiques, matières nobles, esprit intemporel."
    />
  );
}

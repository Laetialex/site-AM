import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function SweatsPage() {
  return (
    <Catalog
      products={siteConfig.products}
      lockCategory="sweats"
      title="Sweats"
    />
  );
}

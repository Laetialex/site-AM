import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function TShirtsPage() {
  return (
    <Catalog
      products={siteConfig.products}
      lockCategory="t-shirts"
      title="T-Shirts"
    />
  );
}

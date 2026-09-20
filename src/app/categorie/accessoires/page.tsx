import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function AccessoiresPage() {
  return (
    <Catalog
      products={siteConfig.products}
      lockCategory="accessoires"
      title="Accessoires"
    />
  );
}

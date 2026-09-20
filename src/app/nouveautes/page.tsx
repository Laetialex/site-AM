import { siteConfig } from "@/config/site.config";
import { Catalog } from "@/components/product/Catalog";

export default function NouveautesPage() {
  const products = [...siteConfig.products].sort(
    (a, b) => Number(b.isNew) - Number(a.isNew),
  );

  return (
    <Catalog
      products={products}
      title="Nouveautés"
      description="Les dernières pièces du Drop 01."
    />
  );
}

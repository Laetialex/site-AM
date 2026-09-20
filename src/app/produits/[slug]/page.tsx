import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { PagePlaceholder } from "@/components/PagePlaceholder";

// Fiche produit complète (galerie, tailles, avis, produits associés...) à
// l'étape 4. Pour l'instant on confirme juste que le produit existe.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = siteConfig.products.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <PagePlaceholder
      title={product.name}
      description="La fiche produit complète (galerie, tailles, avis, produits associés) arrive à l'étape 4."
    />
  );
}

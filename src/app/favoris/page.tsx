import { siteConfig } from "@/config/site.config";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";

export default async function FavorisPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user || !supabase) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl">Mes favoris</h1>
        <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
          Connecte-toi pour retrouver les produits que tu as mis de côté.
        </p>
        <Button href="/compte?next=/favoris">Se connecter</Button>
      </Container>
    );
  }

  const { data: rows } = await supabase
    .from("wishlist")
    .select("product_slug")
    .eq("user_id", user.id);

  const slugs = new Set((rows ?? []).map((r) => r.product_slug));
  const products = siteConfig.products.filter((p) => slugs.has(p.slug));

  if (products.length === 0) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl">Mes favoris</h1>
        <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
          Aucun favori pour l&apos;instant. Ajoute des pièces depuis leur
          fiche produit.
        </p>
        <Button href="/nouveautes">Découvrir le drop</Button>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <h1 className="text-center text-4xl sm:text-5xl">Mes favoris</h1>
      <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Container>
  );
}

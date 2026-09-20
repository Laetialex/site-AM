import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { Gallery } from "@/components/product/Gallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { availabilityLabel, isSoldOut } from "@/lib/product";
import { formatPrice } from "@/lib/format";

function findProduct(slug: string) {
  return siteConfig.products.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${siteConfig.brand.name}`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const universeLabel =
    siteConfig.navigation.universes.find((u) => u.id === product.universe)
      ?.label ?? product.universe;

  const related = siteConfig.products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) =>
      a.universe === product.universe && b.universe !== product.universe
        ? -1
        : 0,
    )
    .slice(0, 4);

  return (
    <Container className="flex flex-col gap-16 py-10 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: universeLabel, href: `/collections/${product.universe}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery product={product} />

        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-lg font-light text-am-offwhite-muted">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-sm font-light text-am-offwhite-muted">
            {product.description}
          </p>

          <div className="flex flex-col gap-1 text-sm">
            <span
              className={
                isSoldOut(product) ? "text-am-offwhite-muted" : "text-am-gold"
              }
            >
              {availabilityLabel(product, { long: true })}
            </span>
            <span className="text-am-offwhite-muted">
              Précommande — livraison estimée sous{" "}
              {siteConfig.drop.estimatedDeliveryWeeks} semaines.
            </span>
          </div>

          <AddToCartForm product={product} />

          <div className="border-t border-am-gold/15 pt-6 text-xs font-light text-am-offwhite-muted">
            <p>
              Livraison {siteConfig.shipping.estimatedDays} après expédition
              du drop. Frais de port {formatPrice(siteConfig.shipping.flatRate)}
              , offerts dès {formatPrice(siteConfig.shipping.freeAboveAmount)}{" "}
              d&apos;achat.
            </p>
            <Link
              href="/livraison-retours"
              className="mt-1 inline-block underline underline-offset-4 hover:text-am-gold"
            >
              Livraison &amp; retours
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-8">
          <h2 className="text-center text-2xl sm:text-3xl">
            Vous pourriez aussi aimer
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <ReviewsSection />
    </Container>
  );
}

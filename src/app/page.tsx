import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { SocialProofBanner } from "@/components/SocialProofBanner";

export default function Home() {
  const featured = siteConfig.products.filter((p) => p.isFeaturedInDrop);
  const newArrivals = siteConfig.products.filter((p) => p.isNew);

  return (
    <>
      <Hero />

      {newArrivals.length > 0 && (
        <section className="py-24">
          <Container className="flex flex-col gap-12">
            <Reveal className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
                Nouveautés
              </p>
              <h2 className="text-4xl sm:text-5xl">Fraîchement arrivé</h2>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {newArrivals.map((product, i) => (
                <Reveal key={product.slug} delay={i * 0.08}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section id="drop-01" className="scroll-mt-24 py-24">
        <Container className="flex flex-col gap-12">
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
              {siteConfig.drop.name}
            </p>
            <h2 className="text-4xl sm:text-5xl">La première collection</h2>
            <p className="max-w-md text-sm font-light text-am-offwhite-muted">
              Précommande — livraison estimée sous{" "}
              {siteConfig.drop.estimatedDeliveryWeeks} semaines.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {featured.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Reveal className="flex justify-center">
            <Button href="/nouveautes" variant="secondary">
              Voir toute la collection
            </Button>
          </Reveal>
        </Container>
      </section>

      <SocialProofBanner />
    </>
  );
}

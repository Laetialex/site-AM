import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero/hero-home.svg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* Voile pour garantir un contraste AA au texte quelle que soit l'image. */}
      <div className="absolute inset-0 bg-gradient-to-b from-am-black/70 via-am-black/40 to-am-black/80" />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
          {siteConfig.drop.name}
        </p>
        <h1 className="font-serif text-6xl text-am-offwhite sm:text-7xl">
          {siteConfig.brand.name}
        </h1>
        <p className="max-w-sm text-sm font-light text-am-offwhite/90">
          {siteConfig.drop.heroTagline}
        </p>
        <Button href="#drop-01" className="mt-2">
          {siteConfig.drop.heroCtaLabel}
        </Button>
      </div>
    </section>
  );
}

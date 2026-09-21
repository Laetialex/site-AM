import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { getDropStatus, formatDropDate } from "@/lib/drop";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/home/Countdown";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function Hero() {
  const status = getDropStatus();
  // Composant serveur exécuté une fois par requête : lire l'heure courante
  // ici est voulu (valeur initiale du compte à rebours), pas un effet de
  // bord problématique côté client.
  // eslint-disable-next-line react-hooks/purity
  const endMs = new Date(siteConfig.drop.endDate).getTime() - Date.now();

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

        {status === "ended" ? (
          <>
            <p className="max-w-sm text-sm font-light text-am-offwhite/90">
              {siteConfig.drop.endedMessage}
            </p>
            <div className="mt-2 w-full max-w-xs">
              <NewsletterForm />
            </div>
          </>
        ) : (
          <>
            <p className="max-w-sm text-sm font-light text-am-offwhite/90">
              {siteConfig.drop.heroTagline}
            </p>

            {status === "upcoming" ? (
              <p className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
                Précommande ouverte le {formatDropDate(siteConfig.drop.startDate)}
              </p>
            ) : (
              <Countdown
                targetDate={siteConfig.drop.endDate}
                initialRemainingMs={endMs}
              />
            )}

            <Button href="#drop-01" className="mt-2">
              {siteConfig.drop.heroCtaLabel}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

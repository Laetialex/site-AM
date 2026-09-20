import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Page d'accueil provisoire — le hero cinématique plein écran, les
// apparitions au scroll et la section Drop 01 arrivent à l'étape 3. Cette
// version sert à vérifier le design system (couleurs, typo, composants) et
// le header/footer.
export default function Home() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
        {siteConfig.drop.name}
      </p>
      <h1 className="text-5xl sm:text-6xl">{siteConfig.brand.fullName}</h1>
      <p className="max-w-md text-sm font-light text-am-offwhite-muted">
        {siteConfig.drop.heroTagline}
      </p>
      <Button href="/nouveautes" className="mt-4">
        {siteConfig.drop.heroCtaLabel}
      </Button>
    </Container>
  );
}

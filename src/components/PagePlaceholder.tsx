import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Emplacement pour une page pas encore construite (arrive à une étape
 * suivante). Garde la navigation du site cohérente pendant la construction.
 */
export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
        Bientôt disponible
      </p>
      <h1 className="text-4xl sm:text-5xl">{title}</h1>
      <p className="max-w-md text-sm font-light text-am-offwhite-muted">
        {description}
      </p>
      <Button href="/" variant="secondary" className="mt-4">
        Retour à l&apos;accueil
      </Button>
    </Container>
  );
}

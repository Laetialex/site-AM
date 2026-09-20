import { siteConfig } from "@/config/site.config";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";

function Fallback({ title, description }: { title: string; description: string }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl">{title}</h1>
      <p className="max-w-sm text-sm font-light text-am-offwhite-muted">{description}</p>
      <Button href="/panier" variant="secondary">
        Retour au panier
      </Button>
    </Container>
  );
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!stripeConfigured || !session_id) {
    return (
      <Fallback
        title="Session introuvable"
        description="Aucune commande à afficher ici."
      />
    );
  }

  const stripe = getStripe()!;
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch {
    session = null;
  }

  if (!session || session.payment_status !== "paid") {
    return (
      <Fallback
        title="Paiement introuvable"
        description="Nous n'avons pas retrouvé cette commande. Si le paiement a bien été débité, contacte-nous."
      />
    );
  }

  const lineItems = session.line_items?.data ?? [];

  return (
    <Container className="flex flex-col items-center gap-8 py-16 sm:py-20 text-center">
      <ClearCartOnMount />
      <p className="text-xs tracking-[0.3em] text-am-gold uppercase">
        {siteConfig.drop.name}
      </p>
      <h1 className="text-4xl sm:text-5xl">Précommande confirmée</h1>
      <p className="max-w-md text-sm font-light text-am-offwhite-muted">
        Merci ! Un email de confirmation vient d&apos;être envoyé à{" "}
        {session.customer_details?.email}. Précommande — livraison estimée
        sous {siteConfig.drop.estimatedDeliveryWeeks} semaines.
      </p>

      <div className="flex w-full max-w-sm flex-col gap-3 border border-am-gold/15 p-6 text-left">
        {lineItems.map((line) => (
          <div key={line.id} className="flex justify-between text-sm">
            <span className="text-am-offwhite-muted">
              {line.description} × {line.quantity}
            </span>
            <span className="text-am-offwhite">
              {formatPrice((line.amount_total ?? 0) / 100)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-am-gold/15 pt-2 text-base">
          <span>Total</span>
          <span>{formatPrice((session.amount_total ?? 0) / 100)}</span>
        </div>
      </div>

      <Button href="/nouveautes">Continuer mes achats</Button>
    </Container>
  );
}

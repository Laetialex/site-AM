import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/format";
import { ProsePage } from "@/components/content/ProsePage";

// Modèle de CGV pour une boutique en précommande — à faire relire par un
// professionnel avant la mise en ligne définitive, notamment sur le droit
// de rétractation et les garanties légales.
export default function CgvPage() {
  return (
    <ProsePage title="Conditions générales de vente">
      <p className="rounded border border-am-gold/30 p-4 text-am-gold">
        Page modèle — à faire relire par un professionnel du droit avant la
        mise en ligne définitive.
      </p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent les ventes de produits{" "}
        {siteConfig.brand.name} réalisées sur ce site, exclusivement en
        précommande : les articles ne sont pas en stock au moment de la
        commande et sont produits après la clôture du drop.
      </p>

      <h2>2. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. Les frais
        de livraison sont précisés avant validation de la commande (voir{" "}
        <Link href="/livraison-retours">Livraison &amp; retours</Link>).
      </p>

      <h2>3. Commande et paiement</h2>
      <p>
        La commande est validée après paiement intégral via Stripe
        Checkout (carte bancaire, Apple Pay, PayPal selon disponibilité).
        Un email de confirmation est envoyé à l&apos;adresse renseignée.
      </p>

      <h2>4. Livraison</h2>
      <p>
        Livraison estimée sous {siteConfig.drop.estimatedDeliveryWeeks}{" "}
        semaines à compter de la clôture du drop, vers les zones précisées
        en page{" "}
        <Link href="/livraison-retours">Livraison &amp; retours</Link>. Frais de
        port : {formatPrice(siteConfig.shipping.flatRate)}, offerts dès{" "}
        {formatPrice(siteConfig.shipping.freeAboveAmount)} d&apos;achat.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Conformément aux articles L221-18 et suivants du Code de la
        consommation, tu disposes d&apos;un délai de 14 jours à compter de
        la réception de ta commande pour te rétracter, sans justification
        ni pénalité. Les frais de retour restent à ta charge sauf erreur de
        notre part.
      </p>

      <h2>6. Garanties légales</h2>
      <p>
        Tous les produits bénéficient de la garantie légale de conformité
        (articles L217-3 et suivants du Code de la consommation) et de la
        garantie des vices cachés (articles 1641 et suivants du Code
        civil).
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        {siteConfig.brand.name} ne saurait être tenue responsable des
        retards de livraison dus à un cas de force majeure ou à un
        prestataire tiers (transporteur).
      </p>

      <h2>8. Litiges</h2>
      <p>
        En cas de litige, contacte-nous d&apos;abord à{" "}
        {siteConfig.brand.contactEmail}. À défaut d&apos;accord amiable, le
        litige pourra être porté devant les tribunaux compétents ou soumis
        à un médiateur de la consommation.
      </p>
    </ProsePage>
  );
}

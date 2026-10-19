import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/format";
import { ProsePage } from "@/components/content/ProsePage";

export default function LivraisonRetoursPage() {
  const { shipping, drop } = siteConfig;
  const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });
  const countryList = shipping.allowedCountries
    .map((code) => regionNames.of(code) ?? code)
    .join(", ");

  return (
    <ProsePage title="Livraison & retours">
      <h2>Précommande</h2>
      <p>
        Le drop actuel fonctionne en précommande : aucune pièce n&apos;est en
        stock, la production démarre après la fin des précommandes.
        Livraison estimée sous {drop.estimatedDeliveryText} à compter de la
        clôture du drop.
      </p>

      <h2>Frais de port</h2>
      <p>
        {formatPrice(shipping.flatRate)} pour toute commande, offerts dès{" "}
        {formatPrice(shipping.freeAboveAmount)} d&apos;achat. Délai
        d&apos;acheminement estimé : {shipping.estimatedDays} après
        expédition.
      </p>
      <p className="rounded border border-am-gold/30 p-4 text-am-gold">
        Offre en cours : livraison <strong>gratuite</strong> si tu commandes
        le t-shirt Build Your Life et le sweat Heritage Excellence ensemble,
        quel que soit le montant total.
      </p>

      <h2>Zones de livraison</h2>
      <p>Nous livrons actuellement dans toute l&apos;Europe : {countryList}.</p>

      <h2>Droit de rétractation</h2>
      <p>
        Conformément au Code de la consommation, tu disposes de 14 jours à
        compter de la réception de ta commande pour exercer ton droit de
        rétractation, sans avoir à justifier de motif. Écris-nous à{" "}
        {siteConfig.brand.contactEmail} pour lancer un retour.
      </p>

      <h2>Retours</h2>
      <p>
        Les articles doivent être retournés neufs, non portés et dans leur
        emballage d&apos;origine. Les frais de retour restent à ta charge
        sauf erreur de notre part. Le remboursement intervient sous 14 jours
        après réception du colis retourné.
      </p>
    </ProsePage>
  );
}

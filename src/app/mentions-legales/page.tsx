import { siteConfig } from "@/config/site.config";
import { ProsePage } from "@/components/content/ProsePage";

// Modèle à compléter avec tes vraies informations légales (structure
// juridique, SIRET, adresse...) avant la mise en ligne définitive. Fais-le
// relire par un professionnel si tu n'es pas sûr·e d'un point.
export default function MentionsLegalesPage() {
  return (
    <ProsePage title="Mentions légales">
      <p className="rounded border border-am-gold/30 p-4 text-am-gold">
        Page modèle — remplace les informations entre crochets par les
        tiennes avant la mise en ligne définitive.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        [Nom de la société ou de l&apos;entrepreneur individuel]
        <br />
        [Forme juridique — SASU, EI, etc.]
        <br />
        [Adresse du siège social]
        <br />
        [Numéro SIRET]
        <br />
        [Numéro de TVA intracommunautaire, si applicable]
        <br />
        Contact : {siteConfig.brand.contactEmail}
        <br />
        Directeur de la publication : [Nom]
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
        CA 91789, États-Unis.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur ce site (textes, images,
        logos, marque {siteConfig.brand.name}) est protégé par le droit de
        la propriété intellectuelle. Toute reproduction sans autorisation
        préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les informations collectées via ce site (porte d&apos;entrée,
        création de compte, commande, newsletter) sont traitées
        conformément au RGPD. Tu peux exercer tes droits d&apos;accès, de
        rectification et de suppression en écrivant à{" "}
        {siteConfig.brand.contactEmail}.
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site utilise uniquement des cookies techniques nécessaires à son
        fonctionnement (panier, session de connexion).
      </p>
    </ProsePage>
  );
}

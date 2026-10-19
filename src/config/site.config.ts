/**
 * Fichier de configuration unique du site AM.
 *
 * Toutes les données qui changent souvent (dates du drop, produits, prix,
 * stock affiché, frais de livraison, codes promo, preuve sociale) vivent
 * ici. Modifie ce fichier pour mettre le site à jour, sans toucher au reste
 * du code.
 */

export type Universe = "old-money" | "streetwear";
export type ProductCategory = "t-shirts" | "sweats" | "accessoires";
export type Audience = "homme" | "femme" | "mixte";

export interface ProductImages {
  /** Photo produit seul, de face. */
  face: string;
  /** Photo produit porté. */
  porte: string;
  /** Photo de détail (matière, finitions...). */
  detail: string;
}

export interface Product {
  /** Identifiant unique utilisé dans l'URL (/produits/<slug>). */
  slug: string;
  name: string;
  universe: Universe;
  category: ProductCategory;
  /** Rayon du sélecteur Homme/Femme/Enfant du header. */
  audience: Audience;
  /** Prix en euros (ex. 65 pour 65,00 €). */
  price: number;
  shortDescription: string;
  description: string;
  /** Tailles disponibles, dans l'ordre d'affichage. */
  sizes: string[];
  images: ProductImages;
  /**
   * Nombre de pièces affiché pour la précommande.
   * - un nombre : "Plus que X pièces disponibles", puis "Épuisé" à 0
   * - null : pas de compteur affiché, juste "Précommande ouverte"
   */
  stockDisplayed: number | null;
  isNew: boolean;
  /** Mis en avant dans la section "Drop 01" de la page d'accueil. */
  isFeaturedInDrop: boolean;
}

export interface PromoCode {
  code: string;
  /** "percent" = pourcentage, "amount" = montant fixe en euros. */
  type: "percent" | "amount";
  value: number;
  description: string;
}

export const siteConfig = {
  brand: {
    name: "AM",
    tagline: "AM — Streetwear premium",
    // Résumé utilisé dans les métadonnées (SEO, partages sociaux).
    description:
      "AM — vêtements streetwear premium en précommande. Édition limitée, sans stock permanent.",
    social: {
      instagram: "https://instagram.com/am.society.official",
      tiktok: "https://tiktok.com/@am.society.official",
    },
    contactEmail: "alexandremusto69@gmail.com",
  },

  /** Porte d'entrée prénom + email avant d'accéder au site. */
  gate: {
    enabled: false,
    title: "Bienvenue chez AM",
    subtitle: "Entre ton prénom et ton email pour découvrir le drop.",
  },

  /** Drop en cours. */
  drop: {
    name: "Drop 01",
    // Dates au format ISO 8601, fuseau Europe/Paris implicite.
    startDate: "2026-09-20T00:00:00+02:00",
    endDate: "2026-10-20T23:59:59+02:00",
    estimatedDeliveryWeeks: 6,
    // Affiche le compte à rebours sur la page d'accueil. Passe à true pour
    // le réactiver (ex. juste avant la fin du drop).
    showCountdown: false,
    heroTagline: "La première collection AM. Précommande limitée.",
    heroCtaLabel: "Découvrir le drop",
    endedTitle: "Drop terminé",
    endedMessage: "Prochain drop bientôt. Inscris-toi pour être prévenu·e en premier.",
  },

  navigation: {
    audiences: [
      { id: "homme" as Audience, label: "Homme" },
      { id: "femme" as Audience, label: "Femme" },
    ],
    universes: [
      { id: "old-money" as Universe, label: "Old Money" },
      { id: "streetwear" as Universe, label: "Streetwear" },
    ],
    categories: [
      { id: "t-shirts" as ProductCategory, label: "T-Shirts" },
      { id: "sweats" as ProductCategory, label: "Sweats" },
      { id: "accessoires" as ProductCategory, label: "Accessoires" },
    ],
  },

  shipping: {
    flatRate: 4.9,
    freeAboveAmount: 120,
    estimatedDays: "3 à 5 jours ouvrés",
    // Codes pays ISO 3166-1 alpha-2 — Stripe Checkout ne proposera que ceux-ci
    // à l'étape adresse de livraison.
    allowedCountries: ["FR", "BE", "CH", "LU", "MC"],
  },

  promoCodes: [
    {
      code: "BIENVENUE10",
      type: "percent",
      value: 10,
      description: "10% de réduction pour une première commande",
    },
  ] satisfies PromoCode[],

  /** Bandeau de preuve sociale — reste masqué tant que enabled = false. */
  socialProof: {
    enabled: false,
    bannerText: "Vu sur Instagram / TikTok",
    customersCount: null as number | null,
    testimonials: [] as { author: string; text: string; rating: number }[],
  },

  /**
   * Guide des tailles. Seule la taille L a été mesurée pour l'instant sur
   * le t-shirt Build Your Life et le sweat Heritage Excellence — ajoute
   * les autres tailles ici dès que tu as les mesures (plutôt que d'inventer
   * des chiffres non vérifiés).
   */
  sizeGuide: {
    unit: "cm",
    measurements: [
      { size: "T-shirt Build Your Life — L", chest: 55, length: 75, shoulders: 0 },
      { size: "Sweat Heritage Excellence — L", chest: 50, length: 70, shoulders: 0 },
    ],
    adviceText:
      "Mesures prises à plat sur l'échantillon taille L : d'aisselle à aisselle pour la largeur, du col au bas pour la longueur. Les autres tailles seront ajoutées dès que mesurées — contacte-nous si tu as besoin d'une taille précise avant.",
  },

  /**
   * Catalogue produits du Drop 01.
   * Les images pointent vers /public/images/products/ — remplace les
   * fichiers .svg par tes vraies photos en gardant les mêmes noms (ou mets
   * à jour les chemins ici si tu utilises d'autres noms/formats).
   */
  products: [
    {
      slug: "t-shirt-build-your-life",
      name: "T-Shirt Build Your Life",
      universe: "old-money",
      category: "t-shirts",
      audience: "mixte",
      price: 24.99,
      shortDescription: "T-shirt noir, logo rose AM brodé, sérigraphie dos vintage.",
      description:
        "T-shirt noir uni, petit logo AM brodé façon rose sur la poitrine, sérigraphie \"Build Your Life\" au dos avec illustration automobile vintage et devise Old Money. Une pièce signature entre discrétion et déclaration.",
      sizes: ["S", "M", "L", "XL"],
      images: {
        face: "/images/products/tshirt-build-your-life-face.webp",
        porte: "/images/products/tshirt-build-your-life-face.webp",
        detail: "/images/products/tshirt-build-your-life-detail.webp",
      },
      stockDisplayed: null,
      isNew: true,
      isFeaturedInDrop: true,
    },
    {
      slug: "echarpe-laine-signature",
      name: "Écharpe en Laine Signature",
      universe: "old-money",
      category: "accessoires",
      audience: "mixte",
      price: 45,
      shortDescription: "Écharpe en laine mélangée, monogramme tissé.",
      description:
        "Écharpe épaisse en laine mélangée, finitions franges, monogramme AM tissé aux extrémités. Taille unique.",
      sizes: ["Taille unique"],
      images: {
        face: "/images/products/echarpe-laine-signature-face.svg",
        porte: "/images/products/echarpe-laine-signature-porte.svg",
        detail: "/images/products/echarpe-laine-signature-detail.svg",
      },
      stockDisplayed: 15,
      isNew: false,
      isFeaturedInDrop: true,
    },
    {
      slug: "sweat-heritage-excellence",
      name: "Sweat Heritage Excellence",
      universe: "old-money",
      category: "sweats",
      audience: "mixte",
      price: 34.99,
      shortDescription: "Sweat marine, écusson AM brodé, sérigraphie dos \"Heritage Inspires Excellence\".",
      description:
        "Sweat col rond marine, écusson AM brodé façon blason sur la poitrine, sérigraphie \"Heritage Inspires Excellence\" au dos. Coupe droite, matière épaisse, pour les jours où la discrétion fait l'allure.",
      sizes: ["S", "M", "L", "XL"],
      images: {
        face: "/images/products/sweat-heritage-excellence-face.webp",
        porte: "/images/products/sweat-heritage-excellence-face.webp",
        detail: "/images/products/sweat-heritage-excellence-detail.webp",
      },
      stockDisplayed: null,
      isNew: true,
      isFeaturedInDrop: true,
    },
    {
      slug: "casquette-brodee-am",
      name: "Casquette Brodée AM",
      universe: "streetwear",
      category: "accessoires",
      audience: "mixte",
      price: 40,
      shortDescription: "Casquette 6 panneaux, logo AM brodé, strap ajustable.",
      description:
        "Casquette structurée 6 panneaux, logo AM brodé en relief, strap arrière ajustable avec boucle métal gravée.",
      sizes: ["Taille unique"],
      images: {
        face: "/images/products/casquette-brodee-am-face.svg",
        porte: "/images/products/casquette-brodee-am-porte.svg",
        detail: "/images/products/casquette-brodee-am-detail.svg",
      },
      stockDisplayed: 0,
      isNew: false,
      isFeaturedInDrop: false,
    },
  ] satisfies Product[],
};

export type SiteConfig = typeof siteConfig;

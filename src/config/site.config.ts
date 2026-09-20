/**
 * Fichier de configuration unique du site AM.
 *
 * Toutes les données qui changent souvent (dates du drop, produits, prix,
 * stock affiché, frais de livraison, codes promo, preuve sociale) vivent
 * ici. Modifie ce fichier pour mettre le site à jour, sans toucher au reste
 * du code.
 */

export type Universe = "old-money" | "streetwear";
export type ProductCategory = "t-shirts" | "accessoires";
export type Audience = "homme" | "femme" | "enfant" | "mixte";

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
    fullName: "All Money",
    tagline: "All Money — Streetwear premium",
    // Résumé utilisé dans les métadonnées (SEO, partages sociaux).
    description:
      "AM (All Money) — vêtements streetwear premium en précommande. Édition limitée, sans stock permanent.",
    social: {
      instagram: "https://instagram.com/allmoney", // à remplacer par le vrai compte
      tiktok: "https://tiktok.com/@allmoney", // à remplacer par le vrai compte
    },
    contactEmail: "contact@allmoney.example", // à remplacer
  },

  /** Porte d'entrée prénom + email avant d'accéder au site. */
  gate: {
    enabled: true,
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
    heroTagline: "La première collection AM. Précommande limitée.",
    heroCtaLabel: "Découvrir le drop",
    endedTitle: "Drop terminé",
    endedMessage: "Prochain drop bientôt. Inscris-toi pour être prévenu·e en premier.",
  },

  navigation: {
    audiences: [
      { id: "homme" as Audience, label: "Homme" },
      { id: "femme" as Audience, label: "Femme" },
      { id: "enfant" as Audience, label: "Enfant" },
    ],
    universes: [
      { id: "old-money" as Universe, label: "Old Money" },
      { id: "streetwear" as Universe, label: "Streetwear" },
    ],
    categories: [
      { id: "t-shirts" as ProductCategory, label: "T-Shirts" },
      { id: "accessoires" as ProductCategory, label: "Accessoires" },
    ],
  },

  shipping: {
    flatRate: 4.9,
    freeAboveAmount: 120,
    estimatedDays: "3 à 5 jours ouvrés",
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

  /** Guide des tailles — à compléter avec de vraies mesures. */
  sizeGuide: {
    unit: "cm",
    // Une ligne par taille ; ajoute/retire des colonnes selon tes besoins.
    measurements: [
      { size: "S", chest: 0, length: 0, shoulders: 0 },
      { size: "M", chest: 0, length: 0, shoulders: 0 },
      { size: "L", chest: 0, length: 0, shoulders: 0 },
      { size: "XL", chest: 0, length: 0, shoulders: 0 },
    ],
    adviceText:
      "Mesure un vêtement que tu portes déjà à plat, d'aisselle à aisselle pour la largeur, du col au bas pour la longueur.",
  },

  /**
   * Catalogue produits du Drop 01.
   * Les images pointent vers /public/images/products/ — remplace les
   * fichiers .svg par tes vraies photos en gardant les mêmes noms (ou mets
   * à jour les chemins ici si tu utilises d'autres noms/formats).
   */
  products: [
    {
      slug: "t-shirt-col-polo-creme",
      name: "T-Shirt Col Polo Crème",
      universe: "old-money",
      category: "t-shirts",
      audience: "mixte",
      price: 65,
      shortDescription: "T-shirt col polo en coton lourd, coupe droite.",
      description:
        "Un basique repensé : coton épais 260g/m², col polo structuré, broderie discrète AM sur la poitrine. Une pièce intemporelle, pensée pour durer.",
      sizes: ["S", "M", "L", "XL"],
      images: {
        face: "/images/products/tshirt-col-polo-creme-face.svg",
        porte: "/images/products/tshirt-col-polo-creme-porte.svg",
        detail: "/images/products/tshirt-col-polo-creme-detail.svg",
      },
      stockDisplayed: 24,
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
      slug: "t-shirt-oversize-logo-am",
      name: "T-Shirt Oversize Logo AM",
      universe: "streetwear",
      category: "t-shirts",
      audience: "mixte",
      price: 70,
      shortDescription: "T-shirt oversize, gros logo AM imprimé dans le dos.",
      description:
        "Coupe oversize, coton épais délavé, gros logo AM sérigraphié au dos, petit logo poitrine. La pièce signature du Drop 01.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: {
        face: "/images/products/tshirt-oversize-logo-am-face.svg",
        porte: "/images/products/tshirt-oversize-logo-am-porte.svg",
        detail: "/images/products/tshirt-oversize-logo-am-detail.svg",
      },
      stockDisplayed: 8,
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

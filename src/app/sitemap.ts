import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://site-am-ten.vercel.app";

const staticRoutes = [
  "",
  "/nouveautes",
  "/a-propos",
  "/contact",
  "/guide-des-tailles",
  "/livraison-retours",
  "/cgv",
  "/mentions-legales",
  "/collections",
  "/collections/old-money",
  "/collections/streetwear",
  "/categorie/t-shirts",
  "/categorie/sweats",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
  }));

  const productEntries = siteConfig.products.map((product) => ({
    url: `${BASE_URL}/produits/${product.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...productEntries];
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Nos placeholders sont des SVG maison (pas de contenu externe/utilisateur),
    // donc pas de risque XSS à les laisser passer par next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

import { siteConfig } from "@/config/site.config";

// Masqué tant que siteConfig.socialProof.enabled est à false — active-le
// et renseigne les vraies valeurs quand tu as de quoi l'afficher.
export function SocialProofBanner() {
  const { socialProof } = siteConfig;
  if (!socialProof.enabled) return null;

  return (
    <div className="border-y border-am-gold/15 bg-am-black-soft py-4 text-center">
      <p className="text-xs tracking-[0.2em] text-am-gold uppercase">
        {socialProof.bannerText}
        {socialProof.customersCount !== null && (
          <span className="ml-2 text-am-offwhite-muted normal-case">
            — {socialProof.customersCount.toLocaleString("fr-FR")} client·e·s
          </span>
        )}
      </p>
    </div>
  );
}

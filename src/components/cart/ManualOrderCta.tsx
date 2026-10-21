import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/lib/cart";
import type { Product } from "@/config/site.config";

export function ManualOrderCta({
  lines,
  total,
}: {
  lines: { item: CartItem; product: Product }[];
  total: number;
}) {
  const summary = lines
    .map(({ item, product }) => `- ${product.name} — Taille ${item.size} ×${item.quantity}`)
    .join("\n");

  const emailBody = `Bonjour, je souhaite commander :\n${summary}\n\nTotal : ${formatPrice(total)}\n\nMerci de me recontacter pour finaliser le paiement par virement.`;
  const mailtoHref = `mailto:${siteConfig.brand.contactEmail}?subject=${encodeURIComponent(
    "Commande AM",
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="flex flex-col gap-4 border-t border-am-gold/15 pt-4 text-center">
      <p className="text-sm text-am-offwhite">
        Le paiement en ligne n&apos;est pas encore activé — contacte-nous avec ton récapitulatif
        ci-dessus, le paiement se fait par virement bancaire.
      </p>
      <div className="flex flex-col gap-2">
        <Button href={siteConfig.brand.social.instagram} className="w-full">
          Commander sur Instagram
        </Button>
        <Button href={siteConfig.brand.social.tiktok} variant="secondary" className="w-full">
          Commander sur TikTok
        </Button>
        <Button href={mailtoHref} variant="secondary" className="w-full">
          Commander par email
        </Button>
      </div>
      <p className="text-xs font-light text-am-offwhite-muted">
        Précommande — livraison estimée sous {siteConfig.drop.estimatedDeliveryText}.
      </p>
    </div>
  );
}

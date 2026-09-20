import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/config/site.config";
import type { CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartLineItem({
  item,
  product,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  product: Product;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const maxQuantity =
    product.stockDisplayed !== null ? Math.max(product.stockDisplayed, 1) : 10;

  return (
    <div className="flex gap-4 border-b border-am-gold/10 py-6 first:pt-0">
      <Link
        href={`/produits/${product.slug}`}
        className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-am-black-soft sm:w-24"
      >
        <Image src={product.images.face} alt={product.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/produits/${product.slug}`}
              className="text-sm text-am-offwhite transition-colors hover:text-am-gold sm:text-base"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-xs text-am-offwhite-muted">Taille {item.size}</p>
          </div>
          <p className="text-sm font-light text-am-offwhite whitespace-nowrap sm:text-base">
            {formatPrice(product.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center border border-am-offwhite/25">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="px-3 py-1 text-am-offwhite transition-colors hover:text-am-gold disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              disabled={item.quantity >= maxQuantity}
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="px-3 py-1 text-am-offwhite transition-colors hover:text-am-gold disabled:cursor-not-allowed disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-am-offwhite-muted underline underline-offset-4 transition-colors hover:text-am-gold"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/config/site.config";
import { formatPrice } from "@/lib/format";

function availabilityLabel(product: Product) {
  if (product.stockDisplayed === null) return "Précommande ouverte";
  if (product.stockDisplayed <= 0) return "Épuisé";
  return `Plus que ${product.stockDisplayed}`;
}

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stockDisplayed === 0;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-am-black-soft">
        <Image
          src={product.images.face}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            soldOut ? "opacity-50" : ""
          }`}
        />
        {product.isNew && !soldOut && (
          <span className="absolute top-3 left-3 bg-am-gold px-2 py-1 text-[10px] tracking-[0.15em] text-am-black uppercase">
            Nouveau
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-normal text-am-offwhite">
          {product.name}
        </h3>
        <div className="flex items-center justify-between text-sm font-light text-am-offwhite-muted">
          <span>{formatPrice(product.price)}</span>
          <span className={soldOut ? "text-am-offwhite-muted" : "text-am-gold"}>
            {availabilityLabel(product)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="aspect-[4/5] bg-am-offwhite/8" />
      <div className="h-4 w-3/4 bg-am-offwhite/8" />
      <div className="h-4 w-1/2 bg-am-offwhite/8" />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Product } from "@/config/site.config";
import { useCart } from "@/lib/cart";
import { isSoldOut } from "@/lib/product";
import { Button } from "@/components/ui/Button";

export function AddToCartForm({
  product,
  dropEnded = false,
}: {
  product: Product;
  dropEnded?: boolean;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const soldOut = isSoldOut(product);
  const disabled = dropEnded || soldOut;
  const maxQuantity =
    product.stockDisplayed !== null ? Math.max(product.stockDisplayed, 1) : 10;

  function handleAdd() {
    if (!size || disabled) return;
    addItem(product.slug, size, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const label = dropEnded
    ? "Drop terminé"
    : soldOut
      ? "Épuisé"
      : justAdded
        ? "Ajouté ✓"
        : size
          ? "Ajouter au panier"
          : "Choisis une taille";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs tracking-[0.15em] text-am-offwhite-muted uppercase">
          Taille
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              disabled={disabled}
              aria-pressed={size === s}
              className={`border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                size === s
                  ? "border-am-gold bg-am-gold text-am-black"
                  : "border-am-offwhite/25 text-am-offwhite hover:border-am-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs tracking-[0.15em] text-am-offwhite-muted uppercase">
          Quantité
        </p>
        <div className="inline-flex items-center border border-am-offwhite/25">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            disabled={disabled || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-am-offwhite transition-colors hover:text-am-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Augmenter la quantité"
            disabled={disabled || quantity >= maxQuantity}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="px-4 py-2 text-am-offwhite transition-colors hover:text-am-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        disabled={!size || disabled}
        className="sticky bottom-4 w-full sm:static"
      >
        {label}
      </Button>
    </div>
  );
}

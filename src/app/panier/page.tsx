"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site.config";
import { useCart } from "@/lib/cart";
import { findPromoCode, computeDiscount } from "@/lib/promo";
import { computeShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";
import { isDropEnded } from "@/lib/drop";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PaymentLogos } from "@/components/PaymentLogos";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export default function PanierPage() {
  const { items, promoCode, updateQuantity, removeItem, setPromoCode } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const dropEnded = isDropEnded();

  const lines = items.flatMap((item) => {
    const product = siteConfig.products.find((p) => p.slug === item.slug);
    return product ? [{ item, product }] : [];
  });

  const subtotal = lines.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0);
  const promo = findPromoCode(promoCode ?? "");
  const discount = computeDiscount(subtotal, promo);
  const shipping = computeShipping(subtotal);
  const total = subtotal - discount + shipping;

  function handleApplyPromo(event: React.FormEvent) {
    event.preventDefault();
    const found = findPromoCode(promoInput);
    if (!found) {
      setPromoError(true);
      return;
    }
    setPromoError(false);
    setPromoCode(found.code);
    setPromoInput("");
  }

  if (lines.length === 0) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl">Panier</h1>
        <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
          Ton panier est vide pour l&apos;instant.
        </p>
        <Button href="/nouveautes">Découvrir le drop</Button>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <h1 className="text-4xl sm:text-5xl">Panier</h1>

      <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col lg:col-span-2">
          {lines.map(({ item, product }) => (
            <CartLineItem
              key={`${item.slug}-${item.size}`}
              item={item}
              product={product}
              onQuantityChange={(quantity) => updateQuantity(item.slug, item.size, quantity)}
              onRemove={() => removeItem(item.slug, item.size)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6 border border-am-gold/15 p-6">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-am-offwhite-muted">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {promo && (
              <div className="flex justify-between text-am-gold">
                <span>
                  Code {promo.code}
                  {promo.type === "percent" ? ` (-${promo.value}%)` : ""}
                </span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-am-offwhite-muted">
              <span>Livraison estimée</span>
              <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-am-offwhite-muted">
                Offerte dès {formatPrice(siteConfig.shipping.freeAboveAmount)} d&apos;achat.
              </p>
            )}
            <div className="mt-2 flex justify-between border-t border-am-gold/15 pt-2 text-base text-am-offwhite">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {promo ? (
            <div className="flex items-center justify-between text-xs text-am-offwhite-muted">
              <span>Code {promo.code} appliqué</span>
              <button
                type="button"
                onClick={() => setPromoCode(null)}
                className="underline underline-offset-4 hover:text-am-gold"
              >
                Retirer
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError(false);
                  }}
                  placeholder="Code promo"
                  aria-label="Code promo"
                  aria-invalid={promoError}
                  className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
                />
                <Button type="submit" variant="secondary" className="px-5 py-2 whitespace-nowrap">
                  Appliquer
                </Button>
              </div>
              {promoError && (
                <p role="alert" className="text-xs text-am-gold">
                  Ce code promo n&apos;est pas valide.
                </p>
              )}
            </form>
          )}

          <PaymentLogos className="justify-center border-t border-am-gold/15 pt-4" />

          {dropEnded ? (
            <div className="flex flex-col gap-3 border-t border-am-gold/15 pt-4 text-center">
              <p className="text-sm text-am-gold">{siteConfig.drop.endedTitle}</p>
              <p className="text-xs font-light text-am-offwhite-muted">
                {siteConfig.drop.endedMessage}
              </p>
              <Button type="button" disabled className="w-full">
                Passer au paiement
              </Button>
              <NewsletterForm />
            </div>
          ) : (
            <>
              <CheckoutButton items={items} promoCode={promo?.code ?? null} />
              <p className="text-center text-xs font-light text-am-offwhite-muted">
                Précommande — livraison estimée sous{" "}
                {siteConfig.drop.estimatedDeliveryWeeks} semaines.
              </p>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

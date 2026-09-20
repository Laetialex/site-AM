"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/app/actions/checkout";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/lib/cart";

export function CheckoutButton({
  items,
  promoCode,
}: {
  items: CartItem[];
  promoCode: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(items, promoCode);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleClick} disabled={pending} className="w-full">
        {pending ? "..." : "Passer au paiement"}
      </Button>
      {error && (
        <p role="alert" className="text-center text-xs text-am-gold">
          {error}
        </p>
      )}
    </div>
  );
}

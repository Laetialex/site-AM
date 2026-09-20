"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Vide le panier une fois le paiement confirmé (page de confirmation). */
export function ClearCartOnMount() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}

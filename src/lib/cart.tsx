"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = { slug: string; size: string; quantity: number };

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
}

interface CartContextValue extends StoredCart {
  addItem: (slug: string, size: string, quantity: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  setPromoCode: (code: string | null) => void;
  clear: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "am_cart";

// Panier client (localStorage) : items + code promo appliqué. La page
// /panier (étape 5) lit cet état pour calculer sous-total, réduction et
// frais de port ; le checkout Stripe arrive à l'étape 7.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCodeState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // localStorage n'existe pas côté serveur : cette hydratation ne peut se
      // faire qu'après le montage, donc dans un effet.
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredCart>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.promoCode) setPromoCodeState(parsed.promoCode);
      }
    } catch {
      // localStorage indisponible (navigation privée...) — panier en mémoire seulement.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promoCode }));
    } catch {
      // idem
    }
  }, [items, promoCode, hydrated]);

  const addItem = useCallback((slug: string, size: string, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { slug, size, quantity }];
    });
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i)),
    );
  }, []);

  const setPromoCode = useCallback((code: string | null) => {
    setPromoCodeState(code);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setPromoCodeState(null);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        promoCode,
        addItem,
        removeItem,
        updateQuantity,
        setPromoCode,
        clear,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  return ctx;
}

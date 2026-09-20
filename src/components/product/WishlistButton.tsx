"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HeartIcon } from "@/components/icons";

export function WishlistButton({
  productSlug,
  userId,
  initialActive,
}: {
  productSlug: string;
  userId: string | null;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (!userId) {
      router.push(`/compte?next=/produits/${productSlug}`);
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setPending(true);
    if (active) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_slug", productSlug);
      setActive(false);
    } else {
      await supabase
        .from("wishlist")
        .insert({ user_id: userId, product_slug: productSlug });
      setActive(true);
    }
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`inline-flex shrink-0 items-center gap-2 text-sm whitespace-nowrap transition-colors disabled:opacity-50 ${
        active ? "text-am-gold" : "text-am-offwhite-muted hover:text-am-gold"
      }`}
    >
      <HeartIcon fill={active ? "currentColor" : "none"} />
      <span className="hidden sm:inline">
        {active ? "Dans mes favoris" : "Ajouter aux favoris"}
      </span>
    </button>
  );
}

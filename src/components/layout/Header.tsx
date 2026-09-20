"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { IconButton } from "@/components/ui/IconButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";

// Le compteur panier sera branché sur un vrai état à l'étape 5.
const CART_COUNT = 0;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-am-gold/15 bg-am-black/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Ouvrir le menu"
              onClick={() => setMenuOpen(true)}
              className="text-am-offwhite transition-colors hover:text-am-gold"
            >
              <MenuIcon />
            </button>
            <Link
              href="/"
              className="font-serif text-lg tracking-[0.2em] text-am-offwhite"
            >
              AM
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              label="Rechercher"
              onClick={() => setSearchOpen((v) => !v)}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
            <IconButton label="Mes favoris" href="/favoris">
              <HeartIcon />
            </IconButton>
            <IconButton label="Mon compte" href="/compte">
              <UserIcon />
            </IconButton>
            <IconButton label="Panier" href="/panier" badge={CART_COUNT}>
              <BagIcon />
            </IconButton>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="border-t border-am-gold/15 px-4 py-3 sm:px-6"
          >
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full border-b border-am-offwhite/30 bg-transparent py-1 text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
            />
          </form>
        )}

        <div className="flex items-center justify-center gap-6 border-t border-am-gold/10 py-2 text-[11px] tracking-[0.2em] text-am-offwhite-muted uppercase">
          {siteConfig.navigation.audiences.map((audience) => (
            <Link
              key={audience.id}
              href={`/nouveautes?public=${audience.id}`}
              className="transition-colors hover:text-am-gold"
            >
              {audience.label}
            </Link>
          ))}
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/config/site.config";
import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";

type CategoryFilter = ProductCategory | "toutes";
type SizeFilter = string | "toutes";

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-1.5 text-xs tracking-[0.1em] uppercase transition-colors ${
        active
          ? "border-am-gold bg-am-gold text-am-black"
          : "border-am-offwhite/25 text-am-offwhite-muted hover:border-am-gold hover:text-am-gold"
      }`}
    >
      {children}
    </button>
  );
}

export function Catalog({
  products,
  title,
  description,
  lockCategory,
}: {
  products: Product[];
  title: string;
  description?: string;
  /** Masque le filtre catégorie quand la page est déjà scopée (ex. /categorie/t-shirts). */
  lockCategory?: ProductCategory;
}) {
  const [category, setCategory] = useState<CategoryFilter>("toutes");
  const [size, setSize] = useState<SizeFilter>("toutes");
  const [priceMax, setPriceMax] = useState<number | "">("");

  // Simule un court chargement à chaque changement de filtre (et au montage)
  // — préfigure le jour où le catalogue viendra d'une vraie requête.
  const filterKey = `${category}|${size}|${priceMax}`;
  const [loading, setLoading] = useState(true);
  const [trackedKey, setTrackedKey] = useState(filterKey);
  if (filterKey !== trackedKey) {
    setTrackedKey(filterKey);
    setLoading(true);
  }

  // Sous-ensemble déjà scopé par la page (ex. /categorie/t-shirts) — les
  // tailles et le prix max proposés dans les filtres ne portent que sur ces
  // produits, pour ne jamais proposer un filtre qui viderait la liste.
  const scoped = useMemo(
    () => (lockCategory ? products.filter((p) => p.category === lockCategory) : products),
    [products, lockCategory],
  );

  const availableSizes = useMemo(() => {
    const all = new Set<string>();
    scoped.forEach((p) => p.sizes.forEach((s) => all.add(s)));
    return Array.from(all);
  }, [scoped]);

  const highestPrice = useMemo(
    () => Math.max(...scoped.map((p) => p.price), 0),
    [scoped],
  );

  const filtered = useMemo(() => {
    return scoped.filter((p) => {
      if (category !== "toutes" && p.category !== category) return false;
      if (size !== "toutes" && !p.sizes.includes(size)) return false;
      if (priceMax !== "" && p.price > priceMax) return false;
      return true;
    });
  }, [scoped, category, size, priceMax]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [filterKey]);

  return (
    <Container className="flex flex-col gap-10 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="max-w-md text-sm font-light text-am-offwhite-muted">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y border-am-gold/15 py-5">
        {!lockCategory && (
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={category === "toutes"} onClick={() => setCategory("toutes")}>
              Tous
            </FilterChip>
            {siteConfig.navigation.categories.map((c) => (
              <FilterChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </FilterChip>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={size === "toutes"} onClick={() => setSize("toutes")}>
            Toutes tailles
          </FilterChip>
          {availableSizes.map((s) => (
            <FilterChip key={s} active={size === s} onClick={() => setSize(s)}>
              {s}
            </FilterChip>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
          Prix max
          <input
            type="number"
            min={0}
            max={highestPrice}
            placeholder={`${highestPrice}€`}
            value={priceMax}
            onChange={(e) =>
              setPriceMax(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-20 border-b border-am-offwhite/30 bg-transparent py-1 text-center text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm font-light text-am-offwhite-muted">
          Aucun produit ne correspond à ces filtres.
        </p>
      )}
    </Container>
  );
}

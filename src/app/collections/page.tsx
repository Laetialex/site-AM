import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";

const covers: Record<string, string> = {
  "old-money": "/images/products/tshirt-col-polo-creme-porte.svg",
  streetwear: "/images/products/tshirt-oversize-logo-am-porte.svg",
};

export default function CollectionsPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl">Collections</h1>
      <p className="max-w-md px-6 text-sm font-light text-am-offwhite-muted">
        Deux univers, une seule marque.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 sm:grid-cols-2">
        {siteConfig.navigation.universes.map((universe) => (
          <Link
            key={universe.id}
            href={`/collections/${universe.id}`}
            className="group relative flex aspect-[4/5] items-end justify-center overflow-hidden sm:aspect-auto"
          >
            <Image
              src={covers[universe.id]}
              alt={universe.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-am-black/50 transition-colors group-hover:bg-am-black/30" />
            <span className="relative pb-12 font-serif text-3xl text-am-offwhite">
              {universe.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

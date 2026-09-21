"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/config/site.config";
import { CloseIcon } from "@/components/icons";

export function Gallery({ product }: { product: Product }) {
  const images = [
    { src: product.images.face, alt: `${product.name} — face` },
    { src: product.images.porte, alt: `${product.name} — porté` },
    { src: product.images.detail, alt: `${product.name} — détail` },
  ];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoomed) return;
    zoomCloseRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomed]);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Zoomer sur la photo"
        className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-am-black-soft"
      >
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </button>

      <div className="flex gap-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={image.alt}
            aria-current={i === active}
            className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-am-black-soft transition-opacity ${
              i === active ? "opacity-100 ring-1 ring-am-gold" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[active].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-am-black/95"
          onClick={() => setZoomed(false)}
        >
          <button
            ref={zoomCloseRef}
            type="button"
            aria-label="Fermer le zoom"
            onClick={() => setZoomed(false)}
            className="absolute top-5 right-5 text-am-offwhite hover:text-am-gold"
          >
            <CloseIcon />
          </button>
          {/* touch-action: pinch-zoom laisse le navigateur gérer le pincement natif */}
          <div
            className="h-full w-full overflow-auto p-6"
            style={{ touchAction: "pinch-zoom" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].src}
              alt={images[active].alt}
              width={900}
              height={1125}
              className="mx-auto my-auto h-auto w-full max-w-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

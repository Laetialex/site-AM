"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { CloseIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const links = [
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/collections", label: "Collections" },
  { href: "/collections/old-money", label: "— Old Money", indent: true },
  { href: "/collections/streetwear", label: "— Streetwear", indent: true },
  { href: "/categorie/t-shirts", label: "T-Shirts" },
  { href: "/categorie/accessoires", label: "Accessoires" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col bg-am-black"
    >
      <div className="flex items-center justify-end px-6 py-5">
        <button
          ref={closeButtonRef}
          aria-label="Fermer le menu"
          onClick={onClose}
          className="text-am-offwhite transition-colors hover:text-am-gold"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`font-serif text-2xl transition-colors hover:text-am-gold ${
              link.indent ? "text-lg text-am-offwhite-muted" : "text-am-offwhite"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-center gap-6 pb-10">
        <a
          href={siteConfig.brand.social.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="AM sur Instagram"
          className="text-am-offwhite transition-colors hover:text-am-gold"
        >
          <InstagramIcon />
        </a>
        <a
          href={siteConfig.brand.social.tiktok}
          target="_blank"
          rel="noreferrer"
          aria-label="AM sur TikTok"
          className="text-am-offwhite transition-colors hover:text-am-gold"
        >
          <TikTokIcon />
        </a>
      </div>
    </div>
  );
}

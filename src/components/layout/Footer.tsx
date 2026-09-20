import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { PaymentLogos } from "@/components/PaymentLogos";
import { InstagramIcon, TikTokIcon } from "@/components/icons";

const legalLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/guide-des-tailles", label: "Guide des tailles" },
  { href: "/livraison-retours", label: "Livraison & retours" },
  { href: "/cgv", label: "CGV" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

export function Footer() {
  return (
    <footer className="border-t border-am-gold/15 bg-am-black">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="font-serif text-xl tracking-[0.2em] text-am-offwhite">
            AM
          </span>
          <p className="max-w-xs text-sm font-light text-am-offwhite-muted">
            {siteConfig.brand.tagline}
          </p>
          <div className="flex items-center gap-4 pt-2">
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

        <div className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.2em] text-am-gold uppercase">
            Informations
          </span>
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-light text-am-offwhite-muted transition-colors hover:text-am-offwhite"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-2">
          <span className="text-xs tracking-[0.2em] text-am-gold uppercase">
            Newsletter
          </span>
          <p className="text-sm font-light text-am-offwhite-muted">
            Sois prévenu·e en premier des prochains drops.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-am-gold/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs font-light text-am-offwhite-muted">
            © {new Date().getFullYear()} {siteConfig.brand.fullName}. Tous
            droits réservés.
          </p>
          <PaymentLogos />
        </Container>
      </div>
    </footer>
  );
}

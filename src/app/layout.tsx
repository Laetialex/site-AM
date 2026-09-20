import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — ${siteConfig.brand.fullName}`,
  description: siteConfig.brand.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-black text-[#F5F1E8]">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { displaySerif, bodySans } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — ${siteConfig.brand.fullName}`,
  description: siteConfig.brand.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-am-black text-am-offwhite">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

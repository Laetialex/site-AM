import type { Metadata } from "next";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site.config";
import { displaySerif, bodySans } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GateForm } from "@/components/gate/GateForm";
import { GATE_COOKIE } from "@/lib/gate";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — ${siteConfig.brand.fullName}`,
  description: siteConfig.brand.description,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const hasEntered =
    !siteConfig.gate.enabled || cookieStore.get(GATE_COOKIE)?.value === "1";

  return (
    <html
      lang="fr"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-am-black text-am-offwhite">
        {hasEntered ? (
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </>
        ) : (
          <GateForm />
        )}
      </body>
    </html>
  );
}

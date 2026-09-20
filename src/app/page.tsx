import { siteConfig } from "@/config/site.config";

// Page d'accueil provisoire — le hero cinématique, le header/footer et le
// design system complet arrivent à l'étape 2/3. Cette version confirme
// juste que l'arborescence et la config sont branchées.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-[#C9A96E] uppercase">
        {siteConfig.drop.name}
      </p>
      <h1 className="font-serif text-5xl">{siteConfig.brand.fullName}</h1>
      <p className="max-w-md text-sm text-[#F5F1E8]/70">
        {siteConfig.drop.heroTagline}
      </p>
    </div>
  );
}

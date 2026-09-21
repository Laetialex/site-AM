import { ProsePage } from "@/components/content/ProsePage";

// Texte de placeholder — à réécrire avec la vraie histoire de la marque.
export default function AProposPage() {
  return (
    <ProsePage title="À propos" subtitle="All Money — deux univers, une exigence.">
      <p>
        AM est née d&apos;une idée simple : le streetwear peut être précis.
        Coupes travaillées, matières lourdes, finitions soignées — la même
        exigence que les maisons classiques, appliquée à une garde-robe
        pensée pour la rue.
      </p>
      <h2>Old Money × Streetwear</h2>
      <p>
        Deux univers se répondent dans chaque collection : l&apos;élégance
        discrète du vestiaire classique, et l&apos;énergie brute du
        streetwear. Pas de compromis entre les deux — chaque pièce
        appartient pleinement à son univers.
      </p>
      <h2>Précommande, sans compromis</h2>
      <p>
        Pas de stock dormant, pas de surproduction. Chaque drop est produit
        en quantité limitée, sur précommande, pour garantir la qualité
        plutôt que le volume.
      </p>
    </ProsePage>
  );
}

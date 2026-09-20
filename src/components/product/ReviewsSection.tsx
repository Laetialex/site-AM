// État vide propre — les avis (note + commentaires) viendront de la table
// Supabase `reviews` à l'étape 6, une fois les commandes livrées.
export function ReviewsSection() {
  return (
    <section className="flex flex-col items-center gap-3 border-t border-am-gold/15 py-12 text-center">
      <h2 className="text-2xl sm:text-3xl">Avis clients</h2>
      <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
        Aucun avis pour le moment. Les avis des client·e·s s&apos;afficheront
        ici dès la réception des premières commandes.
      </p>
    </section>
  );
}

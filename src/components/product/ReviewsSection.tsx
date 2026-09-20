import Link from "next/link";
import type { Review } from "@/lib/reviews";
import { averageRating } from "@/lib/reviews";
import { ReviewForm } from "@/components/product/ReviewForm";

function Stars({ value }: { value: number }) {
  return (
    <span aria-hidden className="text-am-gold">
      {"★".repeat(Math.round(value))}
      <span className="text-am-offwhite/25">
        {"★".repeat(5 - Math.round(value))}
      </span>
    </span>
  );
}

export function ReviewsSection({
  productSlug,
  reviews,
  userId,
  hasReviewed,
}: {
  productSlug: string;
  reviews: Review[];
  userId: string | null;
  hasReviewed: boolean;
}) {
  const average = averageRating(reviews);

  return (
    <section className="flex flex-col items-center gap-8 border-t border-am-gold/15 py-12 text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl sm:text-3xl">Avis clients</h2>
        {average !== null && (
          <p className="flex items-center gap-2 text-sm text-am-offwhite-muted">
            <Stars value={average} />
            {average.toFixed(1)} / 5 ({reviews.length} avis)
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
          Aucun avis pour le moment. Les avis des client·e·s s&apos;afficheront
          ici dès la réception des premières commandes.
        </p>
      ) : (
        <ul className="flex w-full max-w-xl flex-col gap-6 text-left">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-am-gold/10 pb-4">
              <div className="flex items-center justify-between">
                <Stars value={review.rating} />
                <span className="text-xs text-am-offwhite-muted">
                  {review.profiles?.prenom ?? "Client AM"}
                </span>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm font-light text-am-offwhite-muted">
                  {review.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasReviewed ? (
        <p className="text-sm font-light text-am-gold">
          Merci, tu as déjà laissé ton avis sur ce produit.
        </p>
      ) : userId ? (
        <ReviewForm productSlug={productSlug} />
      ) : (
        <p className="text-sm font-light text-am-offwhite-muted">
          <Link
            href={`/compte?next=/produits/${productSlug}`}
            className="underline underline-offset-4 hover:text-am-gold"
          >
            Connecte-toi
          </Link>{" "}
          pour laisser un avis.
        </p>
      )}
    </section>
  );
}

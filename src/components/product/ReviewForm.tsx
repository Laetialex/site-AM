"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewActionState } from "@/app/actions/reviews";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const action = submitReview.bind(null, productSlug);
  const [state, formAction] = useActionState<ReviewActionState, FormData>(action, {});
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="rating" value={rating} />
      <div>
        <p className="mb-2 text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
          Ta note
        </p>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHovered(value)}
              onClick={() => setRating(value)}
              className={`text-2xl leading-none transition-colors ${
                value <= (hovered || rating) ? "text-am-gold" : "text-am-offwhite/25"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-left">
        <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
          Commentaire (facultatif)
        </span>
        <textarea
          name="comment"
          rows={3}
          className="w-full resize-none border border-am-offwhite/30 bg-transparent p-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-xs text-am-gold">
          {state.error}
        </p>
      )}

      <SubmitButton className="self-center">Publier mon avis</SubmitButton>
    </form>
  );
}

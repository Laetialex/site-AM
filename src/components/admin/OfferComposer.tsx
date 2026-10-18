"use client";

import { useActionState } from "react";
import { generateOfferEmail, type GenerateOfferState } from "@/app/actions/offers";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { OfferPreview } from "@/components/admin/OfferPreview";

export function OfferComposer() {
  const [genState, generateAction] = useActionState<GenerateOfferState, FormData>(
    generateOfferEmail,
    {},
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-16">
      <h1 className="font-serif text-3xl text-am-offwhite">Email promo</h1>

      <form action={generateAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
            Décris l&apos;offre
          </span>
          <textarea
            name="brief"
            rows={3}
            required
            placeholder="Ex : -15% ce week-end avec le code WEEKEND15, ou nouveau drop la semaine prochaine"
            className="w-full resize-none border border-am-offwhite/30 bg-transparent p-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
          />
        </label>
        {genState.error && (
          <p role="alert" className="text-xs text-am-gold">
            {genState.error}
          </p>
        )}
        <SubmitButton variant="secondary" className="self-start">
          Générer avec l&apos;IA
        </SubmitButton>
      </form>

      {genState.subject && genState.body && (
        // key force un nouveau montage (et donc un nouvel état local) à
        // chaque génération réussie, sans synchroniser via un effet.
        <OfferPreview
          key={`${genState.subject}-${genState.body}`}
          initialSubject={genState.subject}
          initialBody={genState.body}
        />
      )}
    </div>
  );
}

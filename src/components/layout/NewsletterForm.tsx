"use client";

import { useActionState } from "react";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function NewsletterForm() {
  const [state, formAction] = useActionState<NewsletterState, FormData>(
    subscribeNewsletter,
    {},
  );

  if (state.success) {
    return (
      <p className="text-sm font-light text-am-gold">
        Merci, tu es sur la liste.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-2">
      <div className="flex gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="Ton email"
          aria-label="Ton email"
          className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
        />
        <SubmitButton variant="secondary" className="px-5 py-2 whitespace-nowrap">
          S&apos;inscrire
        </SubmitButton>
      </div>
      {state.error && (
        <p role="alert" className="text-xs text-am-gold">
          {state.error}
        </p>
      )}
    </form>
  );
}

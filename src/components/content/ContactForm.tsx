"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(submitContact, {});

  if (state.success) {
    return (
      <p className="text-sm font-light text-am-gold">
        Merci, ton message a bien été envoyé. On te répond au plus vite.
      </p>
    );
  }

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <TextField label="Nom" name="name" type="text" required />
      <TextField label="Email" name="email" type="email" required />
      <label className="flex flex-col gap-1 text-left">
        <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
          Message
        </span>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full resize-none border border-am-offwhite/30 bg-transparent p-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-xs text-am-gold">
          {state.error}
        </p>
      )}
      <SubmitButton className="self-center">Envoyer</SubmitButton>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ActionState } from "@/app/compte/actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.success) {
    return <p className="text-sm font-light text-am-gold">{state.success}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm font-light text-am-offwhite-muted">
        Indique ton email, on t&apos;envoie un lien pour choisir un nouveau
        mot de passe.
      </p>
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-am-offwhite-muted underline underline-offset-4 hover:text-am-gold"
        >
          Retour
        </button>
        <SubmitButton>Envoyer le lien</SubmitButton>
      </div>
    </form>
  );
}

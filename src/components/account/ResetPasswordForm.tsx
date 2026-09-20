"use client";

import { useActionState } from "react";
import { updatePassword, type ActionState } from "@/app/compte/actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updatePassword,
    {},
  );

  return (
    <form action={formAction} className="mx-auto flex max-w-xs flex-col gap-4">
      <TextField
        label="Nouveau mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        error={Boolean(state.error)}
      />
      {state.error && (
        <p role="alert" className="text-xs text-am-gold">
          {state.error}
        </p>
      )}
      <SubmitButton className="w-full">Enregistrer</SubmitButton>
    </form>
  );
}

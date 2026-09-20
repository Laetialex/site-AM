"use client";

import { useActionState } from "react";
import { signUp, type ActionState } from "@/app/compte/actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignupForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(signUp, {});

  if (state.success) {
    return (
      <p className="text-sm font-light text-am-gold">{state.success}</p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <TextField label="Prénom" name="prenom" type="text" autoComplete="given-name" required />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Mot de passe"
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
      <SubmitButton className="w-full">Créer mon compte</SubmitButton>
    </form>
  );
}

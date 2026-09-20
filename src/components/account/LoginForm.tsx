"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/compte/actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm({
  next,
  onForgotPassword,
}: {
  next: string;
  onForgotPassword: () => void;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={Boolean(state.error)}
      />
      {state.error && (
        <p role="alert" className="text-xs text-am-gold">
          {state.error}
        </p>
      )}
      <button
        type="button"
        onClick={onForgotPassword}
        className="self-end text-xs text-am-offwhite-muted underline underline-offset-4 hover:text-am-gold"
      >
        Mot de passe oublié ?
      </button>
      <SubmitButton className="w-full">Se connecter</SubmitButton>
    </form>
  );
}

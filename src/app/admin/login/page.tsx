"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "@/app/actions/admin";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function AdminLoginPage() {
  const [state, formAction] = useActionState<AdminLoginState, FormData>(loginAdmin, {});

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-serif text-3xl text-am-offwhite">Administration</h1>
      <form action={formAction} className="flex w-full flex-col gap-4">
        <TextField label="Mot de passe" name="password" type="password" required autoFocus />
        {state.error && (
          <p role="alert" className="text-xs text-am-gold">
            {state.error}
          </p>
        )}
        <SubmitButton className="self-center">Entrer</SubmitButton>
      </form>
    </div>
  );
}

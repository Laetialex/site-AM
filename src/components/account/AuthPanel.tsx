"use client";

import { useState } from "react";
import { LoginForm } from "@/components/account/LoginForm";
import { SignupForm } from "@/components/account/SignupForm";
import { ForgotPasswordForm } from "@/components/account/ForgotPasswordForm";
import { GoogleButton } from "@/components/account/GoogleButton";

type Mode = "connexion" | "inscription" | "mot-de-passe-oublie";

export function AuthPanel({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("connexion");

  if (mode === "mot-de-passe-oublie") {
    return (
      <div className="mx-auto flex max-w-xs flex-col gap-6">
        <ForgotPasswordForm onBack={() => setMode("connexion")} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-6">
      <div className="flex justify-center gap-6 text-sm tracking-[0.1em] uppercase">
        <button
          type="button"
          onClick={() => setMode("connexion")}
          className={mode === "connexion" ? "text-am-gold" : "text-am-offwhite-muted hover:text-am-offwhite"}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setMode("inscription")}
          className={mode === "inscription" ? "text-am-gold" : "text-am-offwhite-muted hover:text-am-offwhite"}
        >
          Inscription
        </button>
      </div>

      {mode === "connexion" ? (
        <LoginForm next={next} onForgotPassword={() => setMode("mot-de-passe-oublie")} />
      ) : (
        <SignupForm next={next} />
      )}

      <div className="flex items-center gap-3 text-xs text-am-offwhite-muted">
        <span className="h-px flex-1 bg-am-offwhite/15" />
        ou
        <span className="h-px flex-1 bg-am-offwhite/15" />
      </div>

      <GoogleButton next={next} />
    </div>
  );
}

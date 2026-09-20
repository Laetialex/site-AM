"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Formulaire visuel uniquement pour l'instant — l'inscription réelle dans
// Supabase (table newsletter_subscribers) arrive à l'étape 6.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm font-light text-am-gold">
        Merci, tu es sur la liste.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ton email"
        className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
      />
      <Button type="submit" variant="secondary" className="px-5 py-2 whitespace-nowrap">
        S&apos;inscrire
      </Button>
    </form>
  );
}

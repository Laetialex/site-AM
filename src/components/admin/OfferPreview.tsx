"use client";

import { useState, useTransition } from "react";
import { sendOfferEmail } from "@/app/actions/offers";
import { Button } from "@/components/ui/Button";

export function OfferPreview({
  initialSubject,
  initialBody,
}: {
  initialSubject: string;
  initialBody: string;
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sendPending, startSend] = useTransition();
  const [sendResult, setSendResult] = useState<{
    success?: boolean;
    count?: number;
    error?: string;
  } | null>(null);

  function handleSend() {
    setSendResult(null);
    startSend(async () => {
      const result = await sendOfferEmail(subject, body);
      setSendResult(result);
    });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-am-offwhite/20 pt-10">
      <p className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
        Aperçu — modifiable
      </p>

      <label className="flex flex-col gap-1 text-left">
        <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">Objet</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-left">
        <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">Contenu</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full resize-none border border-am-offwhite/30 bg-transparent p-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
        />
      </label>

      {sendResult?.error && (
        <p role="alert" className="text-xs text-am-gold">
          {sendResult.error}
        </p>
      )}
      {sendResult?.success && (
        <p className="text-xs text-am-gold">
          Envoyé à {sendResult.count} destinataire{sendResult.count && sendResult.count > 1 ? "s" : ""}.
        </p>
      )}

      <Button type="button" onClick={handleSend} disabled={sendPending} className="self-start">
        {sendPending ? "Envoi..." : "Envoyer à tous les clients"}
      </Button>
    </div>
  );
}

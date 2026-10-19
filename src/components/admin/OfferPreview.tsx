"use client";

import { useState, useTransition } from "react";
import {
  getSubscriberCount,
  sendOfferEmail,
  sendTestOfferEmail,
} from "@/app/actions/offers";
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
  const [testEmail, setTestEmail] = useState("");

  const [testPending, startTest] = useTransition();
  const [testResult, setTestResult] = useState<{ success?: boolean; error?: string } | null>(
    null,
  );

  const [sendPending, startSend] = useTransition();
  const [sendResult, setSendResult] = useState<{
    success?: boolean;
    count?: number;
    error?: string;
  } | null>(null);

  function handleTest() {
    setTestResult(null);
    startTest(async () => {
      const result = await sendTestOfferEmail(subject, body, testEmail);
      setTestResult(result);
    });
  }

  function handleSend() {
    setSendResult(null);
    startSend(async () => {
      const count = await getSubscriberCount();
      const confirmed = window.confirm(
        `Envoyer cet email à ${count} destinataire${count > 1 ? "s" : ""} ? Cette action est irréversible.`,
      );
      if (!confirmed) return;

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

      <div className="flex flex-col gap-2 border-t border-am-offwhite/10 pt-4">
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
            Envoyer un test à (ton email)
          </span>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-sm font-light text-am-offwhite focus:border-am-gold focus:outline-none"
          />
        </label>
        {testResult?.error && (
          <p role="alert" className="text-xs text-am-gold">
            {testResult.error}
          </p>
        )}
        {testResult?.success && <p className="text-xs text-am-gold">Email de test envoyé.</p>}
        <Button
          type="button"
          variant="secondary"
          onClick={handleTest}
          disabled={testPending || !testEmail.trim()}
          className="self-start"
        >
          {testPending ? "Envoi..." : "Envoyer un test"}
        </Button>
      </div>

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

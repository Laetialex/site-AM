// Représentation générique (texte, pas les logos officiels) — à remplacer
// par les badges fournis par Stripe/PayPal une fois le paiement branché.
const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "PayPal"];

export function PaymentLogos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method}
          className="rounded-sm border border-am-offwhite/20 px-2 py-1 text-[10px] tracking-wide text-am-offwhite-muted"
        >
          {method}
        </span>
      ))}
    </div>
  );
}

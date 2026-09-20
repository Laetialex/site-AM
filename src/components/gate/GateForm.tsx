import { siteConfig } from "@/config/site.config";
import { submitGate } from "@/app/actions/gate";
import { GateSubmitButton } from "@/components/gate/GateSubmitButton";

export function GateForm() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-2xl tracking-[0.2em] text-am-offwhite">
        AM
      </p>
      <h1 className="mt-6 text-3xl sm:text-4xl">{siteConfig.gate.title}</h1>
      <p className="mt-3 max-w-sm text-sm font-light text-am-offwhite-muted">
        {siteConfig.gate.subtitle}
      </p>

      <form
        action={submitGate}
        className="mt-10 flex w-full max-w-xs flex-col gap-5"
      >
        <input
          name="prenom"
          type="text"
          required
          placeholder="Prénom"
          autoComplete="given-name"
          className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-center text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className="w-full border-b border-am-offwhite/30 bg-transparent py-2 text-center text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:border-am-gold focus:outline-none"
        />
        <GateSubmitButton />
      </form>
    </div>
  );
}

import type { InputHTMLAttributes } from "react";

export function TextField({
  label,
  error,
  className = "",
  ...props
}: { label: string; error?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase">
        {label}
      </span>
      <input
        {...props}
        aria-invalid={error}
        className={`w-full border-b bg-transparent py-2 text-sm font-light text-am-offwhite placeholder:text-am-offwhite-muted focus:outline-none ${
          error ? "border-am-gold" : "border-am-offwhite/30 focus:border-am-gold"
        } ${className}`}
      />
    </label>
  );
}

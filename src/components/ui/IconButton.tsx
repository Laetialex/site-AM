import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  label: string;
  children: ReactNode;
  badge?: number;
  className?: string;
};

const base =
  "relative inline-flex h-9 w-9 items-center justify-center text-am-offwhite transition-colors hover:text-am-gold";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-am-gold px-1 text-[10px] font-medium text-am-black"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function IconButton({
  label,
  children,
  badge = 0,
  className = "",
  href,
  ...rest
}: CommonProps &
  ({ href: string } | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>))) {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={`${base} ${className}`}>
        {children}
        <Badge count={badge} />
      </Link>
    );
  }

  return (
    <button
      aria-label={label}
      className={`${base} ${className}`}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
      <Badge count={badge} />
    </button>
  );
}

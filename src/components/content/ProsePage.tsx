import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function ProsePage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {subtitle && (
            <p className="max-w-md text-sm font-light text-am-offwhite-muted">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="flex flex-col gap-6 text-sm leading-relaxed font-light text-am-offwhite-muted
            [&_h2]:mt-2 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-normal [&_h2]:text-am-offwhite
            [&_strong]:font-normal [&_strong]:text-am-offwhite
            [&_a]:text-am-offwhite [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-am-gold
            [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
        >
          {children}
        </div>
      </div>
    </Container>
  );
}

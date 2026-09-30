import type { ReactNode } from "react";
import { Scramble } from "./motion";

/** Mono catalogue label with a leading rule. The text decodes into place as it scrolls into view. */
export const Stamp = ({ children }: { children: string }) => (
  <span className="inline-flex items-start gap-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-[hsl(var(--accent-gold))] sm:items-center sm:tracking-[0.35em]">
    <span className="mt-[0.7em] h-px w-8 shrink-0 bg-[hsl(var(--accent-gold))]/60 sm:mt-0" aria-hidden="true" />
    <Scramble text={children} className="whitespace-normal" />
  </span>
);

export const Rule = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--accent-gold))]/40 to-transparent" />
);

/** The gold word inside a headline. */
export const Gold = ({ children }: { children: ReactNode }) => (
  <span className="text-[hsl(var(--accent-gold))]">{children}</span>
);

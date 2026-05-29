import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DSRootProps {
  children: ReactNode;
  className?: string;
}

/**
 * DSRoot — root wrapper that scopes V3 tokens, fonts, and base styles.
 * Every V3 page should wrap its content in <DSRoot>.
 */
export const DSRoot = ({ children, className }: DSRootProps) => (
  <div
    className={cn("ds-root min-h-screen antialiased selection:bg-[hsl(var(--ds-oxblood))] selection:text-[hsl(var(--ds-bone))]", className)}
  >
    {children}
  </div>
);

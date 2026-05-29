import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StageProps {
  children: ReactNode;
  /** Vertical padding — default generous editorial spacing */
  py?: "none" | "sm" | "md" | "lg";
  /** Constrain to narrower max width for reading */
  narrow?: boolean;
  className?: string;
  id?: string;
}

/**
 * Stage — the standard content container.
 * Holds gutter, max-width, and vertical rhythm.
 * Use for any section that's NOT a full-bleed Scene.
 */
export const Stage = ({ children, py = "lg", narrow = false, className, id }: StageProps) => {
  const pyMap = {
    none: "",
    sm: "py-[6vh] md:py-[8vh]",
    md: "py-[10vh] md:py-[14vh]",
    lg: "py-[14vh] md:py-[20vh]",
  };

  return (
    <section
      id={id}
      className={cn("relative w-full", pyMap[py], className)}
      style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)" }}
    >
      <div className={cn("mx-auto", narrow ? "max-w-3xl" : "max-w-[var(--ds-max)]")}>
        {children}
      </div>
    </section>
  );
};

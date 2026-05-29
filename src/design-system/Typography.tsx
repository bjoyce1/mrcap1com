import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DisplaySize = "monument" | "xl" | "lg" | "md";

interface DisplayProps {
  children: ReactNode;
  as?: ElementType;
  size?: DisplaySize;
  italic?: boolean;
  className?: string;
}

/** Display — monumental Fraunces headlines. */
export const Display = ({ children, as: Tag = "h1", size = "xl", italic = false, className }: DisplayProps) => {
  const sizeStyle = {
    monument: { fontSize: "var(--ds-fs-monument)" },
    xl: { fontSize: "var(--ds-fs-display)" },
    lg: { fontSize: "var(--ds-fs-h2)" },
    md: { fontSize: "var(--ds-fs-h3)" },
  }[size];

  return (
    <Tag
      className={cn("ds-font-display text-[hsl(var(--ds-bone))] text-balance", italic && "italic", className)}
      style={sizeStyle}
    >
      {children}
    </Tag>
  );
};

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

/** Eyebrow — small tracked label above headlines. */
export const Eyebrow = ({ children, className, accent = false }: EyebrowProps) => (
  <p
    className={cn(
      "ds-font-eyebrow",
      accent ? "text-[hsl(var(--ds-oxblood-glow))]" : "text-[hsl(var(--ds-bone-faint))]",
      className,
    )}
  >
    {children}
  </p>
);

interface BodyProps {
  children: ReactNode;
  className?: string;
  dim?: boolean;
  as?: ElementType;
}

/** Body — primary reading text. */
export const Body = ({ children, className, dim = false, as: Tag = "p" }: BodyProps) => (
  <Tag
    className={cn(
      "ds-font-body leading-relaxed",
      dim ? "text-[hsl(var(--ds-bone-dim))]" : "text-[hsl(var(--ds-bone))]",
      className,
    )}
    style={{ fontSize: "var(--ds-fs-body)" }}
  >
    {children}
  </Tag>
);

/** Lead — larger intro paragraph (Fraunces, lighter weight). */
export const Lead = ({ children, className, as: Tag = "p" }: BodyProps) => (
  <Tag
    className={cn("ds-font-display font-light text-[hsl(var(--ds-bone))] text-balance leading-tight", className)}
    style={{ fontSize: "var(--ds-fs-lead)", letterSpacing: "-0.01em" }}
  >
    {children}
  </Tag>
);

/** Caption — meta, dates, credits. */
export const Caption = ({ children, className, as: Tag = "p" }: BodyProps) => (
  <Tag
    className={cn("ds-font-body text-[hsl(var(--ds-bone-faint))] tracking-wide", className)}
    style={{ fontSize: "0.8125rem" }}
  >
    {children}
  </Tag>
);

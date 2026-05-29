import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CTAVariant = "primary" | "ghost" | "link";

interface BaseProps {
  children: ReactNode;
  variant?: CTAVariant;
  /** Render as link instead of button */
  to?: string;
  /** External href — opens in new tab */
  href?: string;
  className?: string;
  /** Show trailing arrow icon */
  arrow?: boolean;
}

type CTAProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref">;

const base =
  "inline-flex items-center gap-3 transition-all duration-[var(--ds-dur-fast)] ds-font-eyebrow tracking-[0.22em] uppercase";

const variantStyles: Record<CTAVariant, string> = {
  primary:
    "bg-[hsl(var(--ds-oxblood))] text-[hsl(var(--ds-bone))] px-7 py-4 hover:bg-[hsl(var(--ds-oxblood-glow))] hover:translate-y-[-1px] shadow-[0_8px_32px_hsl(var(--ds-oxblood)/0.35)]",
  ghost:
    "text-[hsl(var(--ds-bone))] px-7 py-4 hover:bg-[hsl(var(--ds-bone)/0.06)]",
  link:
    "text-[hsl(var(--ds-bone))] hover:text-[hsl(var(--ds-oxblood-glow))] gap-2",
};

export const CTA = forwardRef<HTMLAnchorElement | HTMLButtonElement, CTAProps>(
  ({ children, variant = "primary", to, href, className, arrow = true, ...rest }, ref) => {
    const content = (
      <>
        <span>{children}</span>
        {arrow && (
          <ArrowUpRight
            className="transition-transform duration-[var(--ds-dur-fast)] group-hover:translate-x-1 group-hover:-translate-y-1"
            size={variant === "link" ? 14 : 16}
            strokeWidth={1.5}
          />
        )}
      </>
    );
    const classes = cn("group", base, variantStyles[variant], className);

    if (to) {
      return (
        <Link to={to} ref={ref as React.Ref<HTMLAnchorElement>} className={classes}>
          {content}
        </Link>
      );
    }
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);
CTA.displayName = "CTA";

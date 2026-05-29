import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeRowProps {
  items: ReactNode[];
  /** Seconds per full loop */
  duration?: number;
  /** Reverse direction */
  reverse?: boolean;
  /** Separator between items */
  separator?: ReactNode;
  className?: string;
}

/**
 * MarqueeRow — universal section divider.
 * Use between Scenes/Stages instead of decorative borders.
 */
export const MarqueeRow = ({
  items,
  duration = 60,
  reverse = false,
  separator = <span className="mx-[3vw] text-[hsl(var(--ds-bone-faint))]">·</span>,
  className,
}: MarqueeRowProps) => {
  // Duplicate items so translateX(-50%) loops seamlessly
  const looped = [...items, ...items];

  return (
    <div
      className={cn(
        "ds-font-display italic text-[hsl(var(--ds-bone))] w-full overflow-hidden py-8 md:py-12 border-y border-[hsl(var(--ds-bone)/0.05)]",
        className,
      )}
      style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
    >
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{
          animation: `ds-marquee ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {looped.map((item, i) => (
          <span key={i} className="flex items-center">
            {item}
            {separator}
          </span>
        ))}
      </div>
    </div>
  );
};

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, SplitText } from "@/components/whois/motion";
import { useMotionOk } from "@/components/whois/motionUtils";
import { cn } from "@/lib/utils";

/** Section heading for /music. The heading carries the section; the line under it says what's in it. */
export function ShelfHeader({
  id,
  title,
  icon,
  description,
  aside,
  size = "md",
  className,
}: {
  /** id for the section's aria-labelledby */
  id?: string;
  title: string;
  icon?: ReactNode;
  description?: ReactNode;
  /** controls that sit opposite the heading (year index, counters) */
  aside?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-10 gap-y-6", className)}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          {icon}
          <h2
            id={id}
            className={cn(
              "font-display leading-none text-foreground",
              size === "lg" ? "text-[clamp(2.75rem,6vw,5.5rem)]" : "text-[clamp(2.25rem,4.4vw,3.75rem)]",
            )}
          >
            <SplitText as="span">{title}</SplitText>
          </h2>
        </div>
        <div className="archive-rule mt-5 w-20" />
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">{description}</p>
          </Reveal>
        )}
      </div>
      {aside}
    </header>
  );
}

/**
 * A sideways row of cards that also works with a plain mouse: arrow buttons page it
 * (on hover-capable screens), and it stays a native swipe row on touch.
 * The top padding is the room a record needs when it rises out of its sleeve.
 */
export function Rail({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const ok = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: ok ? "smooth" : "auto" });
  };

  const arrow =
    "pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--accent-gold)/0.4)] bg-background/80 text-foreground backdrop-blur transition-[opacity,border-color] hover:border-[hsl(var(--accent-gold))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-25";

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-6 pt-24 md:-mx-10 md:gap-8 md:scroll-px-10 md:px-10"
      >
        {children}
      </div>
      {/* arrows only when there is something off screen to reach */}
      <div className={cn("pointer-events-none absolute right-0 top-4 hidden gap-2", !(edge.start && edge.end) && "[@media(hover:hover)]:flex")}>
        <button type="button" className={arrow} onClick={() => page(-1)} disabled={edge.start} aria-label={`Scroll ${label} back`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" className={arrow} onClick={() => page(1)} disabled={edge.end} aria-label={`Scroll ${label} forward`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

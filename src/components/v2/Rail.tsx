import { ReactNode, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RailProps {
  children: ReactNode;
  className?: string;
  /** Show arrow controls on desktop. */
  arrows?: boolean;
}

/** Horizontal scroll-snap rail with edge fade and optional drag-to-scroll. */
export default function Rail({ children, className, arrows = true }: RailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setCanL(el.scrollLeft > 4);
      setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 900), behavior: "smooth" });
  };

  return (
    <div className={cn("relative group", className)}>
      <div
        ref={ref}
        className="v2-rail-fade scrollbar-hide flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20"
        style={{ scrollBehavior: "smooth" }}
      >
        {children}
      </div>
      {arrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className={cn(
              "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-v2-bg/70 backdrop-blur text-v2-ink transition-all duration-500",
              canL ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className={cn(
              "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-v2-bg/70 backdrop-blur text-v2-ink transition-all duration-500",
              canR ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}

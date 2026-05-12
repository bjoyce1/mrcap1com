import { useRef, MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CoverCardProps {
  image: string;
  title: string;
  meta?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Width preset for use inside a Rail. */
  size?: "sm" | "md" | "lg";
  badge?: string;
}

const sizeMap = {
  sm: "w-[220px] md:w-[260px]",
  md: "w-[280px] md:w-[340px]",
  lg: "w-[340px] md:w-[420px]",
};

/** MJ-style cover: grayscale -> color, 3D tilt, hover meta slide-up. */
export default function CoverCard({
  image,
  title,
  meta,
  href,
  onClick,
  className,
  size = "md",
  badge,
}: CoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  };

  const Wrapper: any = href ? "a" : onClick ? "button" : "div";
  const wrapperProps: Record<string, unknown> = href ? { href } : onClick ? { onClick, type: "button" } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "v2-cover-group group relative shrink-0 snap-start text-left block focus:outline-none",
        sizeMap[size],
        className,
      )}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative aspect-square overflow-hidden bg-v2-surface1 transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: "perspective(900px)" }}
      >
        <img src={image} alt={title} className="v2-cover h-full w-full object-cover" loading="lazy" />
        {/* Glow on hover */}
        <div
          className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ boxShadow: "0 0 80px hsl(var(--v2-accent) / 0.45)" }}
        />
        {/* Hover meta strip */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/90 to-transparent p-4">
          <p className="v2-caption text-v2-ink/80">View release</p>
        </div>
        {badge && (
          <span className="absolute top-3 left-3 v2-caption px-2 py-1 bg-v2-accent text-v2-accent-ink uppercase">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="v2-display text-v2-ink text-xl md:text-2xl leading-tight">{title}</p>
        {meta && <p className="v2-caption mt-1">{meta}</p>}
      </div>
    </Wrapper>
  );
}

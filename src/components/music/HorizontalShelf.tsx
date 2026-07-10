import { type ReactNode } from "react";

interface HorizontalShelfProps {
  eyebrow: string;
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  /** Header controls / filters rendered between description and rail */
  toolbar?: ReactNode;
  /** Kept for API compatibility with callers */
  refreshKey?: string | number;
  children: ReactNode;
}

/**
 * Shared "Catalog-style" rail used across every Music page section.
 * A native snap-scroll rail on every viewport.
 *
 * NOTE: this intentionally does NOT use GSAP ScrollTrigger pinning.
 * Pinning re-parents the section into a pin-spacer div outside React's
 * knowledge; when sibling shelves mount later (streaming data arrives
 * async) React's insertBefore hits a stale sibling and crashes with
 * NotFoundError. Native scroll is also friendlier UX with many shelves.
 */
export default function HorizontalShelf({
  eyebrow,
  title,
  icon,
  description,
  toolbar,
  children,
}: HorizontalShelfProps) {
  return (
    <section className="catalog-section relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 pt-6 pb-2">
        <span className="catalog-stamp mb-3 block">{eyebrow}</span>
        <h2 className="font-display text-xl text-foreground flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="archive-rule mt-4 mb-4 w-24" />
        {description && (
          <p className="text-sm text-muted-foreground font-mono mb-4">{description}</p>
        )}
        {toolbar}
      </div>

      <div className="flex gap-5 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-10 py-6 md:py-8">
        {children}
      </div>
    </section>
  );
}

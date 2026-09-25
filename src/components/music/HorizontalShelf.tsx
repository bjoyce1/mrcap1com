import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

type ShelfVariant = "rail" | "feature";
type ShelfLayout = "rail" | "block";

interface HorizontalShelfProps {
  eyebrow: string;
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  /** Header controls / filters rendered between description and rail */
  toolbar?: ReactNode;
  /** Bumps ScrollTrigger recalculation when async data changes the height */
  refreshKey?: string | number;
  /** "feature" = larger type + more room. Used for the Albums shelf. */
  variant?: ShelfVariant;
  /** "block" renders children in the content column instead of a scroll rail. */
  layout?: ShelfLayout;
  children: ReactNode;
}

/**
 * Shared section shell for every /music section.
 *
 * Header and rail share ONE container and ONE horizontal padding value, so a
 * card's left edge lines up with the eyebrow above it. The rail cancels that
 * padding with a negative margin and re-applies it as scroll-padding, which
 * lets cards scroll past the right edge without breaking the left alignment.
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
  refreshKey,
  variant = "rail",
  layout = "rail",
  children,
}: HorizontalShelfProps) {
  const rootRef = useRef<HTMLElement>(null);
  const feature = variant === "feature";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-shelf-head] > *",
        { y: 26, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 84%" },
        }
      );

      gsap.fromTo(
        "[data-shelf-items] > *, [data-chart-row]",
        { y: 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-shelf-items]", start: "top 88%" },
        }
      );

      // Parallax: the oversized year numerals drift against their card.
      gsap.utils.toArray<HTMLElement>("[data-parallax-year]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });

      // Parallax: the section's colour wash drifts slower than the content.
      gsap.to("[data-shelf-wash]", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Shelves mount as async data lands, so trigger positions go stale.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
  }, [refreshKey]);

  return (
    <section
      ref={rootRef}
      className={
        "catalog-section relative overflow-x-clip " +
        (feature ? "py-20 md:py-28" : "py-14 md:py-20")
      }
    >
      <div
        data-shelf-wash
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/4 h-[150%]"
        style={{
          background:
            "radial-gradient(55% 40% at 15% 25%, hsl(var(--candy-violet) / 0.10), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div data-shelf-head className="max-w-2xl">
          <span className="catalog-stamp block">{eyebrow}</span>
          <h2
            className={
              "font-display text-foreground flex items-center gap-2.5 mt-3 " +
              (feature ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl")
            }
          >
            {icon}
            {title}
          </h2>
          <div className="archive-rule mt-5 w-20" />
          {description && (
            <p className="mt-5 text-sm text-muted-foreground font-mono">{description}</p>
          )}
        </div>

        {toolbar && <div className="mt-7">{toolbar}</div>}

        {layout === "block" ? (
          <div data-shelf-items className="mt-9">
            {children}
          </div>
        ) : (
          <div
            data-shelf-items
            className={
              "mt-9 flex overflow-x-auto no-scrollbar snap-x snap-mandatory " +
              "px-5 md:px-10 -mx-5 md:-mx-10 scroll-px-5 md:scroll-px-10 " +
              // top padding gives the oversized year numerals room; the rail
              // clips vertically because overflow-x forces overflow-y: auto.
              "pt-16 md:pt-20 pb-6 " +
              (feature ? "gap-8 md:gap-12" : "gap-6 md:gap-8")
            }
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
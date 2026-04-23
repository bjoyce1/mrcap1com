import { ReactNode, CSSProperties } from "react";

interface SectionBackgroundProps {
  /** The section content (typically a SectionShell). */
  children: ReactNode;
  /** Background image URL (string) — rendered as a full-bleed `<img>`. */
  image?: string;
  /** Optional alt text for the background image (defaults to "" / decorative). */
  imageAlt?: string;
  /** Image opacity (0–1). Default 0.5. */
  opacity?: number;
  /** `object-position` for the bg image (e.g. "center", "top", "50% 30%"). */
  imagePosition?: string;
  /**
   * Optional overlay node placed above the image but below the content.
   * Use for custom gradients, glows, particles, video, etc.
   */
  overlay?: ReactNode;
  /**
   * Gradient overlay variant to keep copy readable.
   * - "left"   : darker on the left (good for left-aligned copy)
   * - "right"  : darker on the right
   * - "center" : darker in the middle
   * - "vignette" : darker on top + bottom edges
   * - "none"   : no gradient overlay (use `overlay` instead)
   * Default: "vignette".
   */
  gradient?: "left" | "right" | "center" | "vignette" | "none";
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Inline styles for the outer wrapper. */
  style?: CSSProperties;
  /** Optional id on the outer wrapper. */
  id?: string;
}

const GRADIENT_CLASSES: Record<NonNullable<SectionBackgroundProps["gradient"]>, string> = {
  left: "bg-gradient-to-r from-background via-background/70 to-background/20",
  right: "bg-gradient-to-l from-background via-background/70 to-background/20",
  center: "bg-radial-gradient from-background/0 to-background",
  vignette: "bg-gradient-to-b from-background/80 via-transparent to-background",
  none: "",
};

/**
 * Full-bleed background wrapper.
 *
 * Wraps a section so the background image (and any overlays) span the
 * entire section edge-to-edge — independent of the inner padded container
 * used by `SectionShell`. This avoids the common bug where backgrounds
 * end up clipped inside `max-w-6xl` content wrappers.
 *
 * Usage:
 *   <SectionBackground image="/hero.jpg" opacity={0.5} gradient="left">
 *     <SectionShell index="04" eyebrow="...">
 *       ...content...
 *     </SectionShell>
 *   </SectionBackground>
 */
const SectionBackground = ({
  children,
  image,
  imageAlt = "",
  opacity = 0.5,
  imagePosition = "center",
  overlay,
  gradient = "vignette",
  className = "",
  style,
  id,
}: SectionBackgroundProps) => {
  return (
    <div
      id={id}
      style={style}
      className={`relative overflow-hidden isolate ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
          style={{ opacity, objectPosition: imagePosition }}
        />
      )}

      {gradient !== "none" && (
        <div className={`absolute inset-0 -z-10 pointer-events-none ${GRADIENT_CLASSES[gradient]}`} />
      )}

      {overlay && (
        <div className="absolute inset-0 -z-10 pointer-events-none">{overlay}</div>
      )}

      {children}
    </div>
  );
};

export default SectionBackground;

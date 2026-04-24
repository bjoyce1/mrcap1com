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
   * Background video URL(s). Renders a muted, looping, autoplaying video
   * layered above the `image` (which acts as the poster/fallback).
   * Pass a single src or an array of `{ src, type }` for multi-format support.
   */
  video?: string | Array<{ src: string; type?: string }>;
  /** Poster image for the video (defaults to `image` if provided). */
  videoPoster?: string;
  /** Video opacity (0–1). Defaults to `opacity`. */
  videoOpacity?: number;
  /** `object-position` for the video (defaults to `imagePosition`). */
  videoPosition?: string;
  /**
   * If true, the video will not autoplay/loop — useful for `prefers-reduced-motion`
   * scenarios. Defaults to `false` (motion enabled). The component also
   * automatically disables playback when the user prefers reduced motion.
   */
  disableVideo?: boolean;
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
 * Usage (image):
 *   <SectionBackground image="/hero.jpg" opacity={0.5} gradient="left">
 *     <SectionShell index="04" eyebrow="...">...</SectionShell>
 *   </SectionBackground>
 *
 * Usage (video w/ poster fallback):
 *   <SectionBackground
 *     image="/poster.jpg"
 *     video={[{ src: "/bg.webm", type: "video/webm" }, { src: "/bg.mp4", type: "video/mp4" }]}
 *     opacity={0.55}
 *     gradient="vignette"
 *   >
 *     <SectionShell index="05" eyebrow="...">...</SectionShell>
 *   </SectionBackground>
 *
 * Notes:
 * - Video is muted/looped/autoplays inline. It is automatically disabled when
 *   the user prefers reduced motion (the `image` poster remains visible).
 * - When both `image` and `video` are provided, the image acts as the poster
 *   and instant-paint fallback while the video loads.
 */
const SectionBackground = ({
  children,
  image,
  imageAlt = "",
  opacity = 0.5,
  imagePosition = "center",
  video,
  videoPoster,
  videoOpacity,
  videoPosition,
  disableVideo = false,
  overlay,
  gradient = "vignette",
  className = "",
  style,
  id,
}: SectionBackgroundProps) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const showVideo = !!video && !disableVideo && !prefersReducedMotion;
  const videoSources = video
    ? typeof video === "string"
      ? [{ src: video, type: undefined }]
      : video
    : [];
  const poster = videoPoster ?? image;

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

      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
          style={{
            opacity: videoOpacity ?? opacity,
            objectPosition: videoPosition ?? imagePosition,
          }}
        >
          {videoSources.map((s, i) => (
            <source key={i} src={s.src} type={s.type} />
          ))}
        </video>
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

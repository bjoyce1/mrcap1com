import { ReactNode, CSSProperties, useEffect, useRef, useState } from "react";
import { useMotionPreference } from "@/stores/motionPreferenceStore";

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
   * Loading strategy for the background video.
   * - "in-view" (default): the <video> only mounts and starts playing once the
   *   section scrolls into view (IntersectionObserver). Pauses + unloads when out.
   * - "eager": mounts immediately on render (legacy behavior).
   * - "manual": only mounts when `playVideo` is `true` (parent-controlled).
   */
  videoLoading?: "in-view" | "eager" | "manual";
  /**
   * Root margin for the in-view observer (e.g. "200px" to start a bit before
   * the section enters the viewport). Default "200px".
   */
  videoRootMargin?: string;
  /**
   * Threshold (0–1) for the in-view observer. Default 0.1.
   */
  videoThreshold?: number;
  /**
   * If `videoLoading === "manual"`, set to `true` to mount/play the video.
   * Ignored for other loading strategies.
   */
  playVideo?: boolean;
  /**
   * `<video preload>` hint. Defaults to "none" for `in-view`/`manual` (avoid
   * any network until needed) and "metadata" for `eager`.
   */
  videoPreload?: "none" | "metadata" | "auto";
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
  /**
   * Where the gradient sits in the layer stack.
   * - "above-media" (default): gradient renders above image/video — protects text contrast.
   * - "below-media": gradient renders behind media (legacy behavior).
   */
  gradientLayer?: "above-media" | "below-media";
  /**
   * Strength multiplier for the gradient overlay (0–1+). Default 1.
   * Useful when a bright video needs extra darkening for readability.
   */
  gradientOpacity?: number;
  /**
   * Extra solid scrim layered above media (below content) to guarantee contrast.
   * A number 0–1 sets a black scrim opacity; a string is used as a custom CSS background.
   */
  scrim?: number | string;
  /**
   * Where the custom `overlay` node sits in the layer stack.
   * - "above-media" (default): overlay renders above image/video.
   * - "below-media": overlay renders behind media (legacy behavior).
   */
  overlayLayer?: "above-media" | "below-media";
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
  videoLoading = "in-view",
  videoRootMargin = "200px",
  videoThreshold = 0.1,
  playVideo = false,
  videoPreload,
  overlay,
  gradient = "vignette",
  gradientLayer = "above-media",
  gradientOpacity = 1,
  scrim,
  overlayLayer = "above-media",
  className = "",
  style,
  id,
}: SectionBackgroundProps) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const videoAllowed = !!video && !disableVideo && !prefersReducedMotion;
  const videoSources = video
    ? typeof video === "string"
      ? [{ src: video, type: undefined }]
      : video
    : [];
  const poster = videoPoster ?? image;

  // Decide whether to actually mount the <video> element.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(videoLoading === "eager");

  useEffect(() => {
    if (!videoAllowed) return;
    if (videoLoading !== "in-view") return;
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin: videoRootMargin, threshold: videoThreshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoAllowed, videoLoading, videoRootMargin, videoThreshold]);

  const shouldMountVideo =
    videoAllowed &&
    (videoLoading === "eager" ||
      (videoLoading === "in-view" && inView) ||
      (videoLoading === "manual" && playVideo));

  const resolvedPreload =
    videoPreload ?? (videoLoading === "eager" ? "metadata" : "none");

  return (
    <div
      ref={wrapperRef}
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

      {shouldMountVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload={resolvedPreload}
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
        <div
          className={`absolute inset-0 pointer-events-none ${GRADIENT_CLASSES[gradient]} ${
            gradientLayer === "below-media" ? "-z-10" : "z-0"
          }`}
          style={gradientOpacity !== 1 ? { opacity: gradientOpacity } : undefined}
        />
      )}

      {scrim !== undefined && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={
            typeof scrim === "number"
              ? { backgroundColor: `hsl(var(--background) / ${scrim})` }
              : { background: scrim }
          }
        />
      )}

      {overlay && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            overlayLayer === "below-media" ? "-z-10" : "z-0"
          }`}
        >
          {overlay}
        </div>
      )}

      {/* Content sits above all background layers */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SectionBackground;

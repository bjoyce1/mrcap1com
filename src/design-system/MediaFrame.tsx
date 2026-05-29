import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface MediaFrameProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Aspect ratio, e.g. "3/4", "16/9", "1/1" */
  ratio?: string;
  /** Optional caption shown below */
  caption?: string;
  /** Fill object-fit (default cover) */
  fit?: "cover" | "contain";
}

/**
 * MediaFrame — every image/video on V3 pages goes through here.
 * Consistent loading, ratio, and reveal behavior.
 */
export const MediaFrame = ({
  ratio = "3/4",
  caption,
  fit = "cover",
  className,
  alt = "",
  ...imgProps
}: MediaFrameProps) => (
  <figure className={cn("relative w-full", className)}>
    <div
      className="relative w-full overflow-hidden bg-[hsl(var(--ds-elevated))]"
      style={{ aspectRatio: ratio }}
    >
      <img
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-[var(--ds-dur-slow)]",
          fit === "cover" ? "object-cover" : "object-contain",
        )}
        {...imgProps}
      />
    </div>
    {caption && (
      <figcaption className="mt-3 ds-font-body text-[0.8125rem] text-[hsl(var(--ds-bone-faint))] tracking-wide">
        {caption}
      </figcaption>
    )}
  </figure>
);

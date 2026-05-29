import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SceneProps {
  children: ReactNode;
  /** Background image URL (full-bleed) */
  bgImage?: string;
  /** Background video URL — autoplays muted looped */
  bgVideo?: string;
  /** Scrim intensity 0–1 over the media */
  scrim?: number;
  /** Min height (default 100vh) */
  minH?: string;
  /** Content alignment */
  align?: "start" | "center" | "end";
  /** Justify content vertically */
  justify?: "start" | "center" | "end";
  className?: string;
  /** Add subtle grain overlay */
  grain?: boolean;
  id?: string;
}

/**
 * Scene — full-viewport-height cinematic section.
 * Use for hero, key story beats, and closer CTAs.
 * Variation comes from media + typography, not from layout reinvention.
 */
export const Scene = ({
  children,
  bgImage,
  bgVideo,
  scrim = 0.55,
  minH = "100vh",
  align = "start",
  justify = "end",
  className,
  grain = true,
  id,
}: SceneProps) => {
  const alignMap = { start: "items-start", center: "items-center", end: "items-end" };
  const justifyMap = { start: "justify-start", center: "justify-center", end: "justify-end" };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden flex flex-col",
        alignMap[align],
        justifyMap[justify],
        className,
      )}
      style={{ minHeight: minH } as CSSProperties}
    >
      {bgVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={bgVideo}
          poster={bgImage}
        />
      )}
      {bgImage && !bgVideo && (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      )}
      {(bgImage || bgVideo) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, hsl(var(--ds-scrim) / ${scrim * 0.6}) 0%, hsl(var(--ds-scrim) / ${scrim}) 70%, hsl(var(--ds-bg)) 100%)`,
          }}
        />
      )}
      {grain && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
      <div className="relative w-full z-10 pb-[8vh] pt-[12vh]">{children}</div>
    </section>
  );
};

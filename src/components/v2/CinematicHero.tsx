import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicHeroProps {
  /** Background image URL (preferred) or pass children for video. */
  image?: string;
  videoSrc?: string;
  poster?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  height?: "screen" | "tall" | "medium";
  /** Overlay strength 0-1 */
  overlay?: number;
  className?: string;
}

const heightMap = {
  screen: "h-[100svh] min-h-[640px]",
  tall: "h-[88svh] min-h-[600px]",
  medium: "h-[70svh] min-h-[520px]",
};

export default function CinematicHero({
  image,
  videoSrc,
  poster,
  eyebrow,
  title,
  subtitle,
  actions,
  align = "left",
  height = "screen",
  overlay = 0.55,
  className,
}: CinematicHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden v2-surface",
        heightMap[height],
        className,
      )}
    >
      {/* Media layer (parallax) */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale }}>
        {videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            className="h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <div className="h-full w-full bg-v2-surface1" />
        )}
      </motion.div>

      {/* Overlay gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, hsl(var(--v2-bg) / ${overlay * 0.6}) 0%, hsl(var(--v2-bg) / ${overlay * 0.3}) 40%, hsl(var(--v2-bg) / ${Math.min(1, overlay + 0.2)}) 100%)`,
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20 md:pb-28",
          align === "center" && "items-center text-center",
        )}
      >
        <div className={cn("max-w-5xl", align === "center" && "mx-auto")}>
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="v2-eyebrow mb-6"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="v2-display text-v2-ink text-[clamp(2.75rem,8vw,7rem)] max-w-[14ch]"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="v2-body mt-6 max-w-xl text-base md:text-lg"
            >
              {subtitle}
            </motion.p>
          )}
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn("mt-10 flex flex-wrap gap-4", align === "center" && "justify-center")}
            >
              {actions}
            </motion.div>
          )}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-v2-ink-muted">
          <span className="v2-caption">Scroll</span>
          <motion.div
            className="h-8 w-px bg-v2-ink/40"
            animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3] }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}

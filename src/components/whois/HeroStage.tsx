import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Calendar, ChevronRight, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/cap-hero-portrait.webp";
import coin from "@/assets/mr-cap-coin.webp";
import { GhostWord, Reveal } from "./motion";
import { EASE_OUT, MASK_STYLE, useMotionOk, usePointerParallax } from "./motionUtils";
import { Rule, Stamp } from "./parts";

/* Layer stack, back to front:
 *   plate → ghost type → record rings → subject (cut-out) → mist → headline & copy → coin, dust, tag
 * Each layer moves at its own rate on scroll and, with a mouse, at its own depth under the pointer. */

// fixed positions so the dust never jumps between renders
const DUST = {
  far: [[8, 22, 3], [22, 64, 2], [41, 12, 2], [63, 40, 3], [79, 18, 2], [92, 58, 2], [55, 78, 2]],
  mid: [[14, 46, 4], [33, 30, 3], [52, 58, 4], [71, 26, 3], [88, 72, 4], [27, 82, 3]],
  near: [[5, 70, 6], [47, 44, 5], [68, 84, 6], [84, 34, 5], [96, 12, 6]],
} as const;

/** Scroll-driven y plus a pointer-driven x/y offset, for one layer. */
function useLayer(scrollY: MotionValue<number>, depth: number, px: MotionValue<number>, py: MotionValue<number>) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform([scrollY, py], ([s, p]: number[]) => s + p * depth * 0.6);
  return { x, y };
}

const Letter = ({ ch, index, delay, progress, className }: { ch: string; index: number; delay: number; progress: MotionValue<number>; className?: string }) => {
  const ok = useMotionOk();
  // as the hero scrolls away the letters rise at slightly different rates
  const y = useTransform(progress, [0, 1], ok ? [0, -14 - index * 11] : [0, 0]);
  return (
    <motion.span style={{ y }} className="inline-block">
      <span className="inline-block overflow-hidden align-bottom" style={MASK_STYLE}>
        <motion.span
          className={`inline-block ${className ?? ""}`}
          initial={ok ? { y: "122%" } : false}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay, ease: EASE_OUT }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      </span>
    </motion.span>
  );
};

const HeroStage = ({ onOpenPressKit }: { onOpenPressKit: () => void }) => {
  const ok = useMotionOk();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const { x: px, y: py } = usePointerParallax(sectionRef);

  const zero = (a: number, b: number) => (ok ? [a, b] : [0, 0]);
  const plateS = useTransform(scrollYProgress, [0, 1], zero(0, 170));
  const ringS = useTransform(scrollYProgress, [0, 1], zero(0, 90));
  const ringRotate = useTransform(scrollYProgress, [0, 1], zero(0, 80));
  const subjectS = useTransform(scrollYProgress, [0, 1], zero(0, 120));
  const subjectScale = useTransform(scrollYProgress, [0, 1], ok ? [1, 1.08] : [1, 1]);
  const coinS = useTransform(scrollYProgress, [0, 1], zero(0, -190));
  const coinRotate = useTransform(scrollYProgress, [0, 1], zero(0, 300));
  const tagS = useTransform(scrollYProgress, [0, 1], zero(0, -70));
  const dustFarS = useTransform(scrollYProgress, [0, 1], zero(0, -60));
  const dustMidS = useTransform(scrollYProgress, [0, 1], zero(0, -150));
  const dustNearS = useTransform(scrollYProgress, [0, 1], zero(0, -300));
  const copyS = useTransform(scrollYProgress, [0, 1], zero(0, -70));
  const copyOpacity = useTransform(scrollYProgress, [0.3, 0.85], ok ? [1, 0] : [1, 1]);

  const plate = useLayer(plateS, 5, px, py);
  const ring = useLayer(ringS, 14, px, py);
  const subject = useLayer(subjectS, 20, px, py);
  const coinL = useLayer(coinS, 38, px, py);
  const tag = useLayer(tagS, 30, px, py);
  const dustFar = useLayer(dustFarS, 10, px, py);
  const dustMid = useLayer(dustMidS, 22, px, py);
  const dustNear = useLayer(dustNearS, 40, px, py);

  const fade = (delay: number) => ({
    initial: ok ? { opacity: 0 } : false,
    animate: { opacity: 1 },
    transition: { duration: 1.2, delay, ease: EASE_OUT },
  });

  return (
    <section id="ch-hero" ref={sectionRef} className="relative isolate min-h-[100svh] overflow-hidden scroll-mt-24">
      {/* ── L0 · plate ─────────────────────────────────────────────── */}
      <motion.div style={{ x: plate.x, y: plate.y }} className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1200px 700px at 72% 30%, hsl(var(--candy-magenta)/0.22), transparent 60%), radial-gradient(900px 600px at 12% 88%, hsl(var(--accent-gold)/0.12), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, hsl(var(--foreground)/0.3) 0 1px, transparent 1px 3px)" }}
        />
      </motion.div>

      {/* ── stage: in flow above the copy on phones, behind the copy from lg up ── */}
      <div className="pointer-events-none relative z-[1] h-[46svh] min-h-[330px] pt-16 lg:absolute lg:inset-0 lg:h-auto lg:min-h-0 lg:pt-0" aria-hidden="true">
        {/* L1 · ghost type behind the subject */}
        <motion.div {...fade(0.15)} className="absolute inset-0 overflow-hidden">
          <GhostWord
            progress={scrollYProgress}
            from="2%"
            to="-12%"
            className="right-[-10%] top-[6%] text-[clamp(9rem,44vw,40rem)] lg:right-[-7%] lg:top-[12%] lg:text-[clamp(12rem,25vw,30rem)]"
          >
            CAP
          </GhostWord>
        </motion.div>

        {/* L2 · record rings */}
        <div className="absolute right-[-14%] top-[4%] aspect-square w-[92%] lg:right-[3%] lg:top-[7%] lg:w-[46%] lg:max-w-[700px]">
          <motion.div {...fade(0.3)} className="h-full w-full">
            <motion.div style={{ x: ring.x, y: ring.y, rotate: ringRotate }} className="h-full w-full">
              <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
                <circle cx="200" cy="200" r="196" stroke="hsl(39 67% 55%)" strokeOpacity="0.22" strokeWidth="1.2" />
                <circle cx="200" cy="200" r="168" stroke="hsl(39 67% 55%)" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="2 7" />
                <circle cx="200" cy="200" r="140" stroke="hsl(333 64% 51%)" strokeOpacity="0.3" strokeWidth="1.2" />
                <circle cx="200" cy="200" r="112" stroke="hsl(39 67% 55%)" strokeOpacity="0.14" strokeWidth="1" />
                <circle cx="200" cy="200" r="84" stroke="hsl(39 67% 55%)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="1 5" />
                {/* one bright arc so the rotation reads */}
                <path d="M 200 4 A 196 196 0 0 1 396 200" stroke="hsl(39 67% 55%)" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* L3 · the subject */}
        <div className="absolute bottom-0 left-1/2 w-[min(96vw,440px,calc(46svh-4rem))] min-w-[250px] -translate-x-1/2 lg:left-auto lg:right-[0%] lg:w-[54%] lg:max-w-[780px] lg:translate-x-0">
          <motion.div
            initial={ok ? { opacity: 0, y: 70 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: EASE_OUT }}
          >
            <motion.div style={{ x: subject.x, y: subject.y, scale: subjectScale }} className="origin-bottom will-change-transform">
              <img
                src={portrait}
                alt=""
                width={1920}
                height={1920}
                decoding="async"
                className="block aspect-square w-full object-contain"
                style={{
                  filter: "contrast(1.05) saturate(0.95) drop-shadow(0 0 1px hsl(39 67% 55% / 0.6)) drop-shadow(-26px 10px 44px hsl(333 64% 51% / 0.28))",
                  WebkitMaskImage: "linear-gradient(to bottom, #000 74%, transparent 99%)",
                  maskImage: "linear-gradient(to bottom, #000 74%, transparent 99%)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* mist in front of the subject's cut edge */}
        <div className="absolute inset-x-0 bottom-0 hidden h-[26%] bg-gradient-to-t from-background via-background/70 to-transparent lg:block" />

        {/* L5 · foreground: dust */}
        {(
          [
            ["far", dustFar, DUST.far, "h-[3px] w-[3px] bg-[hsl(var(--accent-gold))]/40"],
            ["mid", dustMid, DUST.mid, "h-1 w-1 bg-[hsl(var(--accent-gold))]/60"],
            ["near", dustNear, DUST.near, "h-1.5 w-1.5 bg-[hsl(var(--foreground))]/30 blur-[1.5px]"],
          ] as const
        ).map(([name, layer, dots, dotClass]) => (
          <motion.div key={name} style={{ x: layer.x, y: layer.y }} className="absolute inset-0">
            {dots.map(([left, top, delay], i) => (
              <span
                key={i}
                className={`absolute rounded-full ${dotClass} ${ok ? "animate-dust-drift" : ""}`}
                style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${(delay as number) * -1.3}s` }}
              />
            ))}
          </motion.div>
        ))}

        {/* foreground coin, faster than everything else */}
        <div className="absolute bottom-[7%] right-[5%] w-[clamp(64px,19vw,96px)] lg:right-auto lg:bottom-[20%] lg:left-[61%] xl:left-[54%] lg:w-[clamp(96px,9.5vw,146px)]">
          <motion.div {...fade(0.6)}>
            <motion.div style={{ x: coinL.x, y: coinL.y, rotate: coinRotate }}>
              <img
                src={coin}
                alt=""
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="block w-full drop-shadow-[0_22px_26px_hsl(0_0%_0%/0.6)]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* file tag riding on the subject */}
        <div className="absolute bottom-[16%] right-[4%] hidden lg:block">
          <motion.div {...fade(0.9)}>
            <motion.div
              style={{ x: tag.x, y: tag.y }}
              className="border-l-2 border-[hsl(var(--accent-gold))] bg-background/80 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur"
            >
              <div className="flex items-center justify-between gap-6">
                <span className="text-muted-foreground">Subject</span>
                <span className="text-foreground">Cornelius A. Pratt</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-6">
                <span className="text-muted-foreground">Active since</span>
                <span className="text-foreground">The 1990s</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* breadcrumb */}
      <nav className="absolute left-0 right-0 top-24 z-20" aria-label="Breadcrumb">
        <div className="container mx-auto flex items-center gap-2 px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-[hsl(var(--accent-gold))]">
            Index
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-foreground">Who Is Mr. CAP</span>
        </div>
      </nav>

      {/* ── L4 · headline and copy ─────────────────────────────────── */}
      <motion.div
        style={{ y: copyS, opacity: copyOpacity }}
        className="container relative z-10 mx-auto -mt-24 px-6 pb-24 lg:mt-0 lg:pb-16 lg:pt-[clamp(6.5rem,15svh,10.5rem)]"
      >
        <div className="max-w-[46rem] lg:w-[58%]">
          <div className="hidden lg:block">
            <Reveal>
              <Stamp>File No. 001 · Houston, TX · Origin File</Stamp>
            </Reveal>
          </div>

          <h1 className="font-display tracking-tight lg:mt-6">
            <span className="sr-only">Who is Mr. CAP</span>
            <span aria-hidden="true" className="block">
              <span className="block pb-1 text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.1] text-[hsl(var(--foreground)/0.85)] sm:text-[hsl(var(--foreground)/0.6)]">
                {"Who is".split("").map((ch, i) => (
                  <Letter key={i} ch={ch} index={i * 0.4} delay={0.25 + i * 0.04} progress={scrollYProgress} />
                ))}
              </span>
              <span className="block text-[clamp(3.6rem,min(10.2vw,17svh),9.25rem)] leading-[0.9] text-foreground">
                {"MR.".split("").map((ch, i) => (
                  <Letter key={i} ch={ch} index={i} delay={0.4 + i * 0.07} progress={scrollYProgress} />
                ))}
              </span>
              <span className="block text-[clamp(3.6rem,min(10.2vw,17svh),9.25rem)] leading-[0.9] text-[hsl(var(--accent-gold))]">
                {"CAP".split("").map((ch, i) => (
                  <Letter key={i} ch={ch} index={i + 3} delay={0.6 + i * 0.07} progress={scrollYProgress} />
                ))}
              </span>
            </span>
          </h1>

          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-[hsl(var(--foreground)/0.78)] md:text-lg lg:text-xl">
              Three decades of <span className="text-foreground">music</span>, <span className="text-foreground">ownership</span>, and{" "}
              <span className="text-foreground">independent evolution</span> — pressed into vinyl, distributed on-chain, and still built in South Park.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--foreground)/0.65)] sm:flex">
              {["Houston Original", "SPC", "Artist", "Founder", "Futurist"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent-gold))]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
              <Button variant="flux" size="lg" asChild className="rounded-none">
                <Link to="/music">
                  <Music className="mr-2 h-4 w-4" />
                  Listen to the Catalog
                </Link>
              </Button>
              <Button variant="fluxOutline" size="lg" asChild className="rounded-none">
                <Link to="/booking">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Mr. CAP
                </Link>
              </Button>
              <button
                type="button"
                onClick={onOpenPressKit}
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--accent-gold))] transition-colors hover:text-foreground max-sm:ml-auto"
              >
                View / Download Press Kit
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <Rule />
      </div>
    </section>
  );
};

export default HeroStage;

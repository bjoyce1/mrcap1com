import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import theLifeDoc from "@/assets/the-life-documentary.webp";
import EmmySeal from "./EmmySeal";
import { Reveal, Scramble, SplitText } from "./motion";
import { useMotionOk } from "./motionUtils";
import { Stamp } from "./parts";

/**
 * Official Emmy / NATAS logo file, if the Lone Star Chapter supplied one with the winner's usage
 * guidelines (SVG or transparent PNG in /public, e.g. "/images/emmy-lone-star.svg").
 * While this is null the seal shows its own "EMMY" wordmark.
 */
const EMMY_LOGO_SRC: string | null = null;

const PBS_URL = "https://www.pbs.org/show/the-life/";

const STATS = [
  { n: "30+", l: "Years in the catalog" },
  { n: "SPC", l: "Long-time member" },
  { n: "2021", l: "First Houston Hip-Hop NFT" },
  { n: "2024", l: "Lone Star Emmy® Award, The Life", accent: true },
];

type Props = {
  /** When set, the key art opens the captioned trailer instead of linking out to PBS. */
  trailerId: string | null;
  onPlayTrailer: () => void;
};

const ReceiptsEmmy = ({ trailerId, onPlayTrailer }: Props) => {
  const ok = useMotionOk();
  const feature = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: feature, offset: ["start end", "end start"] });

  const artScale = useTransform(scrollYProgress, [0, 1], ok ? [1.16, 1.1] : [1, 1]);
  const artY = useTransform(scrollYProgress, [0, 1], ok ? ["-4%", "4%"] : ["0%", "0%"]);
  const plateY = useTransform(scrollYProgress, [0, 1], ok ? [30, -30] : [0, 0]);
  const sealY = useTransform(scrollYProgress, [0, 1], ok ? [-34, 34] : [0, 0]);
  const sealSpin = useTransform(scrollYProgress, [0, 1], ok ? [-80, 200] : [0, 0]);
  const glowY = useTransform(scrollYProgress, [0, 1], ok ? [60, -60] : [0, 0]);

  const artInner = (
    <>
      <motion.img
        src={theLifeDoc}
        alt="The Life: Sex Trafficking and Modern-Day Slavery — documentary key art announcing the 2024 Emmy Awards winner"
        loading="lazy"
        decoding="async"
        width={1581}
        height={1581}
        style={{ scale: artScale, y: artY }}
        className="block h-full w-full object-cover object-top will-change-transform"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-gold)/0.16)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  );

  const artClass =
    "group relative block aspect-[100/93] w-full overflow-hidden border border-[hsl(var(--foreground)/0.14)] bg-card shadow-[0_40px_80px_hsl(0_0%_0%/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <section
      id="ch-receipts"
      className="relative scroll-mt-24 overflow-x-clip border-y border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--card)/0.4)] py-24 md:py-32"
    >
      <div className="container mx-auto px-6">
        <Reveal>
          <Stamp>Chapter 06 · Receipts</Stamp>
        </Reveal>
        <SplitText as="h2" className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95]">
          Cultural impact, documented.
        </SplitText>

        <div className="mt-14 grid grid-cols-2 gap-0 border-y border-[hsl(var(--foreground)/0.12)] md:grid-cols-4 md:divide-x md:divide-[hsl(var(--foreground)/0.12)]">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div
                className={`relative h-full p-6 md:p-8 ${i % 2 === 1 ? "border-l border-[hsl(var(--foreground)/0.12)] md:border-l-0" : ""} ${
                  i > 1 ? "border-t border-[hsl(var(--foreground)/0.12)] md:border-t-0" : ""
                } ${s.accent ? "bg-[linear-gradient(160deg,hsl(var(--accent-gold)/0.16),transparent_70%)]" : ""}`}
              >
                {s.accent && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[hsl(var(--accent-gold))]" />}
                <div className="font-display text-4xl text-[hsl(var(--accent-gold))] md:text-5xl">
                  <Scramble text={s.n} delay={i * 0.12} />
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the documentary, and its Emmy */}
        <div ref={feature} className="relative mt-20 grid items-center gap-x-14 gap-y-14 lg:mt-24 lg:grid-cols-12 lg:gap-y-20">
          <motion.div
            aria-hidden="true"
            style={{ y: glowY }}
            className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--accent-gold)/0.16),transparent_65%)] blur-2xl"
          />

          <Reveal className="relative min-w-0 lg:col-span-5">
            <figure className="relative mx-auto max-w-[560px] pb-10 pr-6 sm:pr-10">
              {/* plate: an offset frame that moves against the art */}
              <motion.div
                aria-hidden="true"
                style={{ y: plateY }}
                className="absolute bottom-6 left-4 right-2 top-4 border border-[hsl(var(--accent-gold)/0.5)] sm:left-5 sm:right-4 sm:top-5"
              />
              {trailerId ? (
                <button
                  type="button"
                  onClick={onPlayTrailer}
                  aria-haspopup="dialog"
                  aria-label="Play trailer: The Life — Sex Trafficking and Modern-Day Slavery (opens video with captions)"
                  className={`${artClass} relative`}
                >
                  {artInner}
                </button>
              ) : (
                <a
                  href={PBS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch The Life — Sex Trafficking and Modern-Day Slavery on PBS (opens in a new tab)"
                  className={`${artClass} relative`}
                >
                  {artInner}
                </a>
              )}

              {/* the seal hangs off the corner, in front of everything and on its own layer */}
              <div className="pointer-events-none absolute -bottom-3 -right-1 z-10 w-[116px] sm:-bottom-4 sm:right-0 sm:w-[148px]">
                <motion.div style={{ y: sealY }}>
                  <EmmySeal spin={sealSpin} logoSrc={EMMY_LOGO_SRC} />
                </motion.div>
              </div>

              <figcaption className="mt-6 max-w-[21rem] pr-[7.5rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-muted-foreground sm:pr-0 sm:tracking-[0.28em]">
                Documentary · Featured Contributor · 2024 Lone Star Emmy® Award Winner
              </figcaption>
            </figure>
          </Reveal>

          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--accent-gold))]">
                <span aria-hidden="true" className="h-px w-8 bg-[hsl(var(--accent-gold))]/70" />
                <Scramble text="2024 Lone Star Emmy® Award Winner" className="whitespace-normal" />
              </p>
            </Reveal>
            <SplitText as="h3" className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.02] [text-wrap:balance]">
              The Life: Sex Trafficking and Modern-Day Slavery
            </SplitText>
            <Reveal delay={0.1}>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/80">
                Public Affairs Programming · PBS documentary
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
                A social-issue documentary in which Mr. CAP contributes firsthand perspective — using his platform for community engagement and cultural commentary that reaches well outside the record.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[hsl(var(--foreground)/0.7)]">
                Mr. CAP appears as a featured contributor.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {trailerId ? (
                  <button
                    type="button"
                    onClick={onPlayTrailer}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--accent-gold))] transition-colors hover:text-foreground"
                  >
                    <Play className="h-3.5 w-3.5" fill="currentColor" /> Play Trailer
                  </button>
                ) : (
                  <a
                    href={PBS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--accent-gold))] transition-colors hover:text-foreground"
                  >
                    Watch on PBS <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                <Link
                  to="/press"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Press & Media Coverage <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceiptsEmmy;

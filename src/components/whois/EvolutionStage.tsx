import { useId, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import coin from "@/assets/mr-cap-coin.webp";
import nftLimitless from "@/assets/nft-limitless.webp";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import { Reveal, SplitText } from "./motion";
import { useMediaMatch, useMotionOk, usePointerParallax } from "./motionUtils";
import { Gold, Stamp } from "./parts";

const RING_TEXT = "CAPICOIN · CCHX · THE FIRST HOUSTON HIP-HOP NFT · 2021 · OWN THE WORK · ";

/** Opacity / lift for one beat of copy, from the scene's scroll progress. */
function useBeat(progress: MotionValue<number>, input: number[], opacity: number[], rise: number[], ok: boolean) {
  const o = useTransform(progress, input, ok ? opacity : opacity.map(() => 1));
  const y = useTransform(progress, input, ok ? rise : rise.map(() => 0));
  return { opacity: o, y };
}

const Satellite = ({
  progress,
  at,
  from,
  className,
  src,
  alt,
  tag,
  ok,
}: {
  progress: MotionValue<number>;
  at: [number, number];
  from: { x: string; y: string };
  className: string;
  src: string;
  alt: string;
  tag: string;
  ok: boolean;
}) => {
  const opacity = useTransform(progress, at, ok ? [0, 1] : [1, 1]);
  const x = useTransform(progress, at, ok ? [from.x, "0%"] : ["0%", "0%"]);
  const y = useTransform(progress, at, ok ? [from.y, "0%"] : ["0%", "0%"]);
  return (
    <motion.figure style={{ opacity, x, y }} className={`absolute ${className}`}>
      <div className="relative">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block aspect-square w-full border border-[hsl(var(--foreground)/0.16)] object-cover shadow-[0_28px_50px_hsl(0_0%_0%/0.6)]"
        />
        <figcaption className="absolute -bottom-3 left-2 hidden bg-background px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[hsl(var(--accent-gold))] sm:block">
          {tag}
        </figcaption>
      </div>
    </motion.figure>
  );
};

const EvolutionStage = () => {
  // a pinned stage must fit the screen; on very short screens the scene simply lays out in the page
  const short = useMediaMatch("(max-height: 659px)");
  const ok = useMotionOk() && !short;
  const uid = useId().replace(/:/g, "");
  const runway = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: runway, offset: ["start start", "end end"] });
  const { x: px, y: py } = usePointerParallax(scene);

  // the coin leans with the scroll and follows the mouse a little
  const swing = useTransform(p, [0, 0.33, 0.66, 1], ok ? [-20, 24, -24, 18] : [0, 0, 0, 0]);
  const tilt = useTransform(p, [0, 1], ok ? [-8, 12] : [0, 0]);
  const ringTurn = useTransform(p, [0, 1], ok ? [0, 320] : [0, 0]);
  const coinScale = useTransform(p, [0, 0.33, 0.66, 1], ok ? [1, 1.05, 0.96, 1.02] : [1, 1, 1, 1]);
  const rotY = useTransform([swing, px], ([s, m]: number[]) => s + m * 14);
  const rotX = useTransform(py, (v) => v * -12);
  const glow = useTransform(p, [0, 0.5, 1], ok ? [0.35, 0.6, 0.4] : [0.4, 0.4, 0.4]);

  const b1 = useBeat(p, [0, 0.25, 0.3], [1, 1, 0], [0, 0, -18], ok);
  const b2 = useBeat(p, [0.31, 0.37, 0.58, 0.63], [0, 1, 1, 0], [18, 0, 0, -18], ok);
  const b3 = useBeat(p, [0.64, 0.7, 1], [0, 1, 1], [18, 0, 0], ok);
  const beats = [b1, b2, b3];

  const dot1 = useTransform(p, [0, 0.3, 0.31], ok ? [1, 1, 0.3] : [1, 1, 1]);
  const dot2 = useTransform(p, [0.3, 0.31, 0.62, 0.64], ok ? [0.3, 1, 1, 0.3] : [1, 1, 1, 1]);
  const dot3 = useTransform(p, [0.62, 0.64], ok ? [0.3, 1] : [1, 1]);
  const dots = [dot1, dot2, dot3];

  const copy = [
    <>
      <span className="text-foreground">CAP Distributions</span> puts independent artists on global platforms without giving up ownership.
    </>,
    <>
      In February 2021, Mr. CAP became the <span className="text-foreground">first Houston rapper to sell a Hip-Hop NFT</span> — extending the ownership principle into on-chain culture alongside blockchain projects like <span className="text-foreground">Capicoin (CCHX)</span>.
    </>,
    <>
      <span className="text-foreground">The Art of ISM</span> is where the philosophy lives out loud — album, book, and a worldview built around individual sovereignty.
    </>,
  ];

  return (
    <section id="ch-evolution" className="relative scroll-mt-24">
      <div ref={runway} className={ok ? "relative h-[270svh]" : "relative py-28 md:py-36"}>
        <div className={ok ? "sticky top-0 h-[100svh] overflow-hidden" : ""}>
          <div
            className={`container mx-auto grid gap-8 px-6 lg:grid-cols-12 lg:gap-10 ${
              ok ? "h-full content-center pb-6 pt-20 lg:content-center lg:pt-16" : "items-center"
            }`}
          >
            {/* copy */}
            <div className="order-2 lg:order-1 lg:col-span-6">
              <div className="hidden sm:block">
                <Reveal>
                  <Stamp>Chapter 05 · From Cassettes to Code</Stamp>
                </Reveal>
              </div>
              <SplitText as="h2" className="font-display text-[clamp(2.1rem,5.2vw,4.5rem)] leading-[0.9] sm:mt-5 lg:mt-7">
                Same principle.
                <br />
                <Gold>New infrastructure.</Gold>
              </SplitText>

              <div className="mt-6 flex gap-4 lg:mt-8">
                {/* beat markers */}
                <div className="hidden flex-col gap-3 pt-2 sm:flex" aria-hidden="true">
                  {dots.map((o, i) => (
                    <motion.span key={i} style={{ opacity: o }} className="h-8 w-px bg-[hsl(var(--accent-gold))]" />
                  ))}
                </div>
                <div className={ok ? "relative min-h-[8.75rem] flex-1 sm:min-h-[8.5rem] lg:min-h-[9rem]" : "flex-1 space-y-6"}>
                  {copy.map((node, i) => (
                    <motion.p
                      key={i}
                      style={{ opacity: beats[i].opacity, y: beats[i].y }}
                      className={`text-[15px] leading-relaxed text-[hsl(var(--foreground)/0.78)] sm:text-base md:text-lg ${ok ? "absolute inset-x-0 top-0" : ""}`}
                    >
                      {node}
                    </motion.p>
                  ))}
                </div>
              </div>

              <Reveal delay={0.1}>
                <div className="mt-6 flex flex-wrap gap-3 lg:mt-8 lg:gap-4">
                  <Button variant="fluxOutline" asChild className="rounded-none">
                    <Link to="/nft">
                      <Disc3 className="mr-2 h-4 w-4" /> NFT Gallery
                    </Link>
                  </Button>
                  <Button variant="fluxOutline" asChild className="rounded-none">
                    <Link to="/art-of-ism">
                      The Art of ISM <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* the coin scene */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <div
                ref={scene}
                className="relative mx-auto aspect-square w-[min(74vw,300px,30svh)] sm:w-[min(60vw,400px,38svh)] lg:w-[min(100%,calc(100svh-11rem),560px)]"
              >
                {/* ring of lettering */}
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 400 400"
                  style={{ rotate: ringTurn }}
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                >
                  <defs>
                    <path id={`${uid}-r`} d="M 200 200 m -176 0 a 176 176 0 1 1 352 0 a 176 176 0 1 1 -352 0" />
                  </defs>
                  <circle cx="200" cy="200" r="196" stroke="hsl(39 67% 55%)" strokeOpacity="0.28" strokeWidth="1" />
                  <circle cx="200" cy="200" r="158" stroke="hsl(39 67% 55%)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 6" />
                  <text
                    fill="hsl(39 67% 55%)"
                    fillOpacity="0.85"
                    fontFamily="'Space Mono', monospace"
                    fontSize="13.5"
                    letterSpacing="3"
                  >
                    <textPath href={`#${uid}-r`} textLength={2 * Math.PI * 176 - 4} lengthAdjust="spacing">
                      {RING_TEXT}
                    </textPath>
                  </text>
                </motion.svg>

                {/* warm light behind the coin */}
                <motion.div
                  aria-hidden="true"
                  style={{ opacity: glow }}
                  className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_35%_30%,hsl(var(--accent-gold)/0.55),transparent_62%)] blur-2xl"
                />

                {/* the coin */}
                <div className="absolute inset-[19%] [perspective:1100px]">
                  <motion.div style={{ rotateY: rotY, rotateX: rotX, rotateZ: tilt, scale: coinScale }} className="h-full w-full will-change-transform">
                    <img
                      src={coin}
                      alt="Mr. CAP coin — Capicoin monogram"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain drop-shadow-[0_30px_50px_hsl(var(--accent-gold)/0.28)]"
                    />
                  </motion.div>
                </div>

                {/* artwork arriving behind and beside the coin as the story moves */}
                <Satellite
                  progress={p}
                  at={[0.3, 0.4]}
                  from={{ x: "-35%", y: "20%" }}
                  className="-right-[6%] top-[4%] z-10 w-[30%] rotate-[6deg] lg:-right-[10%]"
                  src={nftLimitless}
                  alt="Limitless, the first Houston hip-hop NFT artwork"
                  tag="First Houston Hip-Hop NFT · 2021"
                  ok={ok}
                />
                <Satellite
                  progress={p}
                  at={[0.62, 0.72]}
                  from={{ x: "40%", y: "-20%" }}
                  className="-left-[6%] bottom-[8%] z-10 w-[32%] -rotate-[5deg] lg:-left-[10%]"
                  src={albumArtOfIsm}
                  alt="The Art of ISM album artwork"
                  tag="The Art of ISM"
                  ok={ok}
                />
              </div>
              <p className="mx-auto mt-6 hidden max-w-[34rem] justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:flex">
                <span>Capicoin · CCHX</span>
                <span>First Houston Hip-Hop NFT · 2021</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvolutionStage;

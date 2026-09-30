import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import spcAustin from "@/assets/spc-austin-2025.webp";
import { Parallax, Reveal, Scramble, SplitText } from "./motion";
import { useMotionOk } from "./motionUtils";
import { Gold, Stamp } from "./parts";

const PRINCIPLES = [
  { n: "I", t: "Own the work", d: "Masters, publishing, direct catalog. No landlord.", wash: "from-[hsl(var(--card))] to-[hsl(var(--background))]" },
  { n: "II", t: "Build the audience", d: "Show by show, tape by tape, city by city. Compound.", wash: "from-[hsl(var(--card))] via-[hsl(var(--card))] to-[hsl(var(--candy-magenta)/0.16)]" },
  { n: "III", t: "Outlast the hype", d: "Longevity is the flex. Careers over cycles.", wash: "from-[hsl(var(--card))] via-[hsl(var(--card))] to-[hsl(var(--accent-gold)/0.16)]" },
] as const;

// how far each card's tab peeks out from under the next one (rem)
const TAB = 3.25;

/** One index card. It settles back (smaller, dimmer) as the next card slides over it. */
const Card = ({
  item,
  index,
  arrival,
  nextArrival,
}: {
  item: (typeof PRINCIPLES)[number];
  index: number;
  /** 0..1 as this card slides up into its pinned spot; the card above reads it */
  arrival: MotionValue<number>;
  /** the same value for the card that will cover this one (null for the last card) */
  nextArrival: MotionValue<number> | null;
}) => {
  const ok = useMotionOk();
  const ownRef = useRef<HTMLLIElement>(null);
  const { scrollYProgress: entering } = useScroll({ target: ownRef, offset: ["start end", "start start"] });
  useMotionValueEvent(entering, "change", (v) => arrival.set(v));

  const covered = nextArrival ?? arrival;
  const scale = useTransform(covered, [0, 1], ok && nextArrival ? [1, 0.955] : [1, 1]);
  // a dark veil instead of opacity, so a buried card stays solid and never shows the card beneath it
  const veil = useTransform(covered, [0, 1], ok && nextArrival ? [0, 0.6] : [0, 0]);

  return (
    <li
      ref={ownRef}
      className={ok ? "sticky" : "mb-4"}
      style={ok ? { top: `calc(5.75rem + ${index * TAB}rem)`, marginBottom: index === PRINCIPLES.length - 1 ? 0 : "1.5rem" } : undefined}
    >
      <motion.div style={{ scale }} className="origin-top will-change-transform">
        <div
          className={`relative overflow-hidden border border-[hsl(var(--foreground)/0.16)] bg-gradient-to-br ${item.wash} shadow-[0_-26px_60px_hsl(0_0%_0%/0.55)]`}
        >
          {/* the tab that stays visible when the card is buried */}
          <div className="flex h-[3.25rem] items-center justify-between border-b border-[hsl(var(--foreground)/0.12)] px-6 md:px-10 font-mono text-[10px] uppercase tracking-[0.32em]">
            <span className="text-[hsl(var(--accent-gold))]">Principle {item.n}</span>
            <span className="text-foreground/80">{item.t}</span>
          </div>

          <div className="grid items-center gap-4 px-6 py-8 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-12 md:px-10 md:py-14">
            <div
              aria-hidden="true"
              className="font-display text-[clamp(5rem,13vw,11rem)] leading-[0.85] text-transparent"
              style={{ WebkitTextStroke: "2px hsl(var(--accent-gold))" }}
            >
              {item.n}
            </div>
            <div>
              <h3 className="font-display text-[clamp(2rem,4.4vw,3.75rem)] uppercase leading-none tracking-tight">{item.t}</h3>
              <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">{item.d}</p>
            </div>
          </div>
          <motion.div aria-hidden="true" style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-background" />
        </div>
      </motion.div>
    </li>
  );
};

const BlueprintStack = () => {
  // one arrival value per card, owned here so a card can read the one that lands on top of it
  const arrivals = [useMotionValue(0), useMotionValue(0), useMotionValue(0)];

  return (
    <section id="ch-spc" className="relative py-32 scroll-mt-24 md:py-40">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <Stamp>Chapter 03 · SPC Legacy</Stamp>
            </Reveal>
            <SplitText as="h2" className="mt-8 font-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.92]">
              Not a badge.
              <br />
              <Gold>A blueprint.</Gold>
            </SplitText>
          </div>

          <div className="flex items-start gap-8 lg:col-span-6">
            <div className="min-w-0 flex-1">
              <Reveal delay={0.1}>
                <p className="text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
                  The South Park Coalition wasn't a label deal or a scene. It was a working model — masters retained, product moved direct, artists carried on tour by artists. Mr. CAP has spent a career inside that model and building on top of it.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Link
                  to="/south-park-coalition"
                  className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--accent-gold))] transition-colors hover:text-foreground"
                >
                  Enter the SPC archive
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>

            {/* dated proof that the model is still running */}
            <Parallax from={26} to={-26} className="hidden w-[168px] shrink-0 sm:block">
              <figure className="relative rotate-[3deg] border border-[hsl(var(--foreground)/0.16)] shadow-[0_30px_60px_hsl(0_0%_0%/0.6)] transition-transform duration-700 ease-out hover:rotate-0">
                <img
                  src={spcAustin}
                  alt="Flyer for the South Park Coalition show at Flamingo Cantina in Austin, Texas, on Saturday, December 13, 2025"
                  loading="lazy"
                  decoding="async"
                  width={1493}
                  height={1920}
                  className="block w-full"
                />
                <figcaption className="absolute -top-3 left-3 right-3 bg-[hsl(var(--accent-gold))] px-2 py-1 font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-background">
                  <Scramble text="Still touring · Dec 13, 2025" className="whitespace-normal" />
                </figcaption>
              </figure>
            </Parallax>
          </div>
        </div>

        <ol className="mt-16 md:mt-24">
          {PRINCIPLES.map((p, i) => (
            <Card
              key={p.n}
              item={p}
              index={i}
              arrival={arrivals[i]}
              nextArrival={i < PRINCIPLES.length - 1 ? arrivals[i + 1] : null}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default BlueprintStack;

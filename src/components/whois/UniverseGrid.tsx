import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SplitText } from "./motion";
import { useMotionOk } from "./motionUtils";
import { Gold, Stamp } from "./parts";

export type UniverseItem = { to: string; label: string; sub: string; img: string };

// each column drifts a different way, so the grid never moves as one slab
const DRIFT: Array<[number, number]> = [
  [10, -26],
  [46, -46],
  [22, -30],
  [58, -58],
];

const Tile = ({
  item,
  index,
  columns,
  progress,
}: {
  item: UniverseItem;
  index: number;
  columns: number;
  progress: MotionValue<number>;
}) => {
  const ok = useMotionOk();
  const [from, to] = DRIFT[index % columns];
  const y = useTransform(progress, [0, 1], ok ? [from, to] : [0, 0]);
  return (
    <motion.li style={{ y }} className="min-w-0">
      <Reveal delay={(index % columns) * 0.06}>
        <Link
          to={item.to}
          className="group relative block aspect-[4/5] overflow-hidden border border-[hsl(var(--foreground)/0.12)] bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            src={item.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105"
            style={{ filter: "grayscale(0.5) contrast(1.05)" }}
          />
          {/* a firm scrim under the words, because these covers carry their own lettering */}
          <div className="absolute inset-0 bg-gradient-to-t from-background from-10% via-background/70 via-45% to-transparent transition-opacity duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,hsl(var(--accent-gold)/0.28),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--accent-gold))]">0{index + 1}</div>
            <div className="mt-2 font-display text-lg leading-tight text-foreground sm:text-2xl md:text-3xl">{item.label}</div>
            <div className="mt-1 text-xs text-[hsl(var(--foreground)/0.7)]">{item.sub}</div>
            <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition-colors group-hover:text-[hsl(var(--accent-gold))]">
              Enter <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </Link>
      </Reveal>
    </motion.li>
  );
};

const UniverseGrid = ({ items }: { items: UniverseItem[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section id="ch-universe" className="relative scroll-mt-24 py-32 md:py-40">
      <div className="container mx-auto px-6">
        <div className="mb-14">
          <Reveal>
            <Stamp>Chapter 07 · The Universe</Stamp>
          </Reveal>
          <SplitText as="h2" className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.9]">
            Enter the <Gold>Mr. CAP</Gold> universe.
          </SplitText>
        </div>

        <div ref={ref}>
          {/* two columns on phones and tablets, four from lg */}
          <ul className="grid grid-cols-2 gap-3 pb-16 md:gap-4 lg:grid-cols-4">
            {items.map((item, i) => (
              <Tile key={item.to} item={item} index={i} columns={4} progress={scrollYProgress} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default UniverseGrid;

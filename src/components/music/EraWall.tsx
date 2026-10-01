import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { Track } from "@/stores/playerStore";
import { EASE_OUT, useMediaMatch, useMotionOk } from "@/components/whois/motionUtils";
import TrackCard from "./TrackCard";
import { Rail, ShelfHeader } from "./ShelfParts";
import { WRAP, groupByYear } from "./catalog";

const TITLE = "Singles & Features";
const BLURB = "Loosies, guest spots and one-off chapters, year by year.";

/**
 * Singles as an era wall. On wide screens the page's own scroll walks the wall
 * sideways (so a plain mouse wheel works), and the year you're standing in fills
 * the background. Phones, motion-off and very short screens get a swipe row with
 * the same year markers.
 */
const EraWall = ({ singles }: { singles: Track[] }) => {
  const short = useMediaMatch("(max-height: 659px)");
  const wide = useMediaMatch("(min-width: 768px)");
  const ok = useMotionOk() && !short && wide;
  if (!singles.length) return null;
  const groups = groupByYear(singles);
  return ok ? <Wall singles={singles} groups={groups} /> : <EraRail singles={singles} groups={groups} />;
};

type Groups = ReturnType<typeof groupByYear>;
const yearLabel = (y: number | null) => (y ? String(y) : "Vault");

/** A year marker that stands at the head of its group like a crate divider. */
const YearMarker = ({ year, count, id }: { year: number | null; count: number; id?: string }) => (
  <div id={id} className="relative flex w-12 shrink-0 snap-start flex-col items-center self-stretch md:w-14">
    <span
      className="font-display text-[2.25rem] leading-none text-[hsl(var(--accent-gold))] [writing-mode:vertical-rl] [transform:rotate(180deg)] md:text-[2.75rem]"
    >
      {yearLabel(year)}
    </span>
    <span className="mt-3 w-px flex-1 bg-gradient-to-b from-[hsl(var(--accent-gold)/0.6)] to-transparent" aria-hidden="true" />
    <span className="mt-2 font-mono text-[0.65rem] tabular-nums text-muted-foreground">
      {count}
      <span className="sr-only"> {count === 1 ? "track" : "tracks"}</span>
    </span>
  </div>
);

const YearChips = ({ groups, active, onPick }: { groups: Groups; active: number; onPick: (i: number) => void }) => (
  <nav aria-label="Jump to a year" className="flex flex-wrap gap-2">
    {groups.map((g, i) => (
      <button
        key={g.year ?? "none"}
        type="button"
        onClick={() => onPick(i)}
        aria-current={i === active ? "true" : undefined}
        className={`min-h-[2.75rem] rounded-full border px-4 font-mono text-xs uppercase tabular-nums tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          i === active
            ? "border-[hsl(var(--accent-gold))] bg-[hsl(var(--accent-gold)/0.1)] text-[hsl(var(--accent-gold))]"
            : "border-border/60 text-muted-foreground hover:border-[hsl(var(--accent-gold)/0.5)] hover:text-foreground"
        }`}
      >
        {yearLabel(g.year)}
      </button>
    ))}
  </nav>
);

const Wall = ({ singles, groups }: { singles: Track[]; groups: Groups }) => {
  const runway = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const offsets = useRef<number[]>([]);
  const [active, setActive] = useState(0);

  // how far the strip has to travel, and where each year starts on it
  useLayoutEffect(() => {
    const el = strip.current;
    if (!el) return;
    const measure = () => {
      setTravel(Math.max(0, el.scrollWidth - window.innerWidth));
      offsets.current = Array.from(el.querySelectorAll<HTMLElement>("[data-year-group]"), (g) => g.offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [singles.length]);

  const { scrollYProgress: p } = useScroll({ target: runway, offset: ["start start", "end end"] });
  const x = useTransform(p, (v) => -v * travel);
  const bar = useTransform(p, [0, 1], [0, 1]);

  useMotionValueEvent(p, "change", (v) => {
    const at = v * travel + window.innerWidth * 0.4;
    let i = 0;
    offsets.current.forEach((o, k) => {
      if (o <= at) i = k;
    });
    setActive(i);
  });

  const pick = (i: number) => {
    const el = runway.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const lead = window.innerWidth * 0.08;
    window.scrollTo({ top: top + Math.min(travel, Math.max(0, (offsets.current[i] ?? 0) - lead)), behavior: "smooth" });
  };

  const year = groups[active]?.year;

  return (
    <section id="singles" aria-labelledby="singles-title" className="catalog-section relative">
      <div ref={runway} className="relative" style={{ height: `calc(${travel}px + 100svh)` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          {/* the year you're standing in */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[2svh] left-[3vw] select-none font-display text-[clamp(11rem,30vw,28rem)] leading-none text-transparent"
            style={{ WebkitTextStroke: "2px hsl(var(--foreground) / 0.09)" }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={yearLabel(year)}
                className="block"
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                {yearLabel(year)}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className={`${WRAP} relative pt-24 md:pt-28`}>
            <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div>
                <h2 id="singles-title" className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-foreground">
                  {TITLE}
                </h2>
                <p className="mt-4 max-w-xl text-base text-muted-foreground">{BLURB}</p>
              </div>
              <YearChips groups={groups} active={active} onPick={pick} />
            </header>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center">
            <motion.div
              ref={strip}
              style={{ x }}
              className="flex items-stretch gap-16 pl-[max(1.25rem,calc((100vw-1400px)/2+2.5rem))] pr-[12vw] pt-[clamp(4rem,11svh,6.5rem)] will-change-transform"
            >
              {groups.map((g) => (
                <div key={g.year ?? "none"} data-year-group className="flex items-stretch gap-8">
                  <YearMarker year={g.year} count={g.tracks.length} />
                  {g.tracks.map((t) => (
                    <TrackCard
                      key={t.id}
                      track={t}
                      queue={singles}
                      index={singles.indexOf(t)}
                      className="md:w-[min(300px,34svh)]"
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <div className={`${WRAP} pb-8`} aria-hidden="true">
            <div className="h-px w-full bg-foreground/10">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-[hsl(var(--accent-gold))]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EraRail = ({ singles, groups }: { singles: Track[]; groups: Groups }) => {
  const [active, setActive] = useState(0);
  const ok = useMotionOk();
  const pick = (i: number) => {
    setActive(i);
    document
      .getElementById(`era-${yearLabel(groups[i].year)}`)
      ?.scrollIntoView({ inline: "start", block: "nearest", behavior: ok ? "smooth" : ("instant" as ScrollBehavior) });
  };
  return (
    <section id="singles" aria-labelledby="singles-title" className="catalog-section relative overflow-x-clip py-20 md:py-28">
      <div className={WRAP}>
        <ShelfHeader id="singles-title" title={TITLE} description={BLURB} aside={<YearChips groups={groups} active={active} onPick={pick} />} />
        <Rail label={TITLE}>
          {groups.map((g) => (
            <div key={g.year ?? "none"} className="flex items-stretch gap-6 md:gap-8">
              <YearMarker year={g.year} count={g.tracks.length} id={`era-${yearLabel(g.year)}`} />
              {g.tracks.map((t) => (
                <TrackCard key={t.id} track={t} queue={singles} index={singles.indexOf(t)} />
              ))}
            </div>
          ))}
        </Rail>
      </div>
    </section>
  );
};

export default EraWall;

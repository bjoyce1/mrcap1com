import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { EASE_OUT, useMediaMatch, useMotionOk } from "@/components/whois/motionUtils";
import { Vinyl } from "./Vinyl";
import TrackCard from "./TrackCard";
import { Rail, ShelfHeader } from "./ShelfParts";
import { WRAP, coverImg, credit, fmtDuration } from "./catalog";
import { easeInOut, easeOut, lerp, ramp, scrollToBeat } from "./stageMath";

/** How far the record leaves its sleeve, as a share of the sleeve's width. */
const PULL = 0.55;

/**
 * Out Now — the page's one authored moment.
 *
 * A sticky listening booth for the newest releases. Scrolling pulls each record
 * out of its sleeve and turns it; the next scroll slides it home and hands the
 * booth to the next release. With motion off (or on a very short screen) the
 * same releases sit in an ordinary row.
 */
const OutNowStage = ({ releases }: { releases: Track[] }) => {
  const short = useMediaMatch("(max-height: 659px)");
  const ok = useMotionOk() && !short;
  if (!releases.length) return null;
  return ok ? <Booth releases={releases} /> : <StaticRow releases={releases} />;
};

const StaticRow = ({ releases }: { releases: Track[] }) => (
  <section id="out-now" aria-labelledby="out-now-title" className="catalog-section relative overflow-x-clip py-20 md:py-28">
    <div className={WRAP}>
      <ShelfHeader id="out-now-title" title="Out Now" size="lg" description="The newest releases, straight from the source." />
      <Rail label="New releases">
        {releases.map((t, i) => (
          <TrackCard key={t.id} track={t} queue={releases} index={i} badge={i === 0 ? "New" : undefined} />
        ))}
      </Rail>
    </div>
  </section>
);

const Booth = ({ releases }: { releases: Track[] }) => {
  const n = releases.length;
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: runway, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));

  const { currentTrack, isPlaying } = usePlayerStore();
  const year = releases[active]?.release_year;

  return (
    <section id="out-now" aria-labelledby="out-now-title" className="catalog-section relative">
      <div ref={runway} className="relative" style={{ height: `${n * 85 + 45}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* candy light behind the booth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 22% 55%, hsl(var(--candy-violet) / 0.16), transparent 70%), radial-gradient(45% 45% at 80% 70%, hsl(var(--candy-magenta) / 0.10), transparent 70%)",
            }}
          />

          {/* the release year, big enough to read from across the room */}
          {year && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[1vw] bottom-[9svh] select-none font-display text-[clamp(9rem,27vw,26rem)] leading-none text-transparent lg:bottom-[4svh]"
              style={{ WebkitTextStroke: "2px hsl(var(--accent-gold) / 0.2)" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={year}
                  className="block"
                  initial={{ y: "35%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-35%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                >
                  {year}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          <div className={`${WRAP} relative flex h-full flex-col pb-24 pt-24 md:pb-10 md:pt-28`}>
            <div className="flex items-end justify-between gap-6">
              <h2 id="out-now-title" className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-none text-foreground">
                Out Now
              </h2>
              <Counter p={p} n={n} active={active} />
            </div>

            <div className="grid min-h-0 flex-1 content-center items-center gap-5 md:gap-8 lg:grid-cols-12 lg:gap-10">
              {/* sleeves and records */}
              <div className="lg:col-span-7">
                <div className="relative aspect-square w-[min(56vw,33svh)] md:w-[min(44vw,40svh)] lg:w-[min(33vw,54svh,500px)]">
                  {releases.map((t, i) => (
                    <SleeveLayer
                      key={t.id}
                      track={t}
                      i={i}
                      n={n}
                      p={p}
                      spinning={currentTrack?.id === t.id && isPlaying}
                    />
                  ))}
                </div>
              </div>

              {/* what's playing in the booth */}
              <div className="relative min-h-[12.5rem] md:min-h-[15rem] lg:col-span-5">
                {releases.map((t, i) => (
                  <CopyPanel key={t.id} track={t} i={i} n={n} p={p} active={i === active} queue={releases} />
                ))}
              </div>
            </div>

            <nav aria-label="New releases" className="mt-4 hidden flex-wrap justify-end gap-x-8 gap-y-2 lg:flex">
              {releases.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToBeat(runway, i, n, true)}
                  aria-current={i === active ? "true" : undefined}
                  className={`group flex items-baseline gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="tabular-nums text-[hsl(var(--accent-gold))]">{String(i + 1).padStart(2, "0")}</span>
                  {t.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

/** "01 / 04" plus one segment per release that fills while its beat plays. */
const Counter = ({ p, n, active }: { p: MotionValue<number>; n: number; active: number }) => (
  <div className="flex shrink-0 flex-col items-end gap-2 pb-1" aria-hidden="true">
    <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground">
      <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
    </span>
    <div className="flex gap-1.5">
      {Array.from({ length: n }, (_, i) => (
        <Segment key={i} p={p} i={i} n={n} />
      ))}
    </div>
  </div>
);

const Segment = ({ p, i, n }: { p: MotionValue<number>; i: number; n: number }) => {
  const fill = useTransform(p, (v) => ramp(v * n - i, 0, 1));
  return (
    <span className="relative h-[3px] w-7 overflow-hidden bg-foreground/15 md:w-10">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-[hsl(var(--accent-gold))]" />
    </span>
  );
};

const SleeveLayer = ({
  track,
  i,
  n,
  p,
  spinning,
}: {
  track: Track;
  i: number;
  n: number;
  p: MotionValue<number>;
  spinning: boolean;
}) => {
  const first = i === 0;
  const last = i === n - 1;
  const t = (v: number) => v * n - i;

  const enter = (v: number) => (first ? 1 : easeOut(ramp(t(v), -0.16, 0.05)));
  const leave = (v: number) => (last ? 0 : easeInOut(ramp(t(v), 0.84, 1)));

  const opacity = useTransform(p, (v) => Math.min(enter(v), 1 - leave(v)));
  const y = useTransform(p, (v) => `${lerp(12, 0, enter(v)) + lerp(0, -10, leave(v))}%`);
  const scale = useTransform(p, (v) => lerp(1, 0.9, leave(v)));
  // out of the sleeve early in the beat, home again just before the sleeve leaves
  const pull = useTransform(p, (v) => {
    const out = easeInOut(ramp(t(v), 0.04, 0.46));
    const home = last ? 0 : easeInOut(ramp(t(v), 0.68, 0.84));
    return `${(out - home) * PULL * 100}%`;
  });
  const turn = useTransform(p, (v) => t(v) * 220);
  const glow = useTransform(p, (v) => lerp(0.25, 0.75, easeInOut(ramp(t(v), 0.04, 0.46))));

  return (
    <motion.div style={{ opacity, y, scale }} className="absolute inset-0 will-change-transform">
      <motion.div style={{ x: pull }} className="absolute inset-0 z-[1]">
        <motion.div
          aria-hidden="true"
          style={{ opacity: glow }}
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,hsl(var(--candy-magenta)/0.35),transparent_68%)] blur-2xl"
        />
        <motion.div style={{ rotate: turn }} className="absolute inset-0">
          <Vinyl cover={track.cover_art_url} className={`booth-vinyl ${spinning ? "is-spinning" : ""}`} />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 z-[2] overflow-hidden border border-[hsl(var(--foreground)/0.14)] bg-card shadow-[0_30px_70px_-10px_hsl(0_0%_0%/0.7),0_10px_18px_hsl(0_0%_0%/0.35)]">
        <img
          {...coverImg(track.cover_art_url, "(min-width: 1024px) 500px, (min-width: 768px) 44vw, 56vw")}
          alt={`${track.title} cover art`}
          loading={first ? "eager" : "lazy"}
          decoding="async"
          className="block h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
};

const CopyPanel = ({
  track,
  i,
  n,
  p,
  active,
  queue,
}: {
  track: Track;
  i: number;
  n: number;
  p: MotionValue<number>;
  active: boolean;
  queue: Track[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;
  const playingThis = isActive && isPlaying;

  // only the release in the booth can take focus or clicks
  useEffect(() => {
    ref.current?.toggleAttribute("inert", !active);
  }, [active]);

  const t = (v: number) => v * n - i;
  const enter = (v: number) => (i === 0 ? 1 : easeOut(ramp(t(v), 0.02, 0.16)));
  const leave = (v: number) => (i === n - 1 ? 0 : ramp(t(v), 0.8, 0.93));
  const opacity = useTransform(p, (v) => Math.min(enter(v), 1 - leave(v)));
  const y = useTransform(p, (v) => lerp(28, 0, enter(v)) + lerp(0, -28, leave(v)));

  const duration = fmtDuration(track.duration);
  const meta = [track.release_year, track.album_id ? null : "Single", duration].filter(Boolean).join(" · ");

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      aria-hidden={!active}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[hsl(var(--accent-gold))]">{meta}</p>
      <h3 className="font-display mt-3 text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.92] text-foreground [text-wrap:balance]">
        {track.title}
        {track.explicit && (
          <span className="ml-3 inline-block translate-y-[-0.35em] rounded bg-muted px-1.5 py-0.5 align-middle font-mono text-[11px] leading-none text-muted-foreground" title="Explicit">
            E
          </span>
        )}
      </h3>
      <p className="mt-3 text-base text-muted-foreground md:text-lg">{credit(track)}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!track.audio_url}
          onClick={() => (isActive ? togglePlay() : track.audio_url && playTrack(track, queue, i))}
          className="candy-sheen inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground shadow-[0_14px_30px_-8px_hsl(var(--candy-magenta)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-40"
        >
          {playingThis ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playingThis ? "Pause" : "Play"}
        </button>
        <Link
          to={`/track/${track.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-gold)/0.4)] px-6 py-3 font-medium text-foreground transition-colors hover:border-[hsl(var(--accent-gold))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Track details <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default OutNowStage;

import { useRef, type MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { EASE_OUT, useMotionOk } from "@/components/whois/motionUtils";
import { coverThumb, credit, fmtDuration } from "./catalog";

/**
 * Most Played reads as a chart. When it arrives, the rank numerals light up one
 * after another and number one keeps the gold; a gold needle draws down the
 * left edge as you read down the list. Hover pulls a row right and fills its rank.
 */
export default function MostPlayedChart({ tracks }: { tracks: Track[] }) {
  const ok = useMotionOk();
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" });
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.85", "end 0.55"] });
  const needle = useTransform(scrollYProgress, [0, 1], ok ? [0, 1] : [1, 1]);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  return (
    <div className="relative">
      <motion.span aria-hidden="true" style={{ scaleY: needle }} className="absolute left-0 top-0 h-full w-px origin-top bg-[hsl(var(--accent-gold)/0.7)]" />
      <ol ref={listRef} className="border-y border-border/40 pl-5 md:pl-8">
        {tracks.map((track, i) => {
          const isActive = currentTrack?.id === track.id;
          const playingThis = isActive && isPlaying;
          const duration = fmtDuration(track.duration);

          const handlePlay = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (isActive) togglePlay();
            else if (track.audio_url) playTrack(track, tracks, i);
          };

          return (
            <motion.li
              key={track.id}
              className="chart-row group border-b border-border/40 last:border-b-0"
              initial={ok ? { opacity: 0, x: -18 } : false}
              animate={!ok || inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, delay: ok ? i * 0.08 : 0, ease: EASE_OUT }}
            >
              <div className="flex items-center gap-4 py-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5 md:gap-6 md:py-5">
                <span
                  className={`chart-rank w-10 shrink-0 font-display text-3xl leading-none tabular-nums md:w-16 md:text-5xl ${ok && inView ? "is-lit" : ""} ${!ok && i === 0 ? "is-first" : ""}`}
                  style={ok ? { animationDelay: `${350 + i * 160}ms` } : undefined}
                >
                  {i + 1}
                </span>

                <button
                  type="button"
                  onClick={handlePlay}
                  className="relative h-14 w-14 shrink-0 overflow-hidden border border-border/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-16 md:w-16"
                  aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                >
                  <img src={coverThumb(track.cover_art_url)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span
                    className={
                      "absolute inset-0 grid place-items-center bg-background/55 transition-opacity [@media(hover:none)]:opacity-100 " +
                      (playingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100")
                    }
                  >
                    {playingThis ? <Pause className="h-5 w-5 text-foreground" /> : <Play className="ml-0.5 h-5 w-5 text-foreground" />}
                  </span>
                </button>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display truncate text-base leading-tight md:text-xl">
                    <Link to={`/track/${track.slug}`} className="transition-colors hover:text-primary">
                      {track.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 truncate font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">{credit(track)}</p>
                </div>

                {track.explicit && (
                  <span className="hidden shrink-0 rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline" title="Explicit">
                    E
                  </span>
                )}

                {duration && <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{duration}</span>}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

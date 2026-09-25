import type { MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlayerStore, type Track } from "@/stores/playerStore";

function fmt(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Most Played is chart data, so it reads as a chart rather than a fourth
 * identical card rail. Hover pulls the row right and fills the rank numeral.
 */
export default function MostPlayedChart({ tracks }: { tracks: Track[] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  return (
    <ol className="border-y border-border/40">
      {tracks.map((track, i) => {
        const isActive = currentTrack?.id === track.id;
        const playingThis = isActive && isPlaying;
        const cover = track.cover_art_url || "/placeholder.svg";

        const handlePlay = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (isActive) togglePlay();
          else if (track.audio_url) playTrack(track, tracks, i);
        };

        return (
          <li
            key={track.id}
            data-chart-row
            className="chart-row group border-b border-border/40 last:border-b-0"
          >
            <div className="flex items-center gap-4 md:gap-6 py-4 md:py-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5">
              <span className="chart-rank font-display text-3xl md:text-5xl w-10 md:w-16 shrink-0 tabular-nums leading-none">
                {i + 1}
              </span>

              <button
                type="button"
                onClick={handlePlay}
                className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 overflow-hidden border border-border/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                <img
                  src={cover}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className={
                    "absolute inset-0 grid place-items-center bg-background/55 transition-opacity " +
                    (playingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                  }
                >
                  {playingThis ? (
                    <Pause className="w-5 h-5 text-foreground" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5 text-foreground" />
                  )}
                </span>
              </button>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base md:text-xl leading-tight truncate">
                  <Link to={`/track/${track.slug}`} className="hover:text-primary transition-colors">
                    {track.title}
                  </Link>
                </h3>
                <p className="mt-1.5 font-mono text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground truncate">
                  {track.featured_artists
                    ? `${track.artist} ft. ${track.featured_artists}`
                    : track.artist}
                </p>
              </div>

              {track.explicit && (
                <span className="hidden sm:inline text-[10px] bg-muted text-muted-foreground px-1 py-0.5 rounded shrink-0">
                  E
                </span>
              )}

              <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                {fmt(track.duration)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
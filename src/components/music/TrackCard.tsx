import type { MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { Vinyl } from "./Vinyl";
import { coverImg, credit, fmtDuration } from "./catalog";

interface TrackCardProps {
  track: Track;
  queue: Track[];
  index: number;
  /** Optional small label beside the explicit tag (e.g. "NEW") */
  badge?: string;
  className?: string;
}

/** A sleeve with its record behind it. Hover (or focus) lifts the record out of the top of the sleeve. */
export default function TrackCard({ track, queue, index, badge, className = "" }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;
  const playingThis = isActive && isPlaying;
  const duration = fmtDuration(track.duration);

  const handlePlay = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) togglePlay();
    else if (track.audio_url) playTrack(track, queue, index);
  };

  return (
    <div className={`disco-card group block w-[260px] shrink-0 snap-start md:w-[300px] ${playingThis ? "is-playing" : ""} ${className}`}>
      <div className="art-wrap relative aspect-square">
        <Vinyl cover={track.cover_art_url} />
        <button
          type="button"
          onClick={handlePlay}
          className="art block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          <img {...coverImg(track.cover_art_url, "(min-width: 768px) 300px, 260px")} alt={`${track.title} cover art`} loading="lazy" decoding="async" />
          <span
            className={
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300 [@media(hover:none)]:opacity-100 " +
              (playingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100")
            }
          >
            <span className="candy-sheen flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-[0_10px_30px_hsl(0_0%_0%/0.45)]">
              {playingThis ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </span>
          </span>
        </button>
      </div>

      <h3 className="font-display mt-5 flex items-start gap-2 text-lg leading-tight text-foreground md:text-xl">
        <Link to={`/track/${track.slug}`} className="transition-colors hover:text-primary">
          {track.title}
        </Link>
        {badge && (
          <span className="mt-0.5 shrink-0 rounded border border-primary/30 bg-primary/15 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary">
            {badge}
          </span>
        )}
        {track.explicit && (
          <span className="mt-0.5 shrink-0 rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground" title="Explicit">
            E
          </span>
        )}
      </h3>
      <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
        {credit(track)}
        {duration && ` · ${duration}`}
      </p>
    </div>
  );
}

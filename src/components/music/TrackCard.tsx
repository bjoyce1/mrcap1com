import type { MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { Vinyl } from "./Vinyl";

interface TrackCardProps {
  track: Track;
  queue: Track[];
  index: number;
  /** Optional small label shown above the title (e.g. "NEW", chart rank) */
  badge?: string;
}

function fmt(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, queue, index, badge }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;
  const playingThis = isActive && isPlaying;
  const cover = track.cover_art_url || "/placeholder.svg";

  const handlePlay = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) togglePlay();
    else if (track.audio_url) playTrack(track, queue, index);
  };

  return (
    <div className="disco-card group block w-[260px] md:w-[320px] shrink-0 snap-start">
      <div className="relative">
        {track.release_year && (
          <div
            aria-hidden="true"
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-0 font-display text-outline pointer-events-none select-none text-[6rem] md:text-[8rem] leading-none"
          >
            {track.release_year}
          </div>
        )}

        <div className="art-wrap relative aspect-square">
          <Vinyl cover={cover} />
          <button
            type="button"
            onClick={handlePlay}
            className="art block w-full h-full text-left"
            aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            <img src={cover} alt={`${track.title} cover art`} loading="lazy" />
            <span
              className={
                "absolute inset-0 flex items-center justify-center transition-opacity " +
                (playingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100")
              }
            >
              <span className="candy-sheen flex items-center justify-center w-14 h-14 rounded-full text-primary-foreground shadow-lg">
                {playingThis ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded font-mono text-[0.6rem] uppercase tracking-[0.15em] bg-primary/15 text-primary border border-primary/30">
            {badge}
          </span>
        )}
        {track.explicit && (
          <span className="text-[10px] bg-muted text-muted-foreground px-1 py-0.5 rounded">E</span>
        )}
      </div>

      <h3 className="font-display mt-2 text-lg md:text-xl text-foreground leading-tight">
        <Link to={`/track/${track.slug}`} className="hover:text-primary transition-colors">
          {track.title}
        </Link>
      </h3>
      <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
        {(track.featured_artists ? `${track.artist} ft. ${track.featured_artists}` : track.artist)}
        {" · "}
        {fmt(track.duration)}
      </p>
    </div>
  );
}

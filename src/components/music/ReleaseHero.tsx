import { Play, Pause, Calendar, Disc3 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  artist: string;
  releaseType: string;
  releaseYear?: number | null;
  coverArtUrl?: string | null;
  featuredArtists?: string | null;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onShare: () => void;
  albumSlug?: string | null;
  albumTitle?: string | null;
  duration?: string;
  className?: string;
}

export default function ReleaseHero({
  title,
  artist,
  releaseType,
  releaseYear,
  coverArtUrl,
  featuredArtists,
  isActive,
  isPlaying,
  onPlay,
  onShare,
  albumSlug,
  albumTitle,
  duration,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 mb-10 ${className}`}>
      {/* Cover Art */}
      <div className="relative group w-64 md:w-80 flex-shrink-0">
        <img
          src={coverArtUrl || "/placeholder.svg"}
          alt={title}
          className="w-full aspect-square rounded-xl object-cover shadow-2xl border border-border/30"
        />
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg">
            {isActive && isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>
        </button>
      </div>

      {/* Release Info */}
      <div className="text-center md:text-left flex-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5 justify-center md:justify-start">
          <Disc3 className="w-3.5 h-3.5" />
          {releaseType}
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-foreground mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground mb-1">
          {artist}
          {featuredArtists && <span className="text-foreground"> ft. {featuredArtists}</span>}
        </p>
        {albumSlug && albumTitle && (
          <Link to={`/albums/${albumSlug}`} className="text-sm text-primary hover:underline">
            {albumTitle}
          </Link>
        )}
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 justify-center md:justify-start">
          {releaseYear && (
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {releaseYear}</span>
          )}
          {duration && <span>· {duration}</span>}
        </p>

        <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            {isActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive && isPlaying ? "Pause" : "Listen Now"}
          </button>
          <button
            onClick={onShare}
            className="flex items-center gap-2 border border-border/50 text-foreground px-5 py-3 rounded-full hover:bg-secondary transition-colors text-sm"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

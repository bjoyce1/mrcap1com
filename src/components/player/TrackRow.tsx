import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePlayerStore, Track } from "@/stores/playerStore";

interface TrackRowProps {
  track: Track;
  index: number;
  queue?: Track[];
  showAlbumArt?: boolean;
  showDuration?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const TrackRow = ({ track, index, queue, showAlbumArt = true, showDuration = true }: TrackRowProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;
  const trackQueue = queue || [track];
  const queueIndex = queue ? queue.findIndex(t => t.id === track.id) : 0;

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, trackQueue, queueIndex);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
        isActive ? "bg-primary/10" : "hover:bg-secondary/50"
      )}
      onClick={handlePlay}
    >
      {/* Track Number / Play Icon */}
      <div className="w-8 flex items-center justify-center">
        {isActive && isPlaying ? (
          <Pause className="w-4 h-4 text-primary" />
        ) : (
          <>
            <span className="group-hover:hidden text-sm text-muted-foreground tabular-nums">
              {track.track_number || index + 1}
            </span>
            <Play className="hidden group-hover:block w-4 h-4 text-primary" />
          </>
        )}
      </div>

      {/* Album Art */}
      {showAlbumArt && (
        <img
          src={track.cover_art_url || "/placeholder.svg"}
          alt={track.title}
          className="w-10 h-10 rounded object-cover"
        />
      )}

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", isActive ? "text-primary" : "text-foreground")}>
          {track.title}
          {track.explicit && <span className="ml-1.5 text-[10px] bg-muted text-muted-foreground px-1 py-0.5 rounded">E</span>}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist}
          {track.featured_artists && ` ft. ${track.featured_artists}`}
        </p>
      </div>

      {/* Duration */}
      {showDuration && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDuration(track.duration)}
        </span>
      )}

      {/* No audio indicator */}
      {!track.audio_url && (
        <span className="text-[10px] text-muted-foreground/60 italic">soon</span>
      )}
    </div>
  );
};

export default TrackRow;

import { Play, Pause, X, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/stores/playerStore";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const QueueDrawer = () => {
  const { queue, queueIndex, currentTrack, isPlaying, isQueueOpen, toggleQueue, playTrack, togglePlay } = usePlayerStore();

  if (!isQueueOpen || !currentTrack) return null;

  return (
    <div className="fixed bottom-[calc(5rem+1px)] right-0 w-full md:w-96 max-h-[60vh] z-[59] bg-card/98 backdrop-blur-xl border border-border/50 rounded-t-xl md:rounded-tl-xl overflow-hidden shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Up Next</h3>
          <span className="text-xs text-muted-foreground">({queue.length} tracks)</span>
        </div>
        <button onClick={toggleQueue} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Now Playing */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border/20">
        <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Now Playing</p>
        <div className="flex items-center gap-3">
          <img
            src={currentTrack.cover_art_url || "/placeholder.svg"}
            alt={currentTrack.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <button onClick={togglePlay} className="p-1.5 text-primary">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="overflow-y-auto max-h-[calc(60vh-8rem)]">
        {queue.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Queue is empty</p>
        ) : (
          queue.map((track, i) => {
            const isCurrent = i === queueIndex;
            const isPast = i < queueIndex;
            return (
              <div
                key={`${track.id}-${i}`}
                onClick={() => {
                  if (!isCurrent) playTrack(track, queue, i);
                  else togglePlay();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors",
                  isCurrent ? "bg-primary/10" : isPast ? "opacity-40" : "hover:bg-secondary/50"
                )}
              >
                <span className="w-6 text-center text-xs text-muted-foreground tabular-nums">
                  {isCurrent && isPlaying ? (
                    <Pause className="w-3 h-3 text-primary inline" />
                  ) : (
                    i + 1
                  )}
                </span>
                <img
                  src={track.cover_art_url || "/placeholder.svg"}
                  alt={track.title}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", isCurrent ? "text-primary font-medium" : "text-foreground")}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(track.duration)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QueueDrawer;

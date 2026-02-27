import { useState, useMemo } from "react";
import { Play, Pause, Lock, Heart, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerStore, Track } from "@/stores/playerStore";
import NFTGate from "./NFTGate";
import { toast } from "sonner";

interface TrackRowProps {
  track: Track;
  index: number;
  queue?: Track[];
  showAlbumArt?: boolean;
  showDuration?: boolean;
  expandedTrackId?: string | null;
  onToggleExpand?: (trackId: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Pre-generate deterministic waveform bar heights so they don't change on re-render */
function useWaveformBars(trackId: string, count = 50) {
  return useMemo(() => {
    const bars: number[] = [];
    let seed = 0;
    for (let i = 0; i < trackId.length; i++) seed += trackId.charCodeAt(i);
    for (let i = 0; i < count; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      bars.push(20 + (seed / 233280) * 80);
    }
    return bars;
  }, [trackId, count]);
}

const TrackRowInner = ({ track, index, queue, showAlbumArt = true, showDuration = true, expandedTrackId, onToggleExpand }: TrackRowProps) => {
  const { currentTrack, isPlaying, currentTime, duration, playTrack, togglePlay } = usePlayerStore();
  const [localExpanded, setLocalExpanded] = useState(false);
  const isActive = currentTrack?.id === track.id;
  const trackQueue = queue || [track];
  const queueIndex = queue ? queue.findIndex(t => t.id === track.id) : 0;
  const waveformBars = useWaveformBars(track.id);

  // Use parent-controlled state if provided, otherwise local state
  const expanded = expandedTrackId !== undefined ? expandedTrackId === track.id : localExpanded;

  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, trackQueue, queueIndex);
    }
  };

  const toggleAccordion = () => {
    if (onToggleExpand) {
      onToggleExpand(track.id);
    } else {
      setLocalExpanded(prev => !prev);
    }
  };

  const progressPercent = isActive && duration > 0 ? (currentTime / duration) * 100 : 0;
  const playedBarCount = Math.floor((progressPercent / 100) * waveformBars.length);

  return (
    <div
      className={cn(
        "group flex flex-col transition-colors cursor-pointer border-b border-border/10 last:border-b-0",
        expanded ? "bg-primary/5" : isActive ? "bg-primary/10" : "hover:bg-secondary/50"
      )}
    >
      {/* ── Main Row ── */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 transition-all duration-300"
        onClick={toggleAccordion}
      >
        {/* Track Number / Play Icon — Hover Reveal */}
        <div className="w-8 flex items-center justify-center relative">
          {isActive && isPlaying ? (
            <button onClick={handlePlay} className="text-primary transition-transform duration-200 hover:scale-110">
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <>
              <span className={cn(
                "transition-all duration-300 text-sm tabular-nums",
                "group-hover:opacity-0 group-hover:scale-75",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {track.track_number || index + 1}
              </span>
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center text-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:text-primary/80"
              >
                <Play className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Album Art */}
        {showAlbumArt && (
          <img
            src={track.cover_art_url || "/placeholder.svg"}
            alt={track.title}
            className={cn(
              "w-10 h-10 rounded object-cover transition-transform duration-500",
              isActive && isPlaying && "scale-105"
            )}
          />
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate transition-colors duration-200", isActive ? "text-primary" : "text-foreground group-hover:text-foreground")}>
            {track.title}
            {track.explicit && <span className="ml-1.5 text-[10px] bg-muted text-muted-foreground px-1 py-0.5 rounded">E</span>}
          </p>
          <p className="text-xs text-muted-foreground truncate transition-colors duration-200 group-hover:text-muted-foreground/80">
            {track.artist}
            {track.featured_artists && ` ft. ${track.featured_artists}`}
          </p>
        </div>

        {/* ── Hover Quick Actions (slide in) ── */}
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            aria-label="Like"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = `https://mrcap1.com/track/${track.slug}`;
              if (navigator.share) {
                navigator.share({ title: `${track.title} — ${track.artist}`, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url);
              }
              toast.success("Link copied!", { description: `${track.title} — share it everywhere.` });
            }}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
            aria-label="More"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Duration */}
        {showDuration && (
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
            {formatDuration(track.duration)}
          </span>
        )}

        {/* No audio indicator */}
        {!track.audio_url && (
          <span className="text-[10px] text-muted-foreground/60 italic">soon</span>
        )}
      </div>

      {/* ── Accordion Expanded Inline Player ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out px-3 bg-background/40",
          expanded ? "max-h-44 opacity-100 py-4 border-t border-border/10" : "max-h-0 opacity-0 py-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 md:pl-11 max-w-4xl">
          {/* Big Play Button with pulse */}
          <button
            onClick={handlePlay}
            className={cn(
              "h-11 w-11 shrink-0 rounded-full bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground",
              "hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200",
              isActive && isPlaying && "animate-[pulse-glow_2s_ease-in-out_infinite]"
            )}
          >
            {isActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Audio Waveform */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium tabular-nums">
              <span className={isActive ? "text-primary" : ""}>
                {isActive ? formatDuration(Math.floor(currentTime)) : "0:00"}
              </span>
              <span>{formatDuration(track.duration)}</span>
            </div>
            <div className="flex items-end h-8 gap-[2px] cursor-pointer group/wave">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-full transition-all duration-300",
                    i < playedBarCount ? "bg-primary" : "bg-muted-foreground/20",
                    isActive && isPlaying && i >= playedBarCount && "animate-pulse"
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Lyrics placeholder button */}
          <button className="hidden md:block px-4 py-1.5 rounded-full border border-border/30 hover:border-border/60 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            Lyrics
          </button>
        </div>
      </div>
    </div>
  );
};

const TrackRow = (props: TrackRowProps) => {
  if (props.track.requires_nft) {
    return (
      <NFTGate>
        <TrackRowInner {...props} />
      </NFTGate>
    );
  }
  return <TrackRowInner {...props} />;
};

export default TrackRow;

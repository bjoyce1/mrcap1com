import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, ChevronUp, ChevronDown, ListMusic, Share2 } from "lucide-react";
import { reportQualifiedStream } from "@/lib/streamTracking";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/stores/playerStore";
import { useAudioAnalyzerStore } from "@/stores/audioAnalyzerStore";
import { Slider } from "@/components/ui/slider";
import { trackEvent } from "@/components/GoogleAnalytics";
import QueueDrawer from "./QueueDrawer";
import { shareMusic } from "@/lib/shareTrack";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const StickyPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const qualifiedRef = useRef<Record<string, boolean>>({});
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isPlayerVisible,
    isMinimized,
    togglePlay,
    nextTrack,
    prevTrack,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsMinimized,
    closePlayer,
    isQueueOpen,
    toggleQueue,
  } = usePlayerStore();

  // Sync audio element with store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Clear previous audio when track has no audio_url
    if (!currentTrack.audio_url) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    
    audio.src = currentTrack.audio_url;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(() => {});
    }

    // GA4 event
    trackEvent("track_play", {
      track_id: currentTrack.id,
      album_id: currentTrack.album_id,
      page_path: window.location.pathname,
      source: "player",
    });
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      if (currentTrack) {
        trackEvent("track_pause", {
          track_id: currentTrack.id,
          page_path: window.location.pathname,
        });
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Wire audio analyzer — only once since the audio element never changes
  const { connect, startLoop, stopLoop } = useAudioAnalyzerStore();
  useEffect(() => {
    if (!audioRef.current) return;
    connect(audioRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      // Resume AudioContext if suspended (browser autoplay policy)
      const ctx = useAudioAnalyzerStore.getState()._ctx;
      if (ctx?.state === "suspended") ctx.resume();
      startLoop();
    } else {
      stopLoop();
    }
  }, [isPlaying, startLoop, stopLoop]);

  // Qualified stream: fire once per track when 30s reached
  useEffect(() => {
    if (!currentTrack) return;
    const key = currentTrack.id;
    if (!qualifiedRef.current[key] && currentTime >= 30) {
      qualifiedRef.current[key] = true;
      reportQualifiedStream({
        trackId: currentTrack.id,
        secondsListened: Math.floor(currentTime),
        pagePath: window.location.pathname,
      }).catch(() => {});
    }
  }, [currentTrack?.id, currentTime]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }, [setCurrentTime]);

  const syncedRef = useRef<Record<string, boolean>>({});

  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return;
    const realDuration = audioRef.current.duration;
    setDuration(realDuration);

    // If stored duration is 0, persist the real duration
    const track = usePlayerStore.getState().currentTrack;
    if (track && track.duration === 0 && realDuration > 0 && !syncedRef.current[track.id]) {
      syncedRef.current[track.id] = true;
      supabase.functions.invoke("sync-track-duration", {
        body: { trackId: track.id, duration: realDuration },
      }).catch(() => {});
    }
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    if (currentTrack) {
      trackEvent("track_complete", { track_id: currentTrack.id });
    }
    nextTrack();
  }, [currentTrack, nextTrack]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  if (!isPlayerVisible || !currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1;
  const hasPrev = queueIndex > 0;
  const noAudio = !currentTrack.audio_url;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      <div
        className={cn(
          "fixed left-0 right-0 z-[60] bg-card/95 backdrop-blur-xl border-t border-border/50 transition-all duration-300",
          "bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:bottom-0",
          isMinimized ? "h-16" : "h-auto"
        )}
      >
        {/* Progress bar - thin line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isMinimized ? (
          /* Minimized View */
          <div className="flex items-center h-16 px-4 gap-3">
            <img
              src={currentTrack.cover_art_url || "/placeholder.svg"}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={togglePlay} disabled={noAudio} className="p-2 text-foreground hover:text-primary transition-colors disabled:opacity-30">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMinimized(false)} className="p-2 text-muted-foreground hover:text-foreground">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={closePlayer} className="p-2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded View */
          <div className="px-4 py-3 md:px-6">
            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-64">
                <img
                  src={currentTrack.cover_art_url || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-lg"
                />
                <div className="min-w-0">
                  <Link
                    to={`/track/${currentTrack.slug}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {currentTrack.title}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.artist}
                    {currentTrack.featured_artists && ` ft. ${currentTrack.featured_artists}`}
                  </p>
                </div>
              </div>

              {/* Controls + Scrubber */}
              <div className="hidden md:flex flex-col items-center flex-1 gap-1">
                <div className="flex items-center gap-3">
                  <button onClick={prevTrack} disabled={!hasPrev} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={togglePlay}
                    disabled={noAudio}
                    className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-30"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button onClick={nextTrack} disabled={!hasNext} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-[10px] text-muted-foreground w-8 tabular-nums">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume + Queue + Share + Actions */}
              <div className="hidden md:flex items-center gap-2 w-56 justify-end">
                <button
                  onClick={() => shareMusic({ title: currentTrack.title, artist: currentTrack.artist, slug: currentTrack.slug })}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleQueue}
                  className={cn("p-1.5 transition-colors", isQueueOpen ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                  title="Queue"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(v) => setVolume(v[0] / 100)}
                  className="w-20"
                />
              </div>

              {/* Mobile play + minimize */}
              <div className="flex md:hidden items-center gap-1">
                <button onClick={togglePlay} disabled={noAudio} className="p-2 text-foreground disabled:opacity-30">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMinimized(true)} className="p-2 text-muted-foreground">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={closePlayer} className="p-2 text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile scrubber */}
            <div className="flex md:hidden items-center gap-2 mt-2">
              <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-[10px] text-muted-foreground w-8 tabular-nums">{formatTime(duration)}</span>
            </div>

            {noAudio && (
              <p className="text-xs text-muted-foreground text-center mt-1 italic">
                Audio coming soon — track preview only
              </p>
            )}
          </div>
        )}
      </div>
      <QueueDrawer />
    </>
  );
};

export default StickyPlayer;

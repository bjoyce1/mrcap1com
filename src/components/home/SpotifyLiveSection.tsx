import { useState, useRef, useEffect } from "react";
import { Play, Pause, ExternalLink, Music2 } from "lucide-react";
import { useSpotify, formatDuration, formatFollowers, type SpotifyTrack } from "@/hooks/useSpotify";

const SpotifyLiveSection = () => {
  const { data, isLoading, isError } = useSpotify();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePreview = (track: SpotifyTrack) => {
    if (!track.previewUrl) {
      // No preview available — open in Spotify instead
      if (track.spotifyUrl) window.open(track.spotifyUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Toggle off if same track
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    // Stop any current playback
    audioRef.current?.pause();

    const audio = new Audio(track.previewUrl);
    audio.volume = 0.7;
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  // Don't render the section if the integration errors out — fail gracefully
  if (isError) return null;

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music2 className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live from Spotify</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Most Played Tracks
            </h2>
          </div>

          {/* Follower count badge */}
          {data?.artist && (
            <a
              href={data.artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-primary/20 hover:border-primary/50 transition-colors group"
            >
              <div className="text-right">
                <div className="text-2xl font-bold text-primary leading-none">
                  {formatFollowers(data.artist.followers)}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                  Followers
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Track list */}
        {data?.topTracks && data.topTracks.length > 0 && (
          <div className="space-y-2">
            {data.topTracks.map((track, index) => {
              const isPlaying = playingId === track.id;
              return (
                <div
                  key={track.id}
                  className="group flex items-center gap-4 p-3 md:p-4 rounded-xl bg-card border border-transparent hover:border-primary/30 transition-all duration-300"
                >
                  {/* Rank number */}
                  <span className="w-6 text-center text-sm font-mono text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>

                  {/* Album art + play button overlay */}
                  <button
                    onClick={() => handlePreview(track)}
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 group/play"
                    aria-label={track.previewUrl ? `Preview ${track.name}` : `Open ${track.name} on Spotify`}
                  >
                    {track.albumImage ? (
                      <img
                        src={track.albumImage}
                        alt={track.album}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Music2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover/play:opacity-100"}`}>
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-primary" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 text-primary" fill="currentColor" />
                      )}
                    </div>
                  </button>

                  {/* Title + album */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{track.name}</p>
                      {track.explicit && (
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground flex-shrink-0">
                          E
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{track.album}</p>
                  </div>

                  {/* Popularity bar (desktop only) */}
                  <div className="hidden md:flex items-center gap-2 w-24">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent-gold))]"
                        style={{ width: `${track.popularity}%` }}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-sm text-muted-foreground tabular-nums w-12 text-right">
                    {formatDuration(track.durationMs)}
                  </span>

                  {/* Open in Spotify */}
                  {track.spotifyUrl && (
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                      aria-label="Open in Spotify"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {data?.artist && (
          <div className="mt-8 text-center">
            <a
              href={data.artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Music2 className="w-4 h-4" />
              Follow on Spotify
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpotifyLiveSection;

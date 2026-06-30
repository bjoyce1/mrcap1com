import { Link } from "react-router-dom";
import { Play, Pause, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAlbumTracks } from "@/hooks/useStreamingData";
import { usePlayerStore, type Album } from "@/stores/playerStore";

interface Props {
  album: Album | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function fmt(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AlbumDetailModal({ album, open, onOpenChange }: Props) {
  const { data: tracks, isLoading } = useAlbumTracks(album?.id);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  if (!album) return null;
  const cover = album.cover_art_url || "/placeholder.svg";
  const playable = (tracks || []).filter((t) => t.audio_url);

  // Album-level streaming links: derived from the first track that has one.
  const albumSpotify = tracks?.find((t) => t.spotify_url)?.spotify_url || null;
  const albumApple = tracks?.find((t) => t.apple_music_url)?.apple_music_url || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-[260px_1fr] gap-0">
          {/* Cover */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-secondary">
            <img
              src={cover}
              alt={`${album.title} cover art`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-7">
            <DialogHeader className="space-y-2 text-left">
              <span className="catalog-stamp">
                {album.release_year} · {album.track_count || tracks?.length || 0} Tracks
              </span>
              <DialogTitle className="font-display text-2xl md:text-3xl leading-tight">
                {album.title}
              </DialogTitle>
              <DialogDescription className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">
                {album.artist}
              </DialogDescription>
            </DialogHeader>

            {album.description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {album.description}
              </p>
            )}

            <div className="archive-rule mt-5 mb-4 w-24" />

            {/* Streaming links */}
            <div className="flex flex-wrap gap-2 mb-5">
              {albumSpotify && (
                <a
                  href={albumSpotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/40 font-mono text-[0.65rem] uppercase tracking-[0.15em] hover:bg-[#1DB954]/25 transition"
                >
                  Spotify <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {albumApple && (
                <a
                  href={albumApple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/10 text-foreground border border-foreground/30 font-mono text-[0.65rem] uppercase tracking-[0.15em] hover:bg-foreground/20 transition"
                >
                  Apple Music <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <Link
                to={`/album/${album.slug}`}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/40 font-mono text-[0.65rem] uppercase tracking-[0.15em] hover:bg-primary/25 transition"
              >
                Full Album Page
              </Link>
            </div>

            {/* Tracklist */}
            <div>
              <h3 className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Tracklist
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 bg-secondary rounded animate-pulse" />
                  ))}
                </div>
              ) : tracks && tracks.length > 0 ? (
                <ul className="divide-y divide-border/40">
                  {tracks.map((track, i) => {
                    const isActive = currentTrack?.id === track.id;
                    const playingThis = isActive && isPlaying;
                    const queueIndex = playable.findIndex((p) => p.id === track.id);
                    const canPlay = !!track.audio_url;
                    return (
                      <li
                        key={track.id}
                        className="flex items-center gap-3 py-2.5 group"
                      >
                        <button
                          type="button"
                          disabled={!canPlay}
                          onClick={() => {
                            if (!canPlay) return;
                            if (isActive) togglePlay();
                            else playTrack(track, playable, Math.max(0, queueIndex));
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                        >
                          {playingThis ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                        <span className="font-mono text-[0.7rem] text-muted-foreground w-6 text-right">
                          {track.track_number ?? i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/track/${track.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="block truncate font-display text-sm text-foreground hover:text-primary transition-colors"
                          >
                            {track.title}
                            {track.explicit && (
                              <span className="ml-2 text-[9px] bg-muted text-muted-foreground px-1 py-0.5 rounded align-middle">
                                E
                              </span>
                            )}
                          </Link>
                          {track.featured_artists && (
                            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground/80 truncate">
                              ft. {track.featured_artists}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {track.spotify_url && (
                            <a
                              href={track.spotify_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1DB954]/70 hover:text-[#1DB954] transition opacity-0 group-hover:opacity-100"
                              aria-label="Open on Spotify"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <span className="font-mono text-[0.7rem] text-muted-foreground tabular-nums">
                            {fmt(track.duration)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="font-mono text-xs text-muted-foreground">
                  Tracklist coming soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

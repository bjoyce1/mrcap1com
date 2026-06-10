import { Link } from "react-router-dom";
import { Play, Pause, ArrowRight } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/playerStore";

/**
 * Latest Releases — "the crate".
 *
 * The newest drop gets the full feature treatment: large artwork, NEW stamp,
 * inline play. The rest become a flip-through shelf of cover art, like digging
 * a record crate. The card that is currently playing shows live EQ bars.
 * Entirely driven by the tracks table: every future release slots in on its own.
 */

interface LatestReleasesShelfProps {
  tracks: Track[];
  loading?: boolean;
}

/** Three-bar equalizer badge shown on the playing card */
const EqBars = () => (
  <span className="lr-eq inline-flex items-end gap-[3px] h-4" aria-label="Now playing">
    <span className="lr-eq-bar" style={{ animationDelay: "0ms" }} />
    <span className="lr-eq-bar" style={{ animationDelay: "180ms" }} />
    <span className="lr-eq-bar" style={{ animationDelay: "360ms" }} />
  </span>
);

const LatestReleasesShelf = ({ tracks, loading }: LatestReleasesShelfProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-56 aspect-square rounded-xl bg-secondary animate-pulse" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-3 w-24 bg-secondary rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-secondary rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-40 sm:w-48 aspect-square rounded-xl bg-secondary animate-pulse flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) return null;

  const featured = tracks[0];
  const shelf = tracks.slice(1);
  const isFeaturedPlaying = currentTrack?.id === featured.id && isPlaying;

  const handlePlay = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks, index);
    }
  };

  return (
    <div className="space-y-8">
      {/* Scoped EQ animation */}
      <style>{`
        .lr-eq-bar {
          width: 3px;
          background: hsl(var(--accent-gold));
          border-radius: 1px;
          height: 30%;
          animation: lr-eq-bounce 900ms ease-in-out infinite;
        }
        @keyframes lr-eq-bounce {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lr-eq-bar { animation: none; height: 60%; }
        }
        .lr-shelf {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--accent-gold) / 0.3) transparent;
        }
      `}</style>

      {/* ── Featured: the newest drop ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 bg-card/40 border border-border/30 rounded-2xl p-5 sm:p-6">
        <div className="relative w-full sm:w-56 flex-shrink-0">
          <button
            onClick={() => handlePlay(featured, 0)}
            className="group relative block w-full aspect-square rounded-xl overflow-hidden border border-border/40"
            style={isFeaturedPlaying ? { boxShadow: "var(--shadow-candy)" } : undefined}
            aria-label={isFeaturedPlaying ? `Pause ${featured.title}` : `Play ${featured.title}`}
          >
            <img
              src={featured.cover_art_url || "/placeholder.svg"}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              className={
                "absolute inset-0 flex items-center justify-center bg-background/50 transition-opacity " +
                (isFeaturedPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100")
              }
            >
              <span className="candy-sheen flex items-center justify-center w-14 h-14 rounded-full text-primary-foreground shadow-lg">
                {isFeaturedPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </span>
            </div>
          </button>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded font-mono text-[0.65rem] uppercase tracking-[0.15em] bg-primary/15 text-primary border border-primary/30">
              New
            </span>
            {featured.release_year && <span className="catalog-stamp">{featured.release_year}</span>}
            {isFeaturedPlaying && <EqBars />}
          </div>
          <h3 className="text-2xl sm:text-4xl font-display text-foreground leading-tight truncate">
            {featured.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            {featured.featured_artists ? `${featured.artist} ft. ${featured.featured_artists}` : featured.artist}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handlePlay(featured, 0)}
              className="candy-sheen flex items-center gap-2 text-primary-foreground px-5 py-2.5 rounded-full font-medium shadow-lg"
            >
              {isFeaturedPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isFeaturedPlaying ? "Pause" : "Play"}
            </button>
            <Link
              to={`/music/${featured.slug}`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[hsl(var(--accent-gold)/0.4)] text-foreground hover:border-[hsl(var(--accent-gold))] transition-colors text-sm font-medium"
            >
              Track Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── The crate: flip through the rest ── */}
      {shelf.length > 0 && (
        <div className="lr-shelf flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
          {shelf.map((track, i) => {
            const index = i + 1; // position within the full latest queue
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <button
                key={track.id}
                onClick={() => handlePlay(track, index)}
                className="group relative w-40 sm:w-48 flex-shrink-0 snap-start text-left"
                aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                <div
                  className={
                    "relative aspect-square rounded-xl overflow-hidden border transition-colors " +
                    (isThisPlaying ? "border-primary/60" : "border-border/30 group-hover:border-[hsl(var(--accent-gold)/0.5)]")
                  }
                  style={isThisPlaying ? { boxShadow: "var(--shadow-candy)" } : undefined}
                >
                  <img
                    src={track.cover_art_url || "/placeholder.svg"}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  {/* Hover / playing control */}
                  <div
                    className={
                      "absolute inset-0 flex items-center justify-center transition-opacity " +
                      (isThisPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                    }
                  >
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                      {isThisPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </span>
                  </div>

                  {/* Card footer */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                        <p className="text-[0.65rem] font-mono uppercase tracking-widest text-[hsl(var(--accent-gold))] mt-0.5">
                          {track.release_year ?? ""}
                        </p>
                      </div>
                      {isThisPlaying && <EqBars />}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LatestReleasesShelf;

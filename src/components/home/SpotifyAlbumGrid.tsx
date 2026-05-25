import { Disc3, Play, ExternalLink } from "lucide-react";
import { useSpotify, type SpotifyAlbum } from "@/hooks/useSpotify";

/** Format a Spotify release date (YYYY or YYYY-MM-DD) into just the year */
function releaseYear(date: string): string {
  return date?.slice(0, 4) || "";
}

const SpotifyAlbumGrid = () => {
  const { data, isLoading, isError } = useSpotify();

  // Fail gracefully — if Spotify errors, render nothing
  if (isError) return null;

  const albums = data?.albums ?? [];

  // Separate full albums from singles/EPs for clearer presentation
  const fullAlbums = albums.filter((a) => a.type === "album");
  const singles = albums.filter((a) => a.type !== "album");

  const renderCard = (album: SpotifyAlbum) => (
    <a
      key={album.id}
      href={album.spotifyUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border/30 hover:border-primary/40 transition-all hover:shadow-glow"
    >
      {album.image ? (
        <img
          src={album.image}
          alt={album.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <Disc3 className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Album info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-sm font-medium text-foreground truncate">{album.name}</p>
        <p className="text-xs text-muted-foreground">
          {releaseYear(album.releaseDate)}
          {album.totalTracks > 0 && ` · ${album.totalTracks} track${album.totalTracks > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Play overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg shadow-primary/40">
          <Play className="w-6 h-6" fill="currentColor" />
        </div>
      </div>
    </a>
  );

  return (
    <section className="space-y-8">
      {/* Full Albums */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-foreground flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-primary" /> Albums on Spotify
          </h2>
          {data?.artist?.spotifyUrl && (
            <a
              href={data.artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              View all <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square bg-secondary rounded-xl animate-pulse" />
              ))
            : fullAlbums.length > 0
            ? fullAlbums.map(renderCard)
            : albums.map(renderCard) /* fallback: show everything if type filtering yields nothing */}
        </div>
      </div>

      {/* Singles & EPs */}
      {!isLoading && singles.length > 0 && (
        <div>
          <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-[hsl(var(--accent-gold))]" /> Singles &amp; EPs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {singles.map(renderCard)}
          </div>
        </div>
      )}
    </section>
  );
};

export default SpotifyAlbumGrid;

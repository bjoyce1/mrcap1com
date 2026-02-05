import { Link } from "react-router-dom";
import { Play, Disc3, Music } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackRow from "@/components/player/TrackRow";
import { useAlbums, useLatestTracks, useAllTracks } from "@/hooks/useStreamingData";
import { usePlayerStore, Track } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
import { useEffect } from "react";

const Listen = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: latestTracks, isLoading: tracksLoading } = useLatestTracks(8);
  const { data: allTracks } = useAllTracks();
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/listen", source: "listen" });
  }, []);

  const singles = allTracks?.filter(t => !t.album_id) || [];

  const handlePlayAll = () => {
    if (allTracks && allTracks.length > 0) {
      const playable = allTracks.filter(t => t.audio_url);
      if (playable.length > 0) {
        playTrack(playable[0], playable, 0);
        trackEvent("album_play", { page_path: "/listen", source: "listen" });
      }
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Mr. CAP — Stream Music",
    description: "Stream Mr. CAP's music directly. Houston hip hop, Southern rap, and underground classics.",
    url: "https://mrcap1.com/listen",
    numTracks: allTracks?.length || 0,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Stream Mr. CAP Music | Listen Free | Houston Hip Hop"
        description="Stream Mr. CAP's full catalog. Houston hip hop, Southern rap, and underground classics — direct from the artist."
        canonical="https://mrcap1.com/listen"
        jsonLd={jsonLd}
      />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-orange-glow opacity-30 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-display text-foreground mb-3">
                <span className="text-gradient-orange">Listen</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Stream Mr. CAP's full catalog. Houston hip hop straight from the source.
              </p>
            </div>
            <button
              onClick={handlePlayAll}
              className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              <Play className="w-5 h-5" /> Play All
            </button>
          </div>

          {/* Latest Releases */}
          <div className="mb-12">
            <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" /> Latest Releases
            </h2>
            <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden">
              {tracksLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading tracks...</div>
              ) : (
                latestTracks?.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={latestTracks} />
                ))
              )}
            </div>
          </div>

          {/* Albums */}
          <div className="mb-12">
            <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-primary" /> Albums
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {albumsLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-secondary rounded-xl animate-pulse" />
                  ))
                : albums?.map((album) => (
                    <Link
                      key={album.id}
                      to={`/album/${album.slug}`}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border/30 hover:border-primary/40 transition-all"
                    >
                      <img
                        src={album.cover_art_url || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-medium text-white truncate">{album.title}</p>
                        <p className="text-xs text-white/70">{album.release_year} · {album.artist}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                          <Play className="w-6 h-6" />
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>

          {/* Singles */}
          {singles.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-foreground mb-4">Singles & Features</h2>
              <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden">
                {singles.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={singles} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Listen;

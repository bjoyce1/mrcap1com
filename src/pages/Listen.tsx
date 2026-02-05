import { Link } from "react-router-dom";
import { Play, Disc3, Music, Headphones, Share2 } from "lucide-react";
import { useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackRow from "@/components/player/TrackRow";
import { useAlbums, useLatestTracks, useAllTracks } from "@/hooks/useStreamingData";
import { usePlayerStore } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const Listen = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: latestTracks, isLoading: tracksLoading } = useLatestTracks(8);
  const { data: allTracks } = useAllTracks();
  const { playTrack } = usePlayerStore();

  const heroRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const albumsRef = useRef<HTMLDivElement>(null);
  const singlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/listen", source: "listen" });
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(heroRef.current, {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      });

      // Sections reveal on scroll
      [latestRef, albumsRef, singlesRef].forEach((ref) => {
        if (ref.current) {
          gsap.from(ref.current, {
            y: 40, opacity: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
          });
        }
      });
    });
    return () => ctx.revert();
  }, [latestTracks, albums, allTracks]);

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
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-orange-glow opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative" ref={heroRef}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-widest text-primary font-medium">CAP STREAM</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display text-foreground mb-3 leading-tight">
                <span className="text-gradient-orange">Listen</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Stream Mr. CAP's full catalog — Houston hip hop straight from the source. No middleman.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
              >
                <Play className="w-5 h-5" /> Play All
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
            <span>{allTracks?.length || 0} tracks</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{albums?.length || 0} albums</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{singles.length} singles</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-32 space-y-14">
        {/* Latest Releases */}
        <div ref={latestRef}>
          <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" /> Latest Releases
          </h2>
          <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden divide-y divide-border/10">
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
        <div ref={albumsRef}>
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
                    className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border/30 hover:border-primary/40 transition-all hover:shadow-glow"
                  >
                    <img
                      src={album.cover_art_url || "/placeholder.svg"}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-medium text-foreground truncate">{album.title}</p>
                      <p className="text-xs text-muted-foreground">{album.release_year} · {album.artist}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg shadow-primary/40">
                        <Play className="w-6 h-6" />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* Singles */}
        {singles.length > 0 && (
          <div ref={singlesRef}>
            <h2 className="text-xl font-display text-foreground mb-4">Singles & Features</h2>
            <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden divide-y divide-border/10">
              {singles.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={singles} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Listen;

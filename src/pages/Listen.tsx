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
        {/* Start Here - Curated Picks */}
        <div>
          <h2 className="text-xl font-display text-foreground mb-2 flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" /> Start Here
          </h2>
          <p className="text-sm text-muted-foreground mb-4">New to CAP? These 5 tracks tell the story.</p>
          <div className="bg-card/50 rounded-xl border border-primary/20 overflow-hidden divide-y divide-border/10">
            {tracksLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading tracks...</div>
            ) : (
              latestTracks?.slice(0, 5).map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={latestTracks?.slice(0, 5) || []} />
              ))
            )}
          </div>
        </div>

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

        {/* Spotify Artist Embed */}
        <div className="mt-4">
          <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Support on Spotify
          </h2>
          <div className="bg-card/50 rounded-xl border border-border/30 p-4">
            <iframe
              style={{ borderRadius: 12 }}
              src="https://open.spotify.com/embed/artist/69pjfQNXA1xjusnI2wfgug?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listen;

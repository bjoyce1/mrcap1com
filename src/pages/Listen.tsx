import { Link } from "react-router-dom";
import { Play, Disc3, Music, TrendingUp } from "lucide-react";
import ShareButtons from "@/components/music/ShareButtons";
import { useRef, useEffect, useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackRow from "@/components/player/TrackRow";
import { useAlbums, useLatestTracks, useAllTracks, useMostPlayedTracks } from "@/hooks/useStreamingData";
import SpotifyAlbumGrid from "@/components/home/SpotifyAlbumGrid";
import ListeningRoomHero from "@/components/music/ListeningRoomHero";
import EraFilter, { getEras, filterByEra } from "@/components/music/EraFilter";
import LatestReleasesShelf from "@/components/music/LatestReleasesShelf";
import { usePlayerStore } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const Listen = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: latestTracks, isLoading: tracksLoading } = useLatestTracks(8);
  const { data: allTracks } = useAllTracks();
  const { data: mostPlayed } = useMostPlayedTracks(5);
  const { playTrack } = usePlayerStore();
  const [activeEra, setActiveEra] = useState<string | null>(null);

  const latestRef = useRef<HTMLDivElement>(null);
  const albumsRef = useRef<HTMLDivElement>(null);
  const singlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/music", source: "music" });
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
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
  const eras = useMemo(() => getEras(singles), [singles]);
  const filteredSingles = useMemo(() => filterByEra(singles, activeEra), [singles, activeEra]);
  const allPlayable = useMemo(() => (allTracks || []).filter(t => t.audio_url), [allTracks]);
  const latestPlayable = useMemo(() => (latestTracks || []).filter(t => t.audio_url), [latestTracks]);


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Mr. CAP — Stream Music",
    description: "Stream Mr. CAP's music directly. Houston hip hop, Southern rap, and underground classics.",
    url: "https://mrcap1.com/music",
    numTracks: allTracks?.length || 0,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Stream Mr. CAP Music | Listen Free | Houston Hip Hop"
        description="Stream Mr. CAP's full catalog. Houston hip hop, Southern rap, and underground classics — direct from the artist."
        canonical="https://mrcap1.com/music"
        jsonLd={jsonLd}
      />
      <Navigation />

      <ListeningRoomHero
        trackCount={allTracks?.length || 0}
        albumCount={albums?.length || 0}
        allPlayable={allPlayable}
        latestPlayable={latestPlayable}
      />

      <div className="max-w-6xl mx-auto px-6 pb-32 space-y-14">
        {/* Most Played - real data from direct streams */}
        {mostPlayed && mostPlayed.length > 0 && (
          <div>
            <span className="catalog-stamp mb-3 block">House Charts</span>
            <h2 className="text-xl font-display text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Most Played
            </h2>
            <div className="archive-rule mt-4 mb-4 w-24" />
            <p className="text-sm text-muted-foreground mb-4">What listeners are streaming right here on the site.</p>
            <div className="bg-card/50 rounded-xl border border-primary/20 overflow-hidden divide-y divide-border/10">
              {mostPlayed.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={mostPlayed} />
              ))}
            </div>
          </div>
        )}

        {/* Latest Releases */}
        <div ref={latestRef}>
          <span className="catalog-stamp mb-3 block">Latest Drops</span>
          <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" /> Latest Releases
          </h2>
          <div className="archive-rule mt-4 mb-4 w-24" />
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
          <span className="catalog-stamp mb-3 block">Full Lengths</span>
          <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-primary" /> Albums
          </h2>
          <div className="archive-rule mt-4 mb-4 w-24" />
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
                       <div className="flex items-center justify-between">
                         <div className="min-w-0">
                           <p className="text-sm font-medium text-foreground truncate">{album.title}</p>
                           <p className="text-xs text-muted-foreground font-mono">{album.release_year} · {album.artist}</p>
                         </div>
                         <ShareButtons title={album.title} artist={album.artist} slug={album.slug} type="album" compact />
                       </div>
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
            <span className="catalog-stamp mb-3 block">Standalone Tracks</span>
            <h2 className="text-xl font-display text-foreground mb-4">Singles & Features</h2>
            <div className="archive-rule mt-4 mb-4 w-24" />
            <EraFilter eras={eras} active={activeEra} onChange={setActiveEra} />
            <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden divide-y divide-border/10">
              {filteredSingles.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={filteredSingles} />
              ))}
              {filteredSingles.length === 0 && (
                <div className="p-8 text-center text-muted-foreground font-mono text-sm">No tracks from this era yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Live Spotify Catalog (auto-updating) */}
        <div className="mt-4">
          <SpotifyAlbumGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listen;

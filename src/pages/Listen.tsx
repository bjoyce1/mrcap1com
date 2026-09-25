import { Disc3, Music, TrendingUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAlbums, useLatestTracks, useAllTracks, useMostPlayedTracks } from "@/hooks/useStreamingData";
import ListeningRoomHero from "@/components/music/ListeningRoomHero";
import EraFilter, { getEras, filterByEra } from "@/components/music/EraFilter";
import HorizontalShelf from "@/components/music/HorizontalShelf";
import TrackCard from "@/components/music/TrackCard";
import MostPlayedChart from "@/components/music/MostPlayedChart";
import AlbumDetailModal from "@/components/music/AlbumDetailModal";
import { Vinyl } from "@/components/music/Vinyl";
import { trackEvent } from "@/components/GoogleAnalytics";
import type { Album } from "@/stores/playerStore";

const Listen = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: latestTracks } = useLatestTracks(8);
  const { data: allTracks } = useAllTracks();
  const { data: mostPlayed } = useMostPlayedTracks(5);
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [modalAlbum, setModalAlbum] = useState<Album | null>(null);

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/music", source: "music" });
  }, []);

  const singles = useMemo(() => allTracks?.filter((t) => !t.album_id) || [], [allTracks]);
  const eras = useMemo(() => getEras(singles), [singles]);
  const filteredSingles = useMemo(() => filterByEra(singles, activeEra), [singles, activeEra]);
  const allPlayable = useMemo(() => (allTracks || []).filter((t) => t.audio_url), [allTracks]);
  const latestPlayable = useMemo(() => (latestTracks || []).filter((t) => t.audio_url), [latestTracks]);

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

      <div className="pb-24">
        {/* Most Played — chart data, so it reads as a chart, not a fourth rail */}
        {mostPlayed && mostPlayed.length > 0 && (
          <HorizontalShelf
            layout="block"
            eyebrow="House Charts"
            title="Most Played"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            description="What listeners are streaming right here on the site."
            refreshKey={mostPlayed.length}
          >
            <MostPlayedChart tracks={mostPlayed} />
          </HorizontalShelf>
        )}

        {/* Latest Releases */}
        {latestTracks && latestTracks.length > 0 && (
          <HorizontalShelf
            eyebrow="Latest Drops"
            title="Latest Releases"
            icon={<Music className="w-5 h-5 text-primary" />}
            description="The newest cuts, freshly pressed."
            refreshKey={latestTracks.length}
          >
            {latestTracks.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                queue={latestTracks}
                index={i}
                badge={i === 0 ? "NEW" : undefined}
              />
            ))}
          </HorizontalShelf>
        )}

        {/* Albums — the feature shelf, where the disc-pull hover gets room */}
        <HorizontalShelf
          variant="feature"
          layout="grid"
          eyebrow="Full Lengths"
          title="Albums"
          icon={<Disc3 className="w-5 h-5 text-primary" />}
          description="Full-length records. Hover a sleeve to pull the disc."
          refreshKey={albums?.length || 0}
        >
          {albumsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full aspect-square bg-secondary rounded-xl animate-pulse" />
              ))
            : (albums || []).map((album) => {
                const cover = album.cover_art_url || "/placeholder.svg";
                return (
                  <button
                    type="button"
                    key={album.id}
                    onClick={() => setModalAlbum(album)}
                    className="disco-card group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  >
                    <div className="relative">
                      {album.release_year && (
                        <div
                          data-parallax-year
                          aria-hidden="true"
                          className="absolute -top-6 left-1/2 -translate-x-1/2 z-0 font-display text-outline pointer-events-none select-none text-[6rem] md:text-[8rem] leading-none"
                        >
                          {album.release_year}
                        </div>
                      )}
                      <div className="art-wrap relative aspect-square">
                        <Vinyl cover={cover} />
                        <div className="art">
                          <img src={cover} alt={`${album.title} cover art`} loading="lazy" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-display mt-6 text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">{album.title}</h3>
                    <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                      {album.release_year} · {album.track_count || 0} Tracks · {album.artist}
                    </p>
                  </button>
                );
              })}
        </HorizontalShelf>

        {/* Singles & Features */}
        {singles.length > 0 && (
          <HorizontalShelf
            eyebrow="Standalone Tracks"
            title="Singles & Features"
            description="Loosies, guest spots, one-off chapters."
            toolbar={<EraFilter eras={eras} active={activeEra} onChange={setActiveEra} />}
            refreshKey={`${activeEra ?? "all"}-${filteredSingles.length}`}
          >
            {filteredSingles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-mono text-sm w-[260px]">
                No tracks from this era yet.
              </div>
            ) : (
              filteredSingles.map((track, i) => (
                <TrackCard key={track.id} track={track} queue={filteredSingles} index={i} />
              ))
            )}
          </HorizontalShelf>
        )}
      </div>

      <AlbumDetailModal
        album={modalAlbum}
        open={!!modalAlbum}
        onOpenChange={(o) => !o && setModalAlbum(null)}
      />

      <Footer />
    </div>
  );
};

export default Listen;
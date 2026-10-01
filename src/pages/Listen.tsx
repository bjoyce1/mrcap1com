import { TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAlbums, useAllTracks, useMostPlayedTracks } from "@/hooks/useStreamingData";
import ListeningRoomHero from "@/components/music/ListeningRoomHero";
import OutNowStage from "@/components/music/OutNowStage";
import MostPlayedChart from "@/components/music/MostPlayedChart";
import AlbumCrate from "@/components/music/AlbumCrate";
import EraWall from "@/components/music/EraWall";
import AlbumDetailModal from "@/components/music/AlbumDetailModal";
import { ShelfHeader } from "@/components/music/ShelfParts";
import { WRAP } from "@/components/music/catalog";
import { trackEvent } from "@/components/GoogleAnalytics";
import type { Album } from "@/stores/playerStore";

/** How many of the newest releases get the Out Now booth. */
const OUT_NOW = 4;

/**
 * /music — the listening room, then the newest releases in their booth, the
 * house chart, the album crate, and every single on the era wall.
 */
const Listen = () => {
  const { data: albums } = useAlbums();
  const { data: allTracks } = useAllTracks();
  const { data: mostPlayed } = useMostPlayedTracks(5);
  const [modalAlbum, setModalAlbum] = useState<Album | null>(null);

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/music", source: "music" });
  }, []);

  // allTracks arrives newest first (release year, then upload date)
  const latest = useMemo(() => (allTracks || []).slice(0, 8), [allTracks]);
  const outNow = useMemo(() => latest.slice(0, OUT_NOW), [latest]);
  // the era wall is the archive: the releases already in the booth aren't repeated there
  const singles = useMemo(() => {
    const inBooth = new Set(outNow.map((t) => t.id));
    return (allTracks || []).filter((t) => !t.album_id && !inBooth.has(t.id));
  }, [allTracks, outNow]);
  const allPlayable = useMemo(() => (allTracks || []).filter((t) => t.audio_url), [allTracks]);
  const latestPlayable = useMemo(() => latest.filter((t) => t.audio_url), [latest]);

  // the scroll stages measure the page, so they mount together once the catalog is in
  const ready = !!allTracks && !!albums;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Mr. CAP — Stream Music",
    description: "Stream Mr. CAP's music directly. Houston hip hop, Southern rap, and underground classics.",
    url: "https://mrcap1.com/music",
    numTracks: allTracks?.length || 0,
    track: (allTracks || []).map((t) => ({
      "@type": "MusicRecording",
      name: t.title,
      url: `https://mrcap1.com/track/${t.slug}`,
      byArtist: { "@type": "MusicGroup", name: t.artist },
      ...(t.duration ? { duration: `PT${Math.floor(t.duration / 60)}M${Math.floor(t.duration % 60)}S` } : {}),
      ...(t.release_year ? { datePublished: String(t.release_year) } : {}),
    })),
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

      <main id="main">
        <ListeningRoomHero
          trackCount={allTracks?.length || 0}
          albumCount={albums?.length || 0}
          allPlayable={allPlayable}
          latestPlayable={latestPlayable}
        />

        {ready ? (
          <>
            <OutNowStage releases={outNow} />

            {mostPlayed && mostPlayed.length > 0 && (
              <section aria-labelledby="chart-title" className="catalog-section relative overflow-x-clip py-20 md:py-28">
                <div className={WRAP}>
                  <ShelfHeader
                    id="chart-title"
                    title="Most Played"
                    icon={<TrendingUp className="h-6 w-6 shrink-0 text-primary md:h-8 md:w-8" />}
                    description="What listeners are streaming right here on the site."
                  />
                  <div className="mt-10">
                    <MostPlayedChart tracks={mostPlayed} />
                  </div>
                </div>
              </section>
            )}

            <AlbumCrate albums={albums} onOpen={setModalAlbum} />

            <EraWall singles={singles} />
          </>
        ) : (
          <div className={`${WRAP} grid min-h-[70svh] grid-cols-2 content-start gap-6 py-24 md:grid-cols-4`} aria-busy="true" aria-label="Loading the catalog">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-secondary" />
            ))}
          </div>
        )}
        <div className="h-24" />
      </main>

      <AlbumDetailModal album={modalAlbum} open={!!modalAlbum} onOpenChange={(o) => !o && setModalAlbum(null)} />

      <Footer />
    </div>
  );
};

export default Listen;

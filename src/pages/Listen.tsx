import { Link } from "react-router-dom";
import { Disc3, Music, TrendingUp, Archive, CalendarDays } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAlbums, useLatestTracks, useAllTracks, useMostPlayedTracks } from "@/hooks/useStreamingData";
import Catalog from "@/components/music/Catalog";
import ListeningRoomHero from "@/components/music/ListeningRoomHero";
import EraFilter, { getEras, filterByEra } from "@/components/music/EraFilter";
import HorizontalShelf from "@/components/music/HorizontalShelf";
import TrackCard from "@/components/music/TrackCard";
import ArchiveAlbumCard from "@/components/music/ArchiveAlbumCard";
import ArchiveSinglesYearCard from "@/components/music/ArchiveSinglesYearCard";
import AlbumDetailModal from "@/components/music/AlbumDetailModal";
import { archiveAlbums, archiveSingles } from "@/content/discography";
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

      <div className="pb-20">
        {/* Most Played */}
        {mostPlayed && mostPlayed.length > 0 && (
          <HorizontalShelf
            eyebrow="House Charts"
            title={<><TrendingUp className="w-5 h-5 text-primary" /> Most Played</>}
            description="What listeners are streaming right here on the site."
            refreshKey={mostPlayed.length}
          >
            {mostPlayed.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                queue={mostPlayed}
                index={i}
                badge={`#${i + 1}`}
              />
            ))}
          </HorizontalShelf>
        )}

        {/* Latest Releases */}
        {latestTracks && latestTracks.length > 0 && (
          <HorizontalShelf
            eyebrow="Latest Drops"
            title={<><Music className="w-5 h-5 text-primary" /> Latest Releases</>}
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

        {/* Albums */}
        <HorizontalShelf
          eyebrow="Full Lengths"
          title={<><Disc3 className="w-5 h-5 text-primary" /> Albums</>}
          description="Full-length records, scroll the wall."
          refreshKey={albums?.length || 0}
        >
          {albumsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[260px] md:w-[320px] aspect-square bg-secondary rounded-xl animate-pulse shrink-0" />
              ))
            : (albums || []).map((album) => {
                const cover = album.cover_art_url || "/placeholder.svg";
                return (
                  <button
                    type="button"
                    key={album.id}
                    onClick={() => setModalAlbum(album)}
                    className="disco-card group block w-[260px] md:w-[320px] shrink-0 snap-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  >
                    <div className="relative">
                      {album.release_year && (
                        <div
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
                    <h3 className="font-display mt-5 text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">{album.title}</h3>
                    <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                      {album.release_year} · {album.track_count || 0} Tracks · {album.artist}
                    </p>
                  </button>
                );
              })}
        </HorizontalShelf>

        {/* Singles */}
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

        {/* Catalog Archive — every studio & collab record */}
        <HorizontalShelf
          eyebrow="02 — Full Catalog"
          title={<><Archive className="w-5 h-5 text-primary" /> Every Album. Every Era.</>}
          description="Twenty plus years on wax — studio LPs, collab records, and mixtapes."
          refreshKey={archiveAlbums.length}
        >
          {archiveAlbums.map((album) => (
            <ArchiveAlbumCard
              key={`archive-${album.title}`}
              album={album}
              onClick={() => {
                const slug = album.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                window.location.href = `/album/${slug}`;
              }}
            />
          ))}
        </HorizontalShelf>

        {/* Singles Timeline — a decade of drops */}
        <HorizontalShelf
          eyebrow="03 — Singles & Features"
          title={<><CalendarDays className="w-5 h-5 text-primary" /> A Decade of Drops</>}
          description="Loosies, guest spots, and on-chain releases — year by year."
          refreshKey={archiveSingles.length}
        >
          {archiveSingles.map((yearGroup) => (
            <ArchiveSinglesYearCard
              key={`year-${yearGroup.year}`}
              year={yearGroup.year}
              tracks={yearGroup.tracks}
            />
          ))}
        </HorizontalShelf>
      </div>

      {/* The Catalog — scroll-pinned discography (reference section) */}
      <Catalog />

      <Footer />
    </div>
  );
};

export default Listen;

import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackRow from "@/components/player/TrackRow";
import StoryBlock from "@/components/player/StoryBlock";
import ReleaseHero from "@/components/music/ReleaseHero";
import ReleaseFactsGrid from "@/components/music/ReleaseFactsGrid";
import DSPLinks from "@/components/music/DSPLinks";
import ShareButtons from "@/components/music/ShareButtons";
import ReleaseLinks from "@/components/music/ReleaseLinks";
import RelatedReleases from "@/components/music/RelatedReleases";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import { useAlbumBySlug, useAlbumTracks } from "@/hooks/useStreamingData";
import { usePlayerStore } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
import { shareMusic } from "@/lib/shareTrack";
import artOfIsmBg from "@/assets/art-of-ism-bg.jpg";

function formatTotalDuration(tracks: { duration: number }[]): string {
  const total = tracks.reduce((s, t) => s + t.duration, 0);
  const mins = Math.floor(total / 60);
  return `${mins} min`;
}

const AlbumPage = () => {
  const { albumSlug } = useParams<{ albumSlug: string }>();
  const { data: album, isLoading: albumLoading } = useAlbumBySlug(albumSlug || "");
  const { data: tracks, isLoading: tracksLoading } = useAlbumTracks(album?.id);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  const handleToggleExpand = useCallback((trackId: string) => {
    setExpandedTrackId(prev => prev === trackId ? null : trackId);
  }, []);

  const isActive = tracks?.some(t => t.id === currentTrack?.id) || false;

  const handlePlayAll = () => {
    if (isActive) {
      togglePlay();
      return;
    }
    if (tracks && tracks.length > 0) {
      const playable = tracks.filter(t => t.audio_url);
      if (playable.length > 0) {
        playTrack(playable[0], playable, 0);
        trackEvent("album_play", { album_id: album?.id, page_path: `/albums/${albumSlug}`, source: "album" });
      } else {
        playTrack(tracks[0], tracks, 0);
      }
    }
  };

  const handleShare = () => {
    if (!album) return;
    shareMusic({ title: album.title, artist: album.artist, slug: album.slug });
    trackEvent("share_track", { album_id: album?.id, page_path: `https://mrcap1.com/albums/${albumSlug}` });
  };

  if (albumLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 flex justify-center"><p className="text-muted-foreground">Loading album...</p></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground text-lg">Album not found</p>
          <Link to="/discography" className="text-primary hover:underline mt-2 inline-block">← Back to Discography</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.title,
    byArtist: { "@type": "MusicGroup", name: album.artist },
    datePublished: `${album.release_year}`,
    numTracks: album.track_count,
    url: `https://mrcap1.com/albums/${album.slug}`,
    image: album.cover_art_url,
    ...(tracks && {
      track: tracks.map((t, i) => ({
        "@type": "MusicRecording",
        name: t.title,
        position: i + 1,
        duration: `PT${Math.floor(t.duration / 60)}M${t.duration % 60}S`,
        url: `https://mrcap1.com/music/${t.slug}`,
      })),
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title={`${album.title} | Album by Mr. CAP`}
        description={`Official release page for "${album.title}" by ${album.artist}. ${album.track_count} tracks, released ${album.release_year}. Listen, explore credits, and get updates from Mr. CAP Legacy.`}
        canonical={`https://mrcap1.com/albums/${album.slug}`}
        ogImage={album.cover_art_url || undefined}
        jsonLd={jsonLd}
      />

      {album.slug === "the-art-of-ism" && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={artOfIsmBg} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.35]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
      )}

      <Navigation />

      <section className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/discography" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Discography
          </Link>

          {/* 1. Hero */}
          <ReleaseHero
            title={album.title}
            artist={album.artist}
            releaseType="Album"
            releaseYear={album.release_year}
            coverArtUrl={album.cover_art_url}
            isActive={isActive}
            isPlaying={isActive && isPlaying}
            onPlay={handlePlayAll}
            onShare={handleShare}
            duration={tracks ? formatTotalDuration(tracks) : undefined}
          />

          {album.description && (
            <p className="text-sm text-muted-foreground mb-8 max-w-2xl">{album.description}</p>
          )}

          {/* 2. Listen — DSP Links */}
          <DSPLinks
            spotifyUrl={tracks?.[0]?.spotify_url}
            appleMusicUrl={(tracks?.[0] as any)?.apple_music_url}
            className="mb-6"
          />

          {/* 3. Release Facts Grid */}
          <ReleaseFactsGrid
            artist={album.artist}
            releaseType="Album"
            releaseYear={album.release_year}
            trackCount={album.track_count}
            totalDuration={tracks ? formatTotalDuration(tracks) : undefined}
            credits={album.credits}
            className="mb-8"
          />

          {/* 4. Tracklist */}
          <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border/20 text-xs text-muted-foreground uppercase tracking-widest">
              <div className="w-8 text-center">#</div>
              <div className="w-10" />
              <div className="flex-1">Title</div>
              <Clock className="w-3.5 h-3.5" />
            </div>
            {tracksLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading tracks...</div>
            ) : (
              tracks?.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={tracks} showAlbumArt={false} expandedTrackId={expandedTrackId} onToggleExpand={handleToggleExpand} />
              ))
            )}
          </div>

          {/* 5. Story Block */}
          <StoryBlock description={album.description} releaseYear={album.release_year} className="mt-8" />

          {/* 6. Share */}
          <div className="mt-8 border-t border-border/20 pt-6">
            <h3 className="text-foreground font-medium text-sm mb-3">Share This Album</h3>
            <ShareButtons title={album.title} artist={album.artist} slug={album.slug} type="album" />
          </div>

          {/* 7. Cross-links */}
          <ReleaseLinks albumSlug={album.slug} className="mt-6" />

          {/* 8. Related Releases */}
          <RelatedReleases currentAlbumId={album.id} className="mt-8" />

          {/* 9. Fan Capture */}
          <FanCaptureBanner sourcePage={`/albums/${album.slug}`} className="mt-12" />
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default AlbumPage;

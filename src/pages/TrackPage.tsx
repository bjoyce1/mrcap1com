import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTrackBySlug, useAlbumTracks } from "@/hooks/useStreamingData";
import { usePlayerStore } from "@/stores/playerStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/components/GoogleAnalytics";
import { shareMusic } from "@/lib/shareTrack";
import ReleaseHero from "@/components/music/ReleaseHero";
import ReleaseFactsGrid from "@/components/music/ReleaseFactsGrid";
import DSPLinks from "@/components/music/DSPLinks";
import LyricsAccordion from "@/components/music/LyricsAccordion";
import StoryBlock from "@/components/player/StoryBlock";
import ShareButtons from "@/components/music/ShareButtons";
import ReleaseLinks from "@/components/music/ReleaseLinks";
import RelatedReleases from "@/components/music/RelatedReleases";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import type { Album } from "@/stores/playerStore";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const TrackPage = () => {
  const { trackSlug } = useParams<{ trackSlug: string }>();
  const { data: track, isLoading } = useTrackBySlug(trackSlug || "");
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const { data: album } = useQuery({
    queryKey: ["album-for-track", track?.album_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("albums").select("*").eq("id", track!.album_id!).maybeSingle();
      if (error) throw error;
      return data as Album | null;
    },
    enabled: !!track?.album_id,
  });

  const { data: albumTracks } = useAlbumTracks(track?.album_id || undefined);

  useEffect(() => {
    if (track) {
      trackEvent("view_item", { event_category: "track", event_label: track.slug, track_title: track.title });
    }
  }, [track]);

  const isActive = currentTrack?.id === track?.id;

  const handlePlay = () => {
    if (!track) return;
    if (isActive) {
      togglePlay();
    } else if (albumTracks && track.album_id) {
      const idx = albumTracks.findIndex(t => t.id === track.id);
      playTrack(track, albumTracks, idx >= 0 ? idx : 0);
    } else {
      playTrack(track);
    }
  };

  const handleShare = () => {
    if (!track) return;
    shareMusic({ title: track.title, artist: track.artist, slug: track.slug });
    trackEvent("share_track", { track_id: track?.id, page_path: `https://mrcap1.com/music/${trackSlug}` });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 flex justify-center"><p className="text-muted-foreground">Loading...</p></div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground text-lg">Track not found</p>
          <Link to="/discography" className="text-primary hover:underline mt-2 inline-block">← Back to Discography</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.title,
    byArtist: { "@type": "MusicGroup", name: track.artist },
    duration: `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`,
    url: `https://mrcap1.com/music/${track.slug}`,
    image: track.cover_art_url,
    ...(album && {
      inAlbum: { "@type": "MusicAlbum", name: album.title, url: `https://mrcap1.com/albums/${album.slug}` },
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${track.title} | Mr. CAP`}
        description={`Official release page for "${track.title}" by ${track.artist}${track.featured_artists ? ` ft. ${track.featured_artists}` : ""}. Listen, read credits, view lyrics, and get the latest updates from Mr. CAP Legacy.`}
        canonical={`https://mrcap1.com/music/${track.slug}`}
        ogImage={track.cover_art_url ? (track.cover_art_url.startsWith("http") ? track.cover_art_url : `https://mrcap1com.lovable.app${track.cover_art_url}`) : undefined}
        jsonLd={jsonLd}
      />
      <Navigation />

      <section className="relative pt-28 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Link to="/music" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Music
          </Link>

          {/* 1. Hero */}
          <ReleaseHero
            title={track.title}
            artist={track.artist}
            releaseType={album ? "Album Track" : "Single"}
            releaseYear={track.release_year}
            coverArtUrl={track.cover_art_url}
            featuredArtists={track.featured_artists}
            isActive={isActive}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onShare={handleShare}
            albumSlug={album?.slug}
            albumTitle={album?.title}
            duration={formatDuration(track.duration)}
          />

          {!track.audio_url && (
            <p className="text-sm text-muted-foreground italic mb-6">Audio coming soon — this track is being prepared for streaming.</p>
          )}

          {/* 2. Listen Section — DSP + Spotify Embed */}
          <DSPLinks spotifyUrl={track.spotify_url} appleMusicUrl={(track as any).apple_music_url} />

          {track.spotify_url && (
            <div className="mt-6 border-t border-border/20 pt-6">
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src={track.spotify_url.replace("open.spotify.com/track/", "open.spotify.com/embed/track/").replace("open.spotify.com/album/", "open.spotify.com/embed/album/") + "?utm_source=generator&theme=0"}
                  width="100%" height="152" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" className="rounded-xl"
                />
              </div>
            </div>
          )}

          {/* 3. Release Facts Grid */}
          <ReleaseFactsGrid
            artist={track.artist}
            releaseType={album ? "Album Track" : "Single"}
            releaseYear={track.release_year}
            producer={(track as any).producers}
            writers={(track as any).writers}
            featuredArtists={track.featured_artists}
            credits={track.credits}
            isrc={(track as any).isrc}
            className="mt-8"
          />

          {/* 4. Lyrics Accordion */}
          <LyricsAccordion lyrics={(track as any).lyrics} className="mt-6" />

          {/* 5. Story Block */}
          <StoryBlock
            description={(track as any).story_behind || album?.description}
            releaseYear={track.release_year}
            className="mt-6"
          />

          {/* 6. Share + Cross-links */}
          <div className="mt-8 border-t border-border/20 pt-6">
            <h3 className="text-foreground font-medium text-sm mb-3">Share This Release</h3>
            <ShareButtons title={track.title} artist={track.artist} slug={track.slug} type="track" />
          </div>

          <ReleaseLinks trackSlug={track.slug} className="mt-6" />

          {/* 7. Related Releases */}
          <RelatedReleases currentTrackId={track.id} currentAlbumId={track.album_id || undefined} className="mt-8" />

          {/* 8. Fan Capture */}
          <FanCaptureBanner sourcePage={`/music/${track.slug}`} className="mt-12" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrackPage;

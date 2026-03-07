import { useParams, Link } from "react-router-dom";
import { Play, Pause, ArrowLeft, Share2, Copy, Check } from "lucide-react";
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
import StoryBlock from "@/components/player/StoryBlock";
import LyricsAccordion from "@/components/music/LyricsAccordion";
import CreditsGrid from "@/components/music/CreditsGrid";
import DSPLinks from "@/components/music/DSPLinks";
import RelatedReleases from "@/components/music/RelatedReleases";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Album } from "@/stores/playerStore";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const TrackPage = () => {
  const { trackSlug } = useParams<{ trackSlug: string }>();
  const { data: track, isLoading } = useTrackBySlug(trackSlug || "");
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [copied, setCopied] = useState(false);

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
    trackEvent("share_track", { track_id: track?.id, page_path: `https://mrcap1.com/track/${trackSlug}` });
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
          <Link to="/music" className="text-primary hover:underline mt-2 inline-block">← Back to Music</Link>
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
    url: `https://mrcap1.com/track/${track.slug}`,
    image: track.cover_art_url,
    ...(album && {
      inAlbum: { "@type": "MusicAlbum", name: album.title, url: `https://mrcap1.com/album/${album.slug}` },
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${track.title} — ${track.artist} | Stream on mrcap1.com`}
        description={`Stream "${track.title}" by ${track.artist}${track.featured_artists ? ` ft. ${track.featured_artists}` : ""}. ${album ? `From the album ${album.title}.` : ""} Houston hip hop.`}
        canonical={`https://mrcap1.com/track/${track.slug}`}
        ogImage={track.cover_art_url ? (track.cover_art_url.startsWith("http") ? track.cover_art_url : `https://mrcap1com.lovable.app${track.cover_art_url}`) : undefined}
        jsonLd={jsonLd}
      />
      <Navigation />

      <section className="relative pt-28 pb-16 px-6">
        <div className="absolute inset-0 bg-orange-glow opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Link to="/music" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Music
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            {/* Cover Art */}
            <div className="relative group w-64 md:w-80">
              <img src={track.cover_art_url || "/placeholder.svg"} alt={track.title} className="w-full aspect-square rounded-xl object-cover shadow-2xl border border-border/30" />
              <button onClick={handlePlay} className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg">
                  {isActive && isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </div>
              </button>
            </div>

            {/* Track Info */}
            <div className="text-center md:text-left flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{album ? "Album Track" : "Single"}</p>
              <h1 className="text-3xl md:text-5xl font-display text-foreground mb-2">{track.title}</h1>
              <p className="text-lg text-muted-foreground mb-1">
                {track.artist}
                {track.featured_artists && <span className="text-foreground"> ft. {track.featured_artists}</span>}
              </p>
              {album && (
                <Link to={`/album/${album.slug}`} className="text-sm text-primary hover:underline">{album.title}</Link>
              )}
              <p className="text-sm text-muted-foreground mt-1">{track.release_year} · {formatDuration(track.duration)}</p>

              <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
                <button onClick={handlePlay} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                  {isActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isActive && isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 border border-border/50 text-foreground px-4 py-3 rounded-full hover:bg-secondary transition-colors">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>

              {!track.audio_url && (
                <p className="text-sm text-muted-foreground italic mt-4">Audio coming soon — this track is being prepared for streaming.</p>
              )}
            </div>
          </div>

          {/* DSP Links */}
          <DSPLinks spotifyUrl={track.spotify_url} />

          {/* Spotify Embed */}
          {track.spotify_url && (
            <div className="mt-8 border-t border-border/20 pt-6">
              <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Also on Spotify
              </h3>
              <div className="rounded-xl overflow-hidden">
                <iframe src={track.spotify_url.replace("open.spotify.com/track/", "open.spotify.com/embed/track/") + "?utm_source=generator&theme=0"} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-xl" />
              </div>
            </div>
          )}

          {/* Story Block */}
          <StoryBlock description={album?.description} releaseYear={track.release_year} className="mt-8" />

          {/* Lyrics Accordion */}
          <LyricsAccordion lyrics={track.credits?.includes("Lyrics:") ? track.credits : null} className="mt-4" />

          {/* Credits Grid */}
          <CreditsGrid credits={track.credits} featuredArtists={track.featured_artists} className="mt-4" />

          {/* Related Releases */}
          <RelatedReleases currentTrackId={track.id} currentAlbumId={track.album_id || undefined} className="mt-8" />

          {/* Fan Capture */}
          <section className="mt-12 border-t border-border/20 pt-8">
            <NewsletterSignup source={`track-${track.slug}`} variant="compact" />
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrackPage;

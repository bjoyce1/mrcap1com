import { useParams, Link } from "react-router-dom";
import { Play, Clock, ArrowLeft, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackRow from "@/components/player/TrackRow";
import { useAlbumBySlug, useAlbumTracks } from "@/hooks/useStreamingData";
import { usePlayerStore } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
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
  const { playTrack } = usePlayerStore();

  const handlePlayAll = () => {
    if (tracks && tracks.length > 0) {
      const playable = tracks.filter(t => t.audio_url);
      if (playable.length > 0) {
        playTrack(playable[0], playable, 0);
        trackEvent("album_play", {
          album_id: album?.id,
          page_path: `/album/${albumSlug}`,
          source: "album",
        });
      } else {
        playTrack(tracks[0], tracks, 0);
      }
    }
  };

  const handleShare = () => {
    const url = `https://mrcap1.com/album/${albumSlug}`;
    navigator.clipboard.writeText(url);
    trackEvent("share_track", { album_id: album?.id, page_path: url });
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
          <Link to="/listen" className="text-primary hover:underline mt-2 inline-block">← Back to Listen</Link>
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
    url: `https://mrcap1.com/album/${album.slug}`,
    image: album.cover_art_url,
    ...(tracks && {
      track: tracks.map((t, i) => ({
        "@type": "MusicRecording",
        name: t.title,
        position: i + 1,
        duration: `PT${Math.floor(t.duration / 60)}M${t.duration % 60}S`,
        url: `https://mrcap1.com/track/${t.slug}`,
      })),
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title={`${album.title} — ${album.artist} | Stream on mrcap1.com`}
        description={album.description || `Listen to ${album.title} by ${album.artist}. ${album.track_count} tracks, released ${album.release_year}.`}
        canonical={`https://mrcap1.com/album/${album.slug}`}
        ogImage={album.cover_art_url || undefined}
        jsonLd={jsonLd}
      />

      {/* Faded background image — only for Art of ISM */}
      {album.slug === "the-art-of-ism" && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src={artOfIsmBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
      )}

      <Navigation />

      <section className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/listen" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Listen
          </Link>

          {/* Album Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <img
              src={album.cover_art_url || "/placeholder.svg"}
              alt={album.title}
              className="w-full md:w-64 aspect-square rounded-xl object-cover shadow-2xl border border-border/30"
            />
            <div className="flex flex-col justify-end">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Album</p>
              <h1 className="text-3xl md:text-5xl font-display text-foreground mb-2">{album.title}</h1>
              <p className="text-muted-foreground mb-4">
                {album.artist} · {album.release_year} · {album.track_count} tracks
                {tracks && ` · ${formatTotalDuration(tracks)}`}
              </p>
              {album.description && (
                <p className="text-sm text-muted-foreground mb-4 max-w-lg">{album.description}</p>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  <Play className="w-5 h-5" /> Play
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 border border-border/50 text-foreground px-4 py-3 rounded-full hover:bg-secondary transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Tracklist */}
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
                <TrackRow key={track.id} track={track} index={i} queue={tracks} showAlbumArt={false} />
              ))
            )}
          </div>

          {album.credits && (
            <div className="mt-8 text-sm text-muted-foreground">
              <h3 className="text-foreground font-medium mb-2">Credits</h3>
              <p>{album.credits}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlbumPage;

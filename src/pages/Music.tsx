import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CitationBlock from "@/components/CitationBlock";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, ExternalLink, Music as MusicIcon, Disc3, ArrowRight, Headphones } from "lucide-react";
import TrackRow from "@/components/player/TrackRow";
import { useAlbums, useLatestTracks, useAllTracks } from "@/hooks/useStreamingData";
import { usePlayerStore } from "@/stores/playerStore";
import { trackEvent } from "@/components/GoogleAnalytics";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

import albumBetn from "@/assets/betn-on-me.png";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumTies from "@/assets/album-ties.jpg";
import dippinMetaverse from "@/assets/dippin-metaverse.png";
import limitless from "@/assets/limitless.webp";
import socialMediaHoStroll from "@/assets/social-media-ho-stroll.jpg";

const streamingPlatforms = [
  { name: "Spotify", url: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", color: "bg-[#1DB954]" },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/mr-cap/1506719540", color: "bg-[#FA2D48]" },
  { name: "YouTube Music", url: "https://www.youtube.com/@mrcap1", color: "bg-[#FF0000]" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/mr-cap", color: "bg-[#FF9900]" },
  { name: "Tidal", url: "https://tidal.com/artist/mr-cap", color: "bg-[#000000] ring-1 ring-white/20" },
];

const Music = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: latestTracks, isLoading: tracksLoading } = useLatestTracks(8);
  const { data: allTracks } = useAllTracks();
  const { playTrack } = usePlayerStore();

  const startHereRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const albumsRef = useRef<HTMLDivElement>(null);
  const singlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("player_loaded", { page_path: "/music", source: "music" });
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      [startHereRef, latestRef, albumsRef, singlesRef].forEach((ref) => {
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
        trackEvent("album_play", { page_path: "/music", source: "music" });
      }
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        "name": "Mr. CAP Discography",
        "description": "Complete discography of Houston hip-hop artist Mr. CAP including albums, singles, and collaborations.",
        "url": "https://mrcap1.com/music",
        "numTracks": allTracks?.length || 0,
      },
      {
        "@type": "MusicAlbum",
        "name": "The Ties That Bind Us",
        "byArtist": { "@type": "MusicGroup", "name": "South Park Coalition" },
        "genre": ["Hip-Hop", "Southern Rap"],
        "datePublished": "2024-10-18",
        "numTracks": 19,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Music", "item": "https://mrcap1.com/music" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Music by Mr. CAP | Stream, Albums & Discography | Houston Hip-Hop</title>
        <meta name="description" content="Stream Mr. CAP's full catalog — albums, singles and music from Houston's underground hip-hop pioneer. South Park Coalition original member." />
        <link rel="canonical" href="https://mrcap1.com/music" />
        <meta property="og:title" content="Music by Mr. CAP | Stream & Discography" />
        <meta property="og:description" content="Stream the complete discography of Houston hip-hop pioneer Mr. CAP." />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/music" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          {/* Video Hero Section */}
          <section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
              <iframe
                src="https://www.youtube.com/embed/3G3_rIwKRTE?autoplay=1&mute=1&loop=1&playlist=3G3_rIwKRTE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                title="Mr. CAP – Music Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] sm:w-[200%] sm:h-[200%] pointer-events-none"
                style={{ border: 'none' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-end max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
              <nav className="absolute top-28 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Music</span>
              </nav>

              <div className="flex items-center gap-2 mb-4">
                <Headphones className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-widest text-primary font-medium">CAP STREAM</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-end justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-tight drop-shadow-2xl">
                    20+ Years. 6 Albums. Stream Direct.
                  </h1>
                </div>
                <div className="flex flex-col flex-1 text-left sm:text-right max-w-md space-y-4 items-start sm:items-end">
                  <p className="text-base sm:text-lg text-muted-foreground max-w-sm drop-shadow-lg">
                    Mr. CAP's full catalog — Houston hip hop straight from the source. No middleman.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{allTracks?.length || 0} tracks</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{albums?.length || 0} albums</span>
                  </div>
                  <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
                  >
                    <Play className="w-5 h-5" /> Play All
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Album */}
          <section className="relative z-10 pt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative mt-8 sm:mt-16">
                <div className="absolute -top-8 inset-0 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30 h-56 max-w-5xl rounded-[28px] mx-auto blur-2xl" />
                <div className="relative backdrop-blur-2xl bg-card/30 ring-1 ring-border/20 rounded-2xl overflow-hidden max-w-5xl mx-auto" style={{ maskImage: 'linear-gradient(black 0%, black 70%, transparent 100%)' }}>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative group">
                        <img
                          src={albumTies}
                          alt="The Ties That Bind Us album cover"
                          className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          NEW ALBUM
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
                          <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                          FEATURED RELEASE
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
                          The Ties That Bind Us
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-lg">
                          More than an album—it's a life story scored in 808s. From Third Ward lessons to blockchain boardrooms, Mr. CAP turns years of struggle, hustle, and growth into a soundtrack for people betting on themselves.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <Button variant="flux" asChild>
                            <Link to="/album/the-ties-that-bind-us">
                              <Play className="mr-2 h-4 w-4" /> Play Album
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Streaming Platforms */}
          <section className="py-12 mt-16 border-y border-border/20 bg-card/30" style={{ backdropFilter: 'blur(20px)' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <p className="text-center text-muted-foreground mb-6">Stream on your favorite platform</p>
              <div className="flex flex-wrap justify-center gap-3">
                {streamingPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-card/50 border border-border/30 rounded-full px-5 py-2.5 hover:bg-card/80 transition-colors"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                    <span className="text-sm font-medium text-foreground">{platform.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* CAP STREAM — Live Track Lists */}
          <div className="max-w-6xl mx-auto px-6 pb-32 space-y-14 pt-16">
            {/* Start Here */}
            <div ref={startHereRef}>
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
                <MusicIcon className="w-5 h-5 text-primary" /> Latest Releases
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

            {/* Albums Grid */}
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
                          <p className="text-sm font-medium text-white truncate">{album.title}</p>
                          <p className="text-xs text-white/60">{album.release_year} · {album.artist}</p>
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

            {/* Singles & Features */}
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
            <div>
              <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Full Catalog on Spotify
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

          {/* CTA */}
          <section className="py-20 px-4 sm:px-6 border-t border-border/20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-border/30 mb-6">
                <MusicIcon className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 tracking-tight">
                Experience Live
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Whether it's a packed Houston club or a festival stage in another city, Mr. CAP brings a raw, 
                honest performance—built on decades of experience and a lifetime of stories.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="flux" asChild>
                  <Link to="/live">View Live Shows</Link>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <Link to="/nft">NFT Collection</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <CitationBlock />
        <Footer />
      </div>
    </>
  );
};

export default Music;

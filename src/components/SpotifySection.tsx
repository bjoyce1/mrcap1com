import { Music2, ExternalLink, Play, Shuffle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const SpotifySection = () => {
  const spotifyArtistId = "69pjfQNXA1xjusnI2wfgug";
  const spotifyArtistUrl = `https://open.spotify.com/artist/${spotifyArtistId}`;

  const statItems: ChromaGridItem[] = [
    {
      title: "20+",
      subtitle: "Years Active",
      borderColor: "hsl(var(--foreground))",
      gradient: "linear-gradient(145deg, hsl(var(--foreground) / 0.05), hsl(var(--background)))",
    },
    {
      title: "4",
      subtitle: "Studio Albums",
      borderColor: "#1DB954",
      gradient: "linear-gradient(180deg, rgba(29,185,84,0.12), hsl(var(--background)))",
    },
    {
      title: "14+",
      subtitle: "Singles & EPs",
      borderColor: "hsl(var(--cap-gold))",
      gradient: "linear-gradient(210deg, hsl(var(--cap-gold) / 0.12), hsl(var(--background)))",
    },
  ];

  const platformItems: ChromaGridItem[] = [
    { title: "Apple Music", borderColor: "hsl(var(--border))", gradient: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))" },
    { title: "YouTube Music", borderColor: "hsl(var(--border))", gradient: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))" },
    { title: "Amazon Music", borderColor: "hsl(var(--border))", gradient: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))" },
    { title: "Tidal", borderColor: "hsl(var(--border))", gradient: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))" },
  ];

  return (
    <section id="spotify" className="section-spacing bg-hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-red-glow opacity-20" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#1DB954]/4 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary/6 blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954]/8 border border-[#1DB954]/15 mb-6">
              <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="text-sm font-medium text-[#1DB954]">Now Streaming</span>
            </div>
            <h2 className="font-editorial text-5xl md:text-7xl mb-5">
              Listen on <span className="text-[#1DB954]">Spotify</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
              Stream Mr. CAP's complete catalog on Spotify. Follow for new releases,
              exclusive content, and curated playlists straight from the South Park Coalition.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal width="100%">
          <div className="mb-16">
            <div className="glass rounded-2xl p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#1DB954] font-medium mb-4 block">
                    Artist Profile
                  </span>
                  <h3 className="font-editorial text-4xl md:text-5xl mb-5">Mr. CAP</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-balance">
                    South Park Coalition original member. Houston hip-hop legend.
                    Over two decades of authentic street music, conscious lyrics,
                    and uncompromising artistry.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full px-6"
                      onClick={() => window.open(spotifyArtistUrl, '_blank')}
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Play on Spotify
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#1DB954]/20 hover:bg-[#1DB954]/10 hover:border-[#1DB954]/40 rounded-full"
                      onClick={() => window.open(spotifyArtistUrl, '_blank')}
                    >
                      <Heart className="w-4 h-4" />
                      Follow Artist
                    </Button>
                  </div>
                </div>
                <div className="relative accent-glow">
                  <div className="rounded-xl overflow-hidden shadow-card">
                    <iframe
                      src={`https://open.spotify.com/embed/artist/${spotifyArtistId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="380"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal width="100%">
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-editorial text-3xl">Full Catalog</h3>
              <Button
                variant="ghost"
                className="text-[#1DB954] hover:bg-[#1DB954]/10"
                onClick={() => window.open(spotifyArtistUrl, '_blank')}
              >
                Open in Spotify
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-card accent-glow">
              <iframe
                src={`https://open.spotify.com/embed/artist/${spotifyArtistId}?utm_source=generator&theme=0`}
                width="100%"
                height="500"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal width="100%">
          <div className="glass rounded-2xl p-10 text-center">
            <div style={{ position: 'relative', minHeight: '100px' }}>
              <ChromaGrid
                items={statItems}
                columns={3}
                radius={250}
                damping={0.4}
                fadeOut={0.5}
                renderCard={(item) => (
                  <div className="text-center py-4">
                    <p className="font-display text-4xl md:text-5xl text-foreground">{item.title}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.subtitle}</p>
                  </div>
                )}
              />
            </div>
            <Button
              size="lg"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-10 rounded-full mt-6"
              onClick={() => window.open(spotifyArtistUrl, '_blank')}
            >
              <Shuffle className="w-5 h-5" />
              Shuffle All Tracks
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal width="100%">
          <div className="mt-16 pt-10 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-5">Also available on:</p>
            <div style={{ position: 'relative', minHeight: '60px' }}>
              <ChromaGrid
                items={platformItems}
                columns={4}
                radius={200}
                damping={0.4}
                fadeOut={0.5}
                renderCard={(item) => (
                  <div className="flex items-center justify-center gap-2 py-2 px-4">
                    <Music2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item.title}</span>
                  </div>
                )}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SpotifySection;

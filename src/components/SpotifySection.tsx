import { Music2, ExternalLink, Play, Shuffle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const SpotifySection = () => {
  const spotifyArtistId = "69pjfQNXA1xjusnI2wfgug";
  const spotifyArtistUrl = `https://open.spotify.com/artist/${spotifyArtistId}`;

  return (
    <section id="spotify" className="py-24 md:py-32 bg-hero-gradient relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-red-glow opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#1DB954]/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 mb-6">
            <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="text-sm font-medium text-[#1DB954]">Now Streaming</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            Listen on <span className="text-[#1DB954]">Spotify</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Stream Mr. CAP's complete catalog on Spotify. Follow for new releases, 
            exclusive content, and curated playlists straight from the South Park Coalition.
          </p>
        </div>

        {/* Main Artist Embed */}
        <div className="mb-12">
          <div className="bg-card-gradient rounded-2xl border border-border p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#1DB954] font-medium mb-4 block">
                  Artist Profile
                </span>
                <h3 className="font-display text-4xl md:text-5xl mb-4">Mr. CAP</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  South Park Coalition original member. Houston hip-hop legend. 
                  Over two decades of authentic street music, conscious lyrics, 
                  and uncompromising artistry.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
                    onClick={() => window.open(spotifyArtistUrl, '_blank')}
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Play on Spotify
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#1DB954]/30 hover:bg-[#1DB954]/10 hover:border-[#1DB954]/50"
                    onClick={() => window.open(spotifyArtistUrl, '_blank')}
                  >
                    <Heart className="w-4 h-4" />
                    Follow Artist
                  </Button>
                </div>
              </div>
              <div className="relative">
                {/* Spotify Artist Embed */}
                <div className="rounded-xl overflow-hidden shadow-card">
                  <iframe
                    src={`https://open.spotify.com/embed/artist/${spotifyArtistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="352"
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

        {/* Full Discography Embed */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-3xl">Full Catalog</h3>
            <Button 
              variant="ghost" 
              className="text-[#1DB954] hover:bg-[#1DB954]/10"
              onClick={() => window.open(spotifyArtistUrl, '_blank')}
            >
              Open in Spotify
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-card">
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

        {/* Stats & CTA */}
        <div className="bg-gradient-to-r from-[#1DB954]/10 via-transparent to-primary/10 rounded-2xl border border-border p-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-8">
            <div>
              <p className="font-display text-4xl md:text-5xl text-foreground">20+</p>
              <p className="text-muted-foreground text-sm">Years Active</p>
            </div>
            <div>
              <p className="font-display text-4xl md:text-5xl text-[#1DB954]">4</p>
              <p className="text-muted-foreground text-sm">Studio Albums</p>
            </div>
            <div>
              <p className="font-display text-4xl md:text-5xl text-cap-gold">14+</p>
              <p className="text-muted-foreground text-sm">Singles & EPs</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8"
            onClick={() => window.open(spotifyArtistUrl, '_blank')}
          >
            <Shuffle className="w-5 h-5" />
            Shuffle All Tracks
          </Button>
        </div>

        {/* Other Platforms */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">Also available on:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="sm" className="border-border/50">
              <Music2 className="w-4 h-4" />
              Apple Music
            </Button>
            <Button variant="outline" size="sm" className="border-border/50">
              <Music2 className="w-4 h-4" />
              YouTube Music
            </Button>
            <Button variant="outline" size="sm" className="border-border/50">
              <Music2 className="w-4 h-4" />
              Amazon Music
            </Button>
            <Button variant="outline" size="sm" className="border-border/50">
              <Music2 className="w-4 h-4" />
              Tidal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifySection;

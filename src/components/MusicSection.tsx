import { Play, Headphones, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import albumTies from "@/assets/album-ties.jpg";
import albumGrave from "@/assets/album-grave.jpg";

const MusicSection = () => {
  return (
    <section id="music" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Discography
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Music & <span className="text-gradient-gold">Releases</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            From underground classics to digital-age releases, Mr. CAP's catalog reflects 
            a journey — not just a career. Available for streaming, playlisting, sync, and press use.
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* The Ties That Bind Us */}
          <div className="group bg-card-gradient rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={albumTies}
                alt="The Ties That Bind Us Album Cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium">
                  Latest Album
                </span>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-3xl mb-1">The Ties That Bind Us</h3>
              <p className="text-sm text-cap-gold mb-3">
                Lead Single: "Bet'n On Me"
              </p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                A grown-man statement album — honest, reflective, and unflinching. 
                CAP explores loyalty, pain, spirituality, survival, and growth over 
                cinematic production and Southern knock.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Recorded by K-Water · Mixed by K-Water · Mastered by Mr. CAP · 
                Executive Produced by South Park Coalition LLC
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="hero" size="sm">
                  <Play className="w-4 h-4" />
                  Play "Bet'n On Me"
                </Button>
                <Button variant="outline" size="sm">
                  <Headphones className="w-4 h-4" />
                  Stream Album
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                  Media Download
                </Button>
              </div>
            </div>
          </div>

          {/* 2 Tha Grave */}
          <div className="group bg-card-gradient rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={albumGrave}
                alt="2 Tha Grave Album Cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs uppercase tracking-wider font-medium">
                  Debut Album
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-3xl mb-1">2 Tha Grave</h3>
              <p className="text-sm text-muted-foreground mb-3">2011 · Debut Album</p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                The debut album that set the tone. Introduced listeners to CAP's distinctive 
                voice: thoughtful, raw, and rooted in Houston's underground tradition. Features 
                SPC affiliates and longtime collaborators.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                  Spotify
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                  Apple Music
                </Button>
                <Button variant="ghost" size="sm">
                  View Tracklist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Singles & Features */}
        <div className="mt-16">
          <h3 className="font-display text-2xl mb-6">Selected Singles & Features</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Bet'n On Me", type: "Single", year: "2024" },
              { title: "Collaboration w/ Point Blank", type: "Feature", year: "SPC" },
              { title: "Collaboration w/ Klondike Kat", type: "Feature", year: "SPC" },
            ].map((track, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{track.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {track.type} · {track.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;

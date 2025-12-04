import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Palette, ImageIcon } from "lucide-react";
import mrCapCoin from "@/assets/mr-cap-coin.png";

const ArtGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Placeholder artwork data - replace with actual artwork later
  const artworks: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    year?: string;
    medium?: string;
  }[] = [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none" />

      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? "bg-background/80 backdrop-blur-xl border-b border-white/5" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-3">
            <img src={mrCapCoin} alt="MR. CAP" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-xl font-medium tracking-tight">
              MR. CAP
            </span>
          </Link>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg">
            <Palette className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline text-foreground text-sm font-medium">Art Gallery</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 rounded-full">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
              Visual Art Collection
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-medium text-foreground mb-6 tracking-tight">
            Art <span className="text-gradient-orange">Gallery</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Explore the visual art collection of MR. CAP — where Houston hip-hop culture 
            meets creative expression.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <main className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 px-6 py-3 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 rounded-full">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                Featured Works
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Gallery Grid */}
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <div 
                  key={artwork.id}
                  className="group relative supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl 
                             ring-1 ring-white/5 rounded-2xl overflow-hidden
                             hover:ring-white/20 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-display font-medium text-foreground mb-1">
                      {artwork.title}
                    </h3>
                    {artwork.year && (
                      <p className="text-xs text-primary uppercase tracking-widest mb-2">
                        {artwork.year} {artwork.medium && `• ${artwork.medium}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {artwork.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/5 rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-6">
                <Palette className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-2xl font-display font-medium text-foreground mb-2 tracking-tight">
                Coming Soon
              </h3>
              <p className="text-muted-foreground text-center max-w-md font-light">
                The art gallery is being curated. Check back soon to explore MR. CAP's visual art collection.
              </p>
            </div>
          )}
          
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 md:py-24 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4 tracking-tight">
            Art & <span className="text-gradient-orange">Culture</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Experience the intersection of Houston hip-hop and visual creativity through MR. CAP's artistic journey.
          </p>
          <Link 
            to="/nft"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground 
                       rounded-full font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            <span>Explore NFT Collection</span>
            <Palette className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={mrCapCoin} alt="MR. CAP" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-display text-lg font-medium tracking-tight">
                MR. CAP
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MR. CAP. South Park Born. Class of '92. Future-Focused.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArtGallery;
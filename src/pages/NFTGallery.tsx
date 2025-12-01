import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Wallet } from "lucide-react";
import { ArtOfIsmCollection } from "@/components/ArtOfIsmCollection";
import { OtherNftsGallery } from "@/components/OtherNftsGallery";
import UnicornBackground from "@/components/UnicornBackground";

const NFTGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none" />

      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? "bg-background/80 backdrop-blur-lg border-b border-white/5" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-display font-bold text-primary text-sm">MC</span>
            </div>
            <span className="font-display text-xl font-medium tracking-tight">
              MR. CAP
            </span>
          </Link>
          
          <a 
            href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full
                       text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">View on OpenSea</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Unicorn Studio Background */}
        <UnicornBackground />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none z-[1]" />
        
        {/* Orange Glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-primary">
                Web3 · Live On-Chain
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-medium text-center mb-6 tracking-tighter text-glow">
            NFT
            <br />
            <span className="text-gradient-orange">Portfolio</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Pioneering Houston hip-hop in Web3. Explore MR. CAP's digital art collection, 
            featuring tokenized music, exclusive collaborations, and blockchain collectibles.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-medium text-gradient-orange">2021</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">First Houston Hip-Hop NFT</p>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-medium text-primary">11</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Album Tracks Tokenized</p>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-medium text-foreground">ETH</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Ethereum Blockchain</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Banner */}
      <section className="relative py-12 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Historic Milestone</p>
                <h3 className="text-xl md:text-2xl font-display font-medium text-foreground tracking-tight">
                  First Houston Rap Artist to Sell a Hip Hop NFT
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>February 25, 2021</span>
              <span className="text-white/20">•</span>
              <span>OpenSea</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Art of ISM Collection */}
          <ArtOfIsmCollection />
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] border border-white/10 rounded-full">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                Wallet Collection
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          {/* Other NFTs */}
          <OtherNftsGallery />
          
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4 tracking-tight">
            Collect <span className="text-gradient-orange">Digital History</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Own a piece of Houston hip-hop history. Each NFT represents a unique moment 
            in MR. CAP's pioneering journey in Web3.
          </p>
          <a 
            href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground 
                       rounded-full font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            <span>Explore on OpenSea</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-display font-bold text-primary text-xs">MC</span>
              </div>
              <span className="font-display text-lg font-medium tracking-tight">
                MR. CAP
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MR. CAP. Pioneering Houston Hip-Hop in Web3.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NFTGallery;

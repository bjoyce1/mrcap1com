import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Wallet } from "lucide-react";
import { ArtOfIsmCollection } from "@/components/ArtOfIsmCollection";
import { OtherNftsGallery } from "@/components/OtherNftsGallery";

const NFTGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? "bg-background/90 backdrop-blur-lg border-b border-border" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <Link to="/" className="font-display text-2xl tracking-wider">
            <span className="text-primary">MR.</span>{" "}
            <span className="text-foreground">CAP</span>
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
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Web3 · Live On-Chain
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display text-center mb-6">
            <span className="text-foreground">NFT</span>{" "}
            <span className="text-gradient-gold">Portfolio</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            Pioneering Houston hip-hop in Web3. Explore MR. CAP's digital art collection, 
            featuring tokenized music, exclusive collaborations, and blockchain collectibles.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display text-gradient-gold">2021</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">First Houston Hip-Hop NFT</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display text-primary">11</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Album Tracks Tokenized</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display text-accent">ETH</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Ethereum Blockchain</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Banner */}
      <section className="relative py-12 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary font-medium mb-1">Historic Milestone</p>
                <h3 className="text-xl md:text-2xl font-display text-foreground">
                  First Houston Rap Artist to Sell a Hip Hop NFT
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">February 25, 2021</span>
              <span className="text-border">•</span>
              <span className="text-sm">OpenSea</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Art of ISM Collection */}
          <ArtOfIsmCollection />
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-3 px-6 py-3 bg-card/50 border border-border/50 rounded-full">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                Wallet Collection
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          {/* Other NFTs */}
          <OtherNftsGallery />
          
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card/30 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Collect <span className="text-gradient-gold">Digital History</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Own a piece of Houston hip-hop history. Each NFT represents a unique moment 
            in MR. CAP's pioneering journey in Web3.
          </p>
          <a 
            href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground 
                       rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors
                       shadow-glow hover:shadow-gold"
          >
            <span>Explore on OpenSea</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="font-display text-xl tracking-wider">
              <span className="text-primary">MR.</span>{" "}
              <span className="text-foreground">CAP</span>
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

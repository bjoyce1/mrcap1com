import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink, Wallet } from "lucide-react";
import { ArtOfIsmCollection } from "@/components/ArtOfIsmCollection";
import { OtherNftsGallery } from "@/components/OtherNftsGallery";
import NFTHeroSection from "@/components/NFTHeroSection";
import nftLimitless from "@/assets/nft-limitless.png";
import nftArtOfIsm from "@/assets/nft-art-of-ism.png";
import mrCapCoin from "@/assets/mr-cap-coin.png";

const NFTGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Mr. CAP NFT Collection",
    "description": "Explore Mr. CAP's NFT collection featuring The Art of ISM album tracks and exclusive digital collectibles. First Houston rapper to sell a Hip Hop NFT on the blockchain.",
    "url": "https://mrcap1.com/nft",
    "mainEntity": {
      "@type": "ItemList",
      "name": "The Art of ISM NFT Album Collection",
      "description": "11 tracks from The Art of ISM album available as individual NFT collectibles",
      "numberOfItems": 11
    },
    "about": {
      "@type": "Person",
      "name": "Mr. CAP",
      "description": "First Houston rapper to sell a Hip Hop NFT on the blockchain (February 25, 2021)"
    }
  };

  return (
    <>
      <Helmet>
        <title>NFT Gallery | Mr. CAP – Digital Art & Music Collectibles</title>
        <meta name="description" content="Explore Mr. CAP's NFT collection featuring The Art of ISM album, exclusive digital art, and music collectibles. First Houston rapper to sell a Hip Hop NFT on the blockchain." />
        <link rel="canonical" href="https://mrcap1.com/nft" />
        
        <meta property="og:title" content="NFT Gallery | Mr. CAP" />
        <meta property="og:description" content="Digital art and music collectibles from Houston hip-hop pioneer Mr. CAP." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

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
          
          <a 
            href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg
                       text-foreground text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">View on OpenSea</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <NFTHeroSection imageUrl1={nftLimitless} imageUrl2={nftArtOfIsm} />

      {/* Milestone Banner */}
      <section className="relative py-12 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
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
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Art of ISM Collection */}
          <ArtOfIsmCollection />
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 px-6 py-3 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 rounded-full">
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
      <section className="py-16 md:py-24 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl border-t border-white/5">
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={mrCapCoin} alt="MR. CAP" className="w-9 h-9 rounded-full object-cover" />
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
    </>
  );
};

export default NFTGallery;

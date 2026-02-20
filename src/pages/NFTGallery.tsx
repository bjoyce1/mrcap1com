import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink, Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import { ArtOfIsmCollection } from "@/components/ArtOfIsmCollection";
import { OtherNftsGallery } from "@/components/OtherNftsGallery";
import NFTHeroSection from "@/components/NFTHeroSection";
import LimitlessSpotlight from "@/components/LimitlessSpotlight";
import UnreleasedNFTShowcase from "@/components/nft/UnreleasedNFTShowcase";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import nftLimitless from "@/assets/nft-limitless.png";
import nftArtOfIsm from "@/assets/nft-art-of-ism.png";
import mrCapCoin from "@/assets/mr-cap-coin.png";

const NFTGallery = () => {
  const [scrollY, setScrollY] = useState(0);
  const milestoneRef = useRef<HTMLElement>(null);
  const limitlessRef = useRef<HTMLElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const otherNftsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Milestone Banner Animation
      if (milestoneRef.current) {
        gsap.fromTo(
          milestoneRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: milestoneRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Limitless Spotlight Animation
      if (limitlessRef.current) {
        gsap.fromTo(
          limitlessRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: limitlessRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Art of ISM Collection Animation
      if (collectionRef.current) {
        gsap.fromTo(
          collectionRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: collectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Divider Animation
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Other NFTs Gallery Animation
      if (otherNftsRef.current) {
        gsap.fromTo(
          otherNftsRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: otherNftsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // CTA Section Animation
      if (ctaRef.current) {
        const ctaElements = ctaRef.current.querySelectorAll("h2, p, a");
        gsap.fromTo(
          ctaElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
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

      <Navigation />

      {/* Hero Section */}
      <NFTHeroSection imageUrl1={nftLimitless} imageUrl2={nftArtOfIsm} />

      {/* Milestone Banner */}
      <section ref={milestoneRef} className="relative py-8 md:py-12 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
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

      {/* Limitless Spotlight */}
      <LimitlessSpotlight ref={limitlessRef} />

      {/* Main Content */}
      <main className="py-10 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Art of ISM Collection */}
          <div ref={collectionRef}>
            <ArtOfIsmCollection />
          </div>
          
          {/* Unreleased NFT Showcase */}
          <UnreleasedNFTShowcase />

          {/* Divider */}
          <div ref={dividerRef} className="flex items-center gap-4 my-16">
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
          <div ref={otherNftsRef}>
            <OtherNftsGallery />
          </div>
          
        </div>
      </main>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-12 md:py-24 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-4 tracking-tight">
            Collect <span className="text-gradient-orange">Digital History</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Own a piece of Houston hip-hop history. Each NFT represents a unique moment 
            in MR. CAP's pioneering journey in Web3.
          </p>
          <MagneticWrapper strength={0.25}>
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
          </MagneticWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

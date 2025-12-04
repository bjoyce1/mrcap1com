import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Palette, ImageIcon, Eye, Grid3x3, ChevronUp, Mail, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import mrCapCoin from "@/assets/mr-cap-coin.png";

// Placeholder artwork data - replace with actual artwork later
const placeholderArtworks: {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aspectRatio: "portrait" | "landscape" | "square";
}[] = [];

const ArtGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-neutral-950/80 selection:text-white overflow-x-hidden">
      {/* Background Image with Mask */}
      <div 
        className="absolute top-0 w-full h-screen -z-10 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(10,10,14,0.9) 70%)`,
          maskImage: "linear-gradient(to bottom, transparent, black 0%, black 40%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 0%, black 40%, transparent)"
        }}
      />

      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? "bg-neutral-950/80 backdrop-blur-xl border-b border-white/10" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-3">
            <img src={mrCapCoin} alt="MR. CAP" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-xl font-medium tracking-tight text-white">
              MR. CAP
            </span>
          </Link>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg">
            <Palette className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline text-neutral-200 text-sm font-medium">Gallery</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden px-6">
        {/* Gradient Atmosphere */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(50% 50% at 50% 30%, rgba(124,58,237,0.3) 0%, transparent 70%)"
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 ring-1 ring-white/10 rounded-full"
          >
            <Palette className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-neutral-300 uppercase tracking-widest font-medium">
              Visual Art Collection
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-semibold text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Gallery</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore the visual art collection of MR. CAP — where Houston hip-hop culture 
            meets creative expression.
          </motion.p>

          {/* Stats Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Available for Commissions
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
              New work coming soon
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portrait Stories Section */}
      <section 
        className="relative py-16 md:py-24 px-6 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)"
        }}
      >
        <div className="max-w-3xl mb-12">
          <h2 
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Portrait Stories
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            A cinematic gallery where the subject stays in focus while
            memories drift softly in the background.
          </p>
        </div>

        {/* Vignette Atmosphere */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
          <div 
            className="absolute inset-0" 
            style={{ background: "radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.06), transparent 60%)" }}
          />
        </div>

        {/* Cinematic Stage - Empty State */}
        <div 
          className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          {placeholderArtworks.length > 0 ? (
            // Future: Carousel of artwork here
            <div className="text-center">Gallery content</div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white/[0.02] backdrop-blur-sm ring-1 ring-white/10 rounded-3xl p-12 max-w-md">
              <div className="w-20 h-20 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-violet-400/50" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                Coming Soon
              </h3>
              <p className="text-neutral-400 text-center font-light">
                Portrait collection is being curated. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Prints Section */}
      <section 
        className="relative py-16 md:py-24 px-6 overflow-hidden"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)"
        }}
      >
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Prints
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            Transform your walls with the beauty of original artwork.
          </p>
          <div className="mt-6">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition"
            >
              View Print Store
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        </div>

        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div 
            className="absolute -top-10 right-0 w-[70%] h-[60%] opacity-30"
            style={{ background: "radial-gradient(80% 60% at 80% 0%, rgba(255,255,255,0.18), transparent 60%)" }}
          />
        </div>

        {/* Three Column Gallery - Empty State */}
        <div className="max-w-6xl mx-auto">
          {placeholderArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Future: Animated columns here */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] backdrop-blur-sm ring-1 ring-white/10 rounded-3xl">
              <div className="w-16 h-16 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-5">
                <Grid3x3 className="w-8 h-8 text-violet-400/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Prints Coming Soon
              </h3>
              <p className="text-neutral-400 text-center font-light max-w-sm">
                High-quality prints will be available for purchase soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Masonry Gallery Section */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] backdrop-blur-sm ring-1 ring-white/10 rounded-full">
              <ImageIcon className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-neutral-400 uppercase tracking-widest font-medium">
                Full Collection
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Masonry Grid - Empty State */}
          {placeholderArtworks.length > 0 ? (
            <div className="masonry-grid">
              {placeholderArtworks.map((artwork) => (
                <div 
                  key={artwork.id}
                  className="masonry-item group"
                >
                  <div className="masonry-inner rounded-2xl overflow-hidden ring-1 ring-white/10 bg-neutral-900/50 shadow-2xl transition-all duration-500">
                    <div className={`relative ${artwork.aspectRatio === "portrait" ? "aspect-[3/4]" : artwork.aspectRatio === "landscape" ? "aspect-[16/10]" : "aspect-square"}`}>
                      <img 
                        src={artwork.imageUrl} 
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay */}
                      <div className="masonry-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <h4 className="text-white font-medium text-lg">{artwork.title}</h4>
                        <p className="text-neutral-300 text-sm mt-1">{artwork.description}</p>
                        <button className="mt-3 inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200 transition">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] backdrop-blur-sm ring-1 ring-white/10 rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-6">
                <Palette className="w-10 h-10 text-violet-400/50" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                Gallery Coming Soon
              </h3>
              <p className="text-neutral-400 text-center max-w-md font-light">
                The full art gallery is being curated. Check back soon to explore MR. CAP's visual art collection.
              </p>
            </div>
          )}

          {placeholderArtworks.length > 0 && (
            <div className="text-center mt-12">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 px-6 py-3 text-sm font-medium tracking-tight transition"
              >
                <Grid3x3 className="w-4 h-4" />
                Explore Full Gallery
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Connect Section */}
      <section 
        className="relative py-24 px-6 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)"
        }}
      >
        {/* Atmosphere */}
        <div 
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
          style={{ 
            background: "radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,0.06), transparent 70%), linear-gradient(120deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)" 
          }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Let's Connect
          </h2>

          {/* Social Chips */}
          <div className="mt-6 mb-8 inline-flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://twitter.com/mrcap1" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-2 text-sm text-neutral-200"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
            <a 
              href="https://instagram.com/mrcapism" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-2 text-sm text-neutral-200"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <Link 
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-2 text-sm text-neutral-200"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </div>

          {/* Card Stack Container */}
          <div className="flex overflow-hidden bg-gradient-to-b from-white/5 to-white/0 h-[50vh] min-h-[400px] border-white/10 border rounded-3xl relative backdrop-blur-sm items-center justify-center">
            {/* Placeholder for card stack - will have artwork */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-violet-400/30" />
              </div>
              <p className="text-neutral-500 text-sm">Featured artwork coming soon</p>
            </div>
          </div>

          {/* Bottom Dock */}
          <div className="mt-8 text-neutral-300 bg-black/50 w-full max-w-4xl rounded-xl ring-white/10 ring-1 mx-auto p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 ring-1 ring-white/10 bg-white/5 text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  contact@mrcap.com
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 ring-1 ring-white/10 bg-white/5 text-xs">
                  <Instagram className="w-3.5 h-3.5" />
                  @mrcapism
                </span>
              </div>
              <button 
                onClick={scrollToTop}
                className="inline-flex gap-1.5 hover:bg-white/10 transition text-xs bg-white/5 ring-white/10 ring-1 rounded-md ml-auto py-1 px-2.5 items-center"
              >
                <span>Scroll to Top</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <span className="hidden sm:inline text-xs text-neutral-400 ml-4">
                © {new Date().getFullYear()} MR. CAP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={mrCapCoin} alt="MR. CAP" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-display text-lg font-medium tracking-tight text-white">
                MR. CAP
              </span>
            </Link>
            <p className="text-sm text-neutral-400">
              South Park Born. Class of '92. Future-Focused.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        
        @media (min-width: 640px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        
        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 3;
          }
        }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
          transform-style: preserve-3d;
        }
        
        .masonry-inner {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        
        .masonry-item:hover .masonry-inner {
          transform: rotateY(-3deg) rotateX(3deg) translateZ(10px);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .masonry-item:hover .masonry-inner {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtGallery;
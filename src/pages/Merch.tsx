import { Helmet } from "react-helmet-async";
import { ParticleHero } from "@/components/merch/ParticleHero";
import { PrintfulProductGrid } from "@/components/merch/PrintfulProductGrid";
import { MerchQualitySection } from "@/components/merch/MerchQualitySection";
import { MerchNewsletterSection } from "@/components/merch/MerchNewsletterSection";
import { MerchFooter } from "@/components/merch/MerchFooter";
import trapUniversityLogo from "@/assets/trap-university-logo.png";

const Merch = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Official Merch | Mr. CAP - Houston Hip-Hop Artist</title>
        <meta name="description" content="Shop exclusive Mr. CAP merchandise. Limited edition apparel, accessories, and collectibles from Houston's innovative hip-hop artist." />
        <meta property="og:title" content="Official Merch | Mr. CAP" />
        <meta property="og:description" content="Shop exclusive Mr. CAP merchandise. Limited edition apparel, accessories, and collectibles." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://mrcap.com/merch" />
      </Helmet>

      <div className="min-h-screen bg-[#020202] text-foreground">
        <ParticleHero
          subtitle="Official Collection"
          description="Exclusive streetwear designed for the culture. Limited drops, unlimited drip."
          primaryButton={{
            text: "Shop Now",
            onClick: scrollToProducts
          }}
          interactiveHint="Move to Interact"
          particleCount={18}
        >
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo as Title */}
            <div className="mb-12">
              <img 
                src={trapUniversityLogo} 
                alt="Trap University" 
                className="w-auto h-32 md:h-48 lg:h-64 xl:h-80 mx-auto drop-shadow-2xl invert"
              />
            </div>
            
            {/* Subtitle */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-thin text-red-200/90 tracking-[0.2em] uppercase">
                Official Collection
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto"></div>
            </div>
            
            {/* Description */}
            <div className="mb-16">
              <p className="text-lg md:text-xl lg:text-2xl text-red-100/60 font-light max-w-3xl mx-auto leading-relaxed">
                Exclusive streetwear designed for the culture. Limited drops, unlimited drip.
              </p>
            </div>
            
            {/* CTA */}
            <div className="space-y-8">
              <button 
                onClick={scrollToProducts}
                className="group relative px-12 py-6 bg-transparent border border-red-500/30 hover:border-red-400 text-red-200 hover:text-white font-medium text-lg tracking-wider uppercase transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/20 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
              
              <div className="flex items-center justify-center gap-6 text-red-400/40 text-sm uppercase tracking-[0.3em]">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-500/30"></div>
                <span className="animate-pulse">Move to Interact</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-500/30"></div>
              </div>
            </div>
          </div>
        </ParticleHero>
        
        <main id="products">
          <PrintfulProductGrid />
          <MerchQualitySection />
          <MerchNewsletterSection />
        </main>

        <MerchFooter />
      </div>
    </>
  );
};

export default Merch;
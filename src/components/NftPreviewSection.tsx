import { Link } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const NftPreviewSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-red-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal width="100%">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Wallet className="w-4 h-4 text-accent" />
              <span className="text-xs uppercase tracking-widest text-accent font-medium">
                Web3 · Live On-Chain
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal width="100%" delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6">
              NFT <span className="text-gradient-gold">Gallery</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal width="100%" delay={0.2}>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Explore MR. CAP's complete NFT collection featuring "The Art of ISM" album,
              exclusive collaborations, and blockchain collectibles. First Houston rap artist
              to sell a Hip Hop NFT on the blockchain.
            </p>
          </ScrollReveal>

          <ScrollReveal width="100%" delay={0.3}>
            <div className="flex justify-center gap-8 md:gap-16 mb-10">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display text-primary">11</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Album Tracks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display text-accent">30+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Collectibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display text-foreground">ETH</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Blockchain</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal width="100%" delay={0.4}>
            <Link
              to="/nft"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground
                         rounded-xl font-medium text-lg transition-all duration-300
                         hover:bg-primary/90 hover:shadow-glow hover:-translate-y-1 card-lift"
            >
              <span>View Full NFT Portfolio</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default NftPreviewSection;

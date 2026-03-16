import { Link } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import nftArtOfIsm from "@/assets/nft-art-of-ism.png";
import nftLimitless from "@/assets/nft-limitless.png";
import limitlessCover from "@/assets/limitless-cover.png";

const highlights = [
  { image: nftArtOfIsm, title: "The Art of ISM Collection", subtitle: "11-track album NFT" },
  { image: nftLimitless, title: "Limitless NFT", subtitle: "Historic Houston NFT" },
  { image: limitlessCover, title: "Limitless Music Video", subtitle: "NFT + Music Video" },
];

const DigitalArtFeature = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Digital Art · On-Chain
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              NFT{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cap-gold">
                Gallery
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              First Houston rap artist to sell a Hip Hop NFT on the blockchain.
              Explore the complete digital art collection.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {highlights.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.12} width="100%">
              <Link to="/nft" className="group block">
                <div className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-border/10 mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center">
          <Button variant="flux" size="lg" className="rounded-full" asChild>
            <Link to="/nft">
              View Full NFT Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigitalArtFeature;

import { Play, Disc3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Mr. CAP - Houston Hip Hop Artist"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Red Glow Effect */}
      <div className="absolute inset-0 z-0 bg-red-glow opacity-50" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              Electronic Press Kit
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-none mb-4 animate-slide-up">
            MR. <span className="text-gradient-red">CAP</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Artist • Storyteller • Technologist • <span className="text-cap-gold">South Park Coalition</span> Original Member
          </p>

          {/* Tagline */}
          <p className="text-sm uppercase tracking-[0.2em] text-cap-gold font-medium mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Bet'n On Me. Bet'n On Truth. Bet'n On Legacy.
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            Mr. CAP is not just another rapper in the game — he's a Houston original, 
            South Park Coalition veteran, and a creative architect building his own universe 
            across music, media, tech, and blockchain.
          </p>

          {/* Album Announcement */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Disc3 className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-sm">
              New Album · <span className="text-foreground font-medium">The Ties That Bind Us</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <Button variant="hero" size="lg">
              <Play className="w-4 h-4" />
              Listen to "Bet'n On Me"
            </Button>
            <Button variant="heroOutline" size="lg">
              <Disc3 className="w-4 h-4" />
              Stream The Album
            </Button>
            <Button variant="glowRed" size="lg" asChild>
              <a href="#contact">
                <Mail className="w-4 h-4" />
                Book Mr. CAP
              </a>
            </Button>
          </div>
        </div>

        {/* SPC Badge */}
        <div className="absolute bottom-8 right-4 md:right-8 hidden md:block animate-float">
          <div className="bg-card/80 backdrop-blur-lg border border-border rounded-2xl px-6 py-4 shadow-glow">
            <p className="font-display text-lg text-foreground">
              South Park Coalition
            </p>
            <p className="text-sm text-muted-foreground">Houston, TX</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;

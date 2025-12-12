import { Play, Disc3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-95 scale-110"
        >
          <source src="/video/hero-bg.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/45 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/40" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Orange Glow Effect with Parallax */}
      <div 
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"
        style={{ transform: `translate(50%, calc(-50% + ${scrollY * 0.2}px))` }}
      />

      {/* Content with Reverse Parallax */}
      <div 
        className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-32 md:py-40"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Electronic Press Kit
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tighter leading-[0.95] text-foreground mb-6 text-glow animate-slide-up">
            South Park Born.<br />
            <span className="text-primary">SPC Raised</span><br />
            Future-Focused.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8 animate-slide-up font-light" style={{
            animationDelay: "0.1s"
          }}>
            Mr. CAP is an original South Park Coalition member, rapper, writer, and technologist bridging Houston's underground roots with tomorrow's tech.
          </p>

          {/* Album & Single Announcements */}
          <div className="flex flex-wrap items-center gap-3 mb-10 animate-slide-up" style={{
            animationDelay: "0.2s"
          }}>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-full">
              <Disc3 className="w-4 h-4 text-primary animate-spin" style={{
                animationDuration: "3s"
              }} />
              <span className="text-sm text-muted-foreground">
                SPC Album · <span className="text-foreground font-medium">The Ties That Bind Us</span>
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-sm text-primary font-medium">
                🔥 New Single: Dippin Thru the Metaverse
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{
            animationDelay: "0.3s"
          }}>
            <Button variant="flux" size="lg">
              <Play className="w-4 h-4" />
              Stream "Bet'n On Me"
            </Button>
            <Button variant="fluxOutline" size="lg">
              <Disc3 className="w-4 h-4" />
              Explore The Ties That Bind Us
            </Button>
            <Button variant="fluxGhost" size="lg" asChild>
              <a href="#contact">
                <Mail className="w-4 h-4" />
                Book Mr. CAP
              </a>
            </Button>
          </div>
        </div>

        {/* SPC Badge */}
        <div 
          className="absolute bottom-8 right-6 md:right-8 hidden md:block animate-float"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <div className="bg-white/[0.02] backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4">
            <p className="font-display text-lg font-medium text-foreground tracking-tight">
              South Park Coalition
            </p>
            <p className="text-sm text-muted-foreground">Houston, TX • Original Member</p>
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
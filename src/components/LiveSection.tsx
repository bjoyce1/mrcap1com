import { Mic2, MapPin, Users, CheckCircle, Calendar, Clock, Ticket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import spcPoster from "@/assets/spc-austin-2025.png";

const LiveSection = () => {
  const highlights = [
    "Longtime member and performer with South Park Coalition (SPC)",
    "Appearances across Texas: Houston, Austin, San Antonio, Killeen, and more",
    "Live performances alongside Point Blank, K-Rino, Klondike Kat",
    "Themed events, birthday bashes, and special guest appearances",
  ];

  const technicalRequirements = [
    "2–3 quality vocal microphones (Shure SM58 or equivalent)",
    "Professional sound system with competent engineer",
    "Stereo playback via DJ controller or laptop (USB or auxiliary)",
    "Minimum stage area suitable for full movement and interaction",
  ];

  return (
    <section id="live" className="section-spacing relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[1px] bg-primary" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
              On Stage
            </span>
          </div>
          <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl tracking-tight">
            Live Performances & <span className="text-gradient-gold">Touring</span>
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-balance">
            On stage, Mr. CAP operates with veteran control and underground energy. 
            Whether it's a club, theater, or festival setting, he brings sharp delivery, 
            crowd connection, and a catalog that hits from intro to encore.
          </p>
        </div>

        {/* Featured Upcoming Show — Cinematic full-width poster */}
        <div className="mb-16 rounded-2xl overflow-hidden relative min-h-[400px] md:min-h-[500px] group">
          {/* Background poster */}
          <img 
            src={spcPoster} 
            alt="South Park Coalition Live in Concert - December 13, 2025 at Flamingo Cantina" 
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Content overlay */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full min-h-[400px] md:min-h-[500px]">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-full w-fit mb-4 animate-pulse">
              Upcoming Show
            </span>
            
            <h3 className="font-editorial text-3xl md:text-5xl mb-2">
              South Park Coalition <span className="text-primary">Live</span>
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-cap-gold font-medium mb-6">
              The Bet'n On Me Tour
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cap-gold" />
                <span className="text-sm">Dec 13, 2025</span>
              </div>
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cap-gold" />
                <span className="text-sm">Doors at 8 PM</span>
              </div>
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cap-gold" />
                <span className="text-sm">Flamingo Cantina, Austin TX</span>
              </div>
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cap-gold" />
                <span className="text-sm">$20–$25</span>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-fit rounded-full px-8" asChild>
              <a href="https://spcatx2025.lovable.app/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Get Tickets & Event Details
              </a>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Highlights */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-editorial text-2xl">Performance Highlights</h3>
            </div>

            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cap-gold shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="font-editorial text-lg mb-3">Performance Style</h4>
              <p className="text-sm text-muted-foreground leading-relaxed text-balance">
                Expect a set that blends storytelling, street anthems, and reflective records, 
                supported by professional show pacing, call-and-response moments, and crowd-ready hooks.
              </p>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cap-gold/15 flex items-center justify-center">
                <Users className="w-5 h-5 text-cap-gold" />
              </div>
              <h3 className="font-editorial text-2xl">Technical Rider</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Short summary of technical requirements. Full rider available upon request.
            </p>

            <ul className="space-y-4 mb-8">
              {technicalRequirements.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" className="w-full rounded-full" asChild>
              <a href="#contact">
                <MapPin className="w-4 h-4" />
                Request Full Rider & Availability
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
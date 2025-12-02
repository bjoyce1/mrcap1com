import { Mic2, MapPin, Users, CheckCircle, Calendar, Clock, Ticket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section id="live" className="py-24 md:py-32 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            On Stage
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Live Performances & <span className="text-gradient-gold">Touring</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            On stage, Mr. CAP operates with veteran control and underground energy. 
            Whether it's a club, theater, or festival setting, he brings sharp delivery, 
            crowd connection, and a catalog that hits from intro to encore.
          </p>
        </div>

        {/* Featured Upcoming Show */}
        <div className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-cap-gold/10 to-transparent border border-primary/30 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-full animate-pulse">
              Upcoming Show
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-cap-gold font-medium">
                The Bet'n On Me Tour
              </span>
              <h3 className="font-display text-3xl md:text-4xl mt-2 mb-4">
                South Park Coalition <span className="text-primary">Live in Concert</span>
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-cap-gold" />
                  <span>Saturday, December 13, 2025</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5 text-cap-gold" />
                  <span>Doors Open at 8:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-cap-gold" />
                  <div>
                    <span className="block">Flamingo Cantina</span>
                    <span className="text-sm text-muted-foreground/70">515 E 6th St, Austin, TX 78701</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Ticket className="w-5 h-5 text-cap-gold" />
                  <span>$25 Early Bird / $20 Online</span>
                </div>
              </div>

              <Button variant="hero" size="lg" asChild>
                <a href="https://spcatx2025.lovable.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Get Tickets & Event Details
                </a>
              </Button>
            </div>

            <div className="hidden md:block text-center">
              <div className="inline-block p-6 rounded-xl bg-background/50 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Performing alongside</p>
                <p className="font-display text-xl text-foreground">K-Rino • Point Blank • Klondike Kat</p>
                <p className="text-xs text-muted-foreground mt-2">& More SPC Legends</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Performance Highlights */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl">Performance Highlights</h3>
            </div>

            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cap-gold shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 rounded-xl bg-card-gradient border border-border">
              <h4 className="font-display text-xl mb-3">Performance Style</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Expect a set that blends storytelling, street anthems, and reflective records, 
                supported by professional show pacing, call-and-response moments, and crowd-ready hooks.
              </p>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cap-gold/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-cap-gold" />
              </div>
              <h3 className="font-display text-2xl">Technical Rider</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Short summary of technical requirements. Full rider available upon request.
            </p>

            <ul className="space-y-4 mb-8">
              {technicalRequirements.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" className="w-full" asChild>
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

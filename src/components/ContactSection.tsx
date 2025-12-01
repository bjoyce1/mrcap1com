import { Mail, Phone, Globe, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-section-gradient">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Get In Touch
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Booking & <span className="text-gradient-gold">Contact</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            For live performances, features, interviews, speaking engagements, 
            sync licensing, or business inquiries.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Booking & Business */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl">Booking & Business</h3>
                <p className="text-xs text-muted-foreground">South Park Coalition LLC</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground">Reginald Gilliand</p>
                <p className="text-sm text-muted-foreground">Executive Producer / Co-CEO</p>
              </div>

              <a
                href="mailto:pointblank@southparkcoalitionllc.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                pointblank@southparkcoalitionllc.com
              </a>

              <a
                href="tel:7135503001"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                713-550-3001
              </a>
            </div>
          </div>

          {/* Artist Contact */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8 hover:border-cap-gold/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cap-gold/20 flex items-center justify-center">
                <User className="w-6 h-6 text-cap-gold" />
              </div>
              <div>
                <h3 className="font-display text-xl">Artist Contact</h3>
                <p className="text-xs text-muted-foreground">Direct Inquiries</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground">Cornelius A. Pratt (Mr. CAP)</p>
                <p className="text-sm text-muted-foreground">Executive Producer / Co-CEO</p>
              </div>

              <a
                href="mailto:mrcap@southparkcoalitionllc.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-cap-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                mrcap@southparkcoalitionllc.com
              </a>

              <a
                href="tel:8327744473"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-cap-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                832-774-4473
              </a>

              <a
                href="https://www.mrcap1.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-cap-gold transition-colors"
              >
                <Globe className="w-4 h-4" />
                www.mrcap1.com
              </a>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">Performance Deposits & Payments:</span>
          </p>
          <p className="text-xs text-muted-foreground">
            CashApp: <span className="font-mono text-foreground">$ReginaldGilliand</span>
            {" · "}
            Zelle: <span className="font-mono text-foreground">832-889-8677</span>
            {" "}(Wreckless Entertainment)
          </p>
        </div>

        {/* Send Message CTA */}
        <div className="mt-12 text-center">
          <Button variant="hero" size="xl" asChild>
            <a href="mailto:mrcap@southparkcoalitionllc.com">
              <Mail className="w-5 h-5" />
              Send a Message
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import { Mail, Phone, Globe, User, Briefcase } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import NewsletterSignup from "@/components/NewsletterSignup";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-white/[0.01] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Get In Touch
            </span>
            <span className="w-8 h-[1px] bg-primary" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-medium tracking-tight">
            Booking & <span className="text-gradient-orange">Contact</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-light">
            For live performances, features, interviews, speaking engagements, 
            sync licensing, or business inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 md:p-8">
            <h3 className="font-display text-2xl font-medium tracking-tight mb-6">
              Submit a Booking Request
            </h3>
            <BookingForm />
          </div>

          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-6">
              {/* Booking & Business */}
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight">Booking & Business</h3>
                    <p className="text-xs text-muted-foreground">South Park Coalition LLC</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Reginald Gilliand</p>
                    <p className="text-xs text-muted-foreground">Executive Producer / Co-CEO</p>
                  </div>

                  <a
                    href="mailto:pointblank@southparkcoalitionllc.com"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    pointblank@southparkcoalitionllc.com
                  </a>

                  <a
                    href="tel:7135503001"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    713-550-3001
                  </a>
                </div>
              </div>

              {/* Artist Contact */}
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight">Artist Contact</h3>
                    <p className="text-xs text-muted-foreground">Direct Inquiries</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Cornelius A. Pratt (Mr. CAP)</p>
                    <p className="text-xs text-muted-foreground">Executive Producer / Co-CEO</p>
                  </div>

                  <a
                    href="mailto:mrcap@southparkcoalitionllc.com"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    mrcap@southparkcoalitionllc.com
                  </a>

                  <a
                    href="tel:8327744473"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    832-774-4473
                  </a>

                  <a
                    href="https://www.mrcap1.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    www.mrcap1.com
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <NewsletterSignup source="contact-page" variant="hero" />

            {/* Payment Info */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Performance Deposits & Payments:</span>
              </p>
              <p className="text-xs text-muted-foreground">
                CashApp: <span className="font-mono text-foreground">$CorneliusAPratt</span>
                {" · "}
                Zelle: <span className="font-mono text-foreground">713-423-5333</span>
                {" "}(Cap Distributions)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

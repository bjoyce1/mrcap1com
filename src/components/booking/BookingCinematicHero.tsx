import { useEffect, useRef } from "react";
import { Calendar, Mail, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import heroBg from "@/assets/hero-bg.webp";

const STATS = [
  { icon: Award, label: "30+ Years on Stage" },
  { icon: MapPin, label: "Texas & Beyond" },
  { icon: Clock, label: "Fast Response" },
];

/**
 * The booking pitch — a full-bleed stage-lit hero with parallax,
 * staggered slab type, and a magnetic CTA straight to the form.
 */
const BookingCinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".booking-reveal", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".booking-reveal",
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.14, ease: "power3.out", delay: 0.2 }
      );

      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[86vh] flex items-end overflow-hidden grain-overlay"
    >
      {/* Stage-lit backdrop */}
      <div ref={bgRef} className="absolute -inset-y-12 inset-x-0 will-change-transform">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_100%)]" />
      </div>

      {/* Gold spotlight sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] rotate-[24deg] bg-[linear-gradient(90deg,transparent_45%,hsl(var(--accent-gold)/0.08)_50%,transparent_55%)] animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 md:pb-24 pt-40">
        <p className="booking-reveal catalog-stamp mb-4">Live Shows · Features · Speaking</p>

        <h1 className="booking-reveal font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] text-foreground max-w-3xl">
          Bring the ISM
          <br />
          <span className="text-gradient-gold">to Your Stage.</span>
        </h1>

        <p className="booking-reveal mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Three decades of Houston hip-hop, live and direct. Concerts, festivals,
          features, and speaking engagements — booked straight with the artist's team.
        </p>

        <div className="booking-reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {STATS.map(({ icon: Icon, label }, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-foreground/70"
            >
              <Icon className="w-4 h-4 text-gold" />
              {label}
            </span>
          ))}
        </div>

        <div className="booking-reveal mt-10 flex flex-wrap items-center gap-4">
          <MagneticWrapper strength={0.15}>
            <Button
              size="lg"
              onClick={scrollToForm}
              className="candy-sheen rounded-full text-primary-foreground font-semibold uppercase tracking-wider px-10 py-6 text-sm shadow-[0_0_40px_hsl(var(--primary)/0.25)] cursor-pointer"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Start a Booking
            </Button>
          </MagneticWrapper>
          <MagneticWrapper strength={0.15}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-foreground/20 text-foreground/80 hover:border-[hsl(var(--accent-gold))] hover:text-foreground font-medium uppercase tracking-wider px-8 py-6 text-sm transition-all duration-500"
              asChild
            >
              <a href="mailto:wrecklessent@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Email the Team
              </a>
            </Button>
          </MagneticWrapper>
        </div>
      </div>
    </section>
  );
};

export default BookingCinematicHero;

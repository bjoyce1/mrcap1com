import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

interface EPKLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  tagline: string;
  ctaLabel?: string;
  ctaEmail?: string;
  breadcrumb: string;
}

const EPKLayout = ({
  children,
  title,
  subtitle,
  tagline,
  ctaLabel = "Get in Touch",
  ctaEmail = "southparkcoalitionllc@gmail.com",
  breadcrumb,
}: EPKLayoutProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerCtaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll('.gsap-hero-item');
        gsap.fromTo(
          heroElements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Content section animations
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('.gsap-section');
        sections.forEach((section) => {
          const items = section.querySelectorAll('.gsap-item');
          gsap.fromTo(
            items,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      // Footer CTA animation
      if (footerCtaRef.current) {
        const footerItems = footerCtaRef.current.querySelectorAll('.gsap-footer-item');
        gsap.fromTo(
          footerItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerCtaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 md:py-28 border-b border-border/50 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative">
            {/* Breadcrumb */}
            <nav className="gsap-hero-item flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/epk" className="hover:text-primary transition-colors">EPK</Link>
              {breadcrumb !== "EPK" && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground">{breadcrumb}</span>
                </>
              )}
            </nav>

            <div className="max-w-4xl">
              {/* Tagline Badge */}
              <span className="gsap-hero-item inline-block text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 px-3 py-1 border border-primary/30 rounded-full">
                {tagline}
              </span>

              {/* Headline */}
              <h1 className="gsap-hero-item text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="gsap-hero-item text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                {subtitle}
              </p>

              {/* Primary CTA */}
              <div className="gsap-hero-item">
                <Button variant="flux" size="lg" asChild>
                  <a href={`mailto:${ctaEmail}?subject=${encodeURIComponent(ctaLabel)}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    {ctaLabel}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Page Content */}
        <div ref={contentRef}>
          {children}
        </div>

        {/* Footer CTA */}
        <section ref={footerCtaRef} className="py-20 bg-card/30 border-t border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="gsap-footer-item text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="gsap-footer-item text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's create something memorable. Reach out to discuss your project.
            </p>
            <div className="gsap-footer-item">
              <Button variant="flux" size="lg" asChild>
                <a href={`mailto:${ctaEmail}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Now
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EPKLayout;
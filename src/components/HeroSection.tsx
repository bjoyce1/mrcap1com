import { Play, Disc3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const spcBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headingRef.current, subtitleRef.current, badgesRef.current, ctaRef.current], {
        y: 80,
        opacity: 0,
      });
      gsap.set(spcBadgeRef.current, { x: 100, opacity: 0 });

      // Hero content entrance animation
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
      })
        .to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          badgesRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          spcBadgeRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        );

      // Video parallax on scroll
      gsap.to(videoRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Content parallax (moves up slower)
      gsap.to(contentRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // SPC badge parallax
      gsap.to(spcBadgeRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Heading text scale on scroll
      gsap.to(headingRef.current, {
        scale: 0.95,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with GSAP Parallax */}
      <div ref={videoRef} className="absolute inset-0 z-0 will-change-transform">
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
      <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none" />

      {/* Orange Glow Effect */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Content with GSAP Parallax */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-32 md:py-40 will-change-transform"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Electronic Press Kit
            </span>
          </div>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="font-display text-5xl md:text-7xl lg:text-[6rem] font-extrabold uppercase tracking-wide leading-[0.95] text-foreground mb-6 text-glow will-change-transform"
          >
            South Park Born.<br />
            <span className="text-primary">SPC Raised</span><br />
            Future-Focused.
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8 font-light will-change-transform"
          >
            Mr. CAP is an original South Park Coalition member, rapper, writer, and technologist bridging Houston's underground roots with tomorrow's tech.
          </p>

          {/* Album & Single Announcements */}
          <div ref={badgesRef} className="flex flex-wrap items-center gap-3 mb-10 will-change-transform">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-full">
              <Disc3
                className="w-4 h-4 text-primary animate-spin"
                style={{ animationDuration: "3s" }}
              />
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
          <div ref={ctaRef} className="flex flex-wrap gap-4 will-change-transform">
            <MagneticWrapper strength={0.2}>
              <Button variant="flux" size="lg">
                <Play className="w-4 h-4" />
                Stream "Bet'n On Me"
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button variant="fluxOutline" size="lg">
                <Disc3 className="w-4 h-4" />
                Explore The Ties That Bind Us
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button variant="fluxGhost" size="lg" asChild>
                <a href="#contact">
                  <Mail className="w-4 h-4" />
                  Book Mr. CAP
                </a>
              </Button>
            </MagneticWrapper>
          </div>
        </div>

        {/* SPC Badge */}
        <div
          ref={spcBadgeRef}
          className="absolute bottom-8 right-6 md:right-8 hidden md:block will-change-transform"
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

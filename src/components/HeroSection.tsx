import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";

const heroImage = "/images/mrcap-hero-bg.webp";

const HeroSection = () => {
  const [glitching, setGlitching] = useState(false);
  const [scrollHintHidden, setScrollHintHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const releaseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTitleHover = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 1200);
  };

  // 3D tilt on title
  const handleTitleTilt = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const el = nameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotationY: x * 8,
      rotationX: -y * 6,
      transformPerspective: 1000,
      duration: 0.5,
      ease: "power2.out",
      transformOrigin: "center",
    });
  };
  const handleTitleTiltLeave = () => {
    if (!nameRef.current) return;
    gsap.to(nameRef.current, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  // Hide scroll hint after small scroll
  useEffect(() => {
    const onScroll = () => setScrollHintHidden(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: 1.1, autoAlpha: 0 });
      gsap.set(nameRef.current, { y: 60, autoAlpha: 0 });
      gsap.set(releaseRef.current, { y: 40, autoAlpha: 0 });
      gsap.set(ctaRef.current, { y: 30, autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(imageRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.4,
        ease: "power3.out",
      })
        .to(
          nameRef.current,
          { y: 0, autoAlpha: 1, duration: 1, ease: "power4.out" },
          "-=0.8"
        )
        .to(
          releaseRef.current,
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .to(
          ctaRef.current,
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        );

      // Background parallax — moves faster (deeper layer)
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Content parallax — moves slower (foreground layer, creates depth)
      gsap.to(contentRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.to(gradientRef.current, {
        "--gradient-position": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
        onUpdate: function() {
          const progress = this.progress();
          const opacity = 0.3 + progress * 0.35;
          if (gradientRef.current) {
            gradientRef.current.style.opacity = opacity.toString();
          }
        },
      } as any);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden grain-overlay"
    >
      {/* Full-bleed Background Image — deep parallax layer */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={heroImage}
          alt="Mr. CAP"
          className="h-full w-full object-cover object-top"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent opacity-30 will-change-opacity"
        />
      </div>

      {/* Diagonal gold light beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] rotate-[20deg] bg-[linear-gradient(90deg,transparent_45%,hsl(var(--primary)/0.08)_50%,transparent_55%)] animate-pulse-slow" />
      </div>

      {/* Centered Bottom Content — foreground parallax layer */}
      <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-20 md:pb-28 will-change-transform">
        <h1
          ref={nameRef}
          onMouseEnter={handleTitleHover}
          onMouseMove={handleTitleTilt}
          onMouseLeave={handleTitleTiltLeave}
          className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-extrabold uppercase tracking-tight will-change-transform cursor-pointer transition-none ${
            glitching ? "animate-glitch" : ""
          }`}
          style={{ 
            color: "hsl(43, 91%, 61%)",
            letterSpacing: "-0.02em",
            transformStyle: "preserve-3d",
          }}
        >
          Mr. CAP
        </h1>

        <p className="mt-3 text-sm md:text-base font-medium tracking-[0.15em] uppercase text-foreground/60 will-change-transform">
          Houston Hip-Hop Artist · South Park Coalition
        </p>
        <div
          ref={releaseRef}
          className="mt-4 flex items-center gap-3 text-xs md:text-sm font-medium tracking-[0.2em] uppercase will-change-transform"
        >
          <span className="text-foreground/90">The Art of ISM - Book</span>
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span className="text-foreground/50">Out Now</span>
        </div>

        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-4 will-change-transform">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticWrapper strength={0.15}>
              <Button
                size="lg"
                className="rounded-full bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/50 font-semibold uppercase tracking-wider px-10 py-6 text-sm transition-all duration-500 shadow-[0_0_30px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.2)]"
                asChild
              >
                <a href="/discography">
                  <Play className="mr-2 h-4 w-4" />
                  Stream the Music
                </a>
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.15}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 text-foreground/80 hover:border-primary/40 hover:text-foreground font-medium uppercase tracking-wider px-8 py-6 text-sm transition-all duration-500"
                asChild
              >
                <a href="/videos">
                  Watch Videos
                </a>
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.15}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 text-foreground/80 hover:border-primary/40 hover:text-foreground font-medium uppercase tracking-wider px-8 py-6 text-sm transition-all duration-500"
                asChild
              >
                <a href="/booking">
                  Book Mr. CAP
                </a>
              </Button>
            </MagneticWrapper>
          </div>
          <MagneticWrapper strength={0.15}>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-foreground/50 hover:text-primary font-medium uppercase tracking-wider text-xs transition-all duration-500"
              asChild
            >
              <a href="#fan-capture">
                Join the Legacy List →
              </a>
            </Button>
          </MagneticWrapper>
        </div>
      </div>

      {/* Scroll-to-explore hint */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-500 ${
          scrollHintHidden ? "opacity-0 pointer-events-none" : "opacity-60"
        }`}
      >
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-foreground/60">
          Scroll to Explore
        </span>
        <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import heroImage from "@/assets/mrcap-hero-bg.jpg";

const HeroSection = () => {
  const [glitching, setGlitching] = useState(false);
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent opacity-30 will-change-opacity"
        />
      </div>

      {/* Centered Bottom Content — foreground parallax layer */}
      <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-20 md:pb-28 will-change-transform">
        <h1
          ref={nameRef}
          onMouseEnter={handleTitleHover}
          className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-extrabold uppercase tracking-tight will-change-transform cursor-pointer transition-none ${
            glitching ? "animate-glitch" : ""
          }`}
          style={{ 
            color: "hsl(43, 91%, 61%)",
            letterSpacing: "-0.02em",
          }}
        >
          Mr. CAP
        </h1>

        <div
          ref={releaseRef}
          className="mt-5 flex items-center gap-3 text-sm md:text-base font-medium tracking-[0.2em] uppercase will-change-transform"
        >
          <span className="text-foreground/90">The Ties That Bind Us</span>
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span className="text-foreground/50">Out Now</span>
        </div>

        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center gap-4 will-change-transform">
          <MagneticWrapper strength={0.15}>
            <Button
              size="lg"
              className="rounded-full bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/50 font-semibold uppercase tracking-wider px-10 py-6 text-sm transition-all duration-500 shadow-[0_0_30px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.2)]"
              asChild
            >
              <a href="/music">
                <Play className="mr-2 h-4 w-4" />
                Listen Now
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
              <a href="#fan-capture">
                Join Mr. CAP Legacy
              </a>
            </Button>
          </MagneticWrapper>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-pulse-slow">
        <div className="w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;

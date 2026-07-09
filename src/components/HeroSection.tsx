import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";

const CoinHero3D = lazy(() => import("@/components/home/CoinHero3D"));

const heroImage = "/images/mrcap-hero-bg.webp";

const TITLE = "MR. CAP";

const HeroSection = () => {
  const [glitching, setGlitching] = useState(false);
  const [scrollHintHidden, setScrollHintHidden] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const releaseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

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
      rotationY: x * 10,
      rotationX: -y * 8,
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

  // Mount the 3D layer after first paint so LCP stays fast
  useEffect(() => {
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback(cb, { timeout: 2500 })
        : setTimeout(cb, 800);
    idle(() => setShow3D(true));
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const chars = nameRef.current?.querySelectorAll(".hero-char");

      if (reduced) {
        gsap.set([imageRef.current, taglineRef.current, releaseRef.current, ctaRef.current], {
          autoAlpha: 1,
        });
        if (chars) gsap.set(chars, { autoAlpha: 1, y: 0, rotationX: 0 });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.15, autoAlpha: 0 });
      if (chars) gsap.set(chars, { y: 120, rotationX: -90, autoAlpha: 0 });
      gsap.set(taglineRef.current, { y: 24, autoAlpha: 0 });
      gsap.set(releaseRef.current, { y: 24, autoAlpha: 0 });
      gsap.set(ctaRef.current, { y: 24, autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(imageRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.6,
        ease: "power3.out",
      });

      if (chars) {
        tl.to(
          chars,
          {
            y: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 1.1,
            stagger: 0.06,
            ease: "power4.out",
          },
          "-=1.0"
        );
      }

      tl.to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .to(releaseRef.current, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, "-=0.45");

      // Light beam sweep across the hero once on load
      if (beamRef.current) {
        gsap.fromTo(
          beamRef.current,
          { xPercent: -120 },
          { xPercent: 120, duration: 2.4, ease: "power2.inOut", delay: 0.6 }
        );
      }

      // Background parallax — deep layer moves faster
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

      // Foreground content drifts slower and fades as you leave
      gsap.to(contentRef.current, {
        yPercent: -18,
        autoAlpha: 0.15,
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
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-top"
          decoding="async"
          {...({ fetchpriority: "high" } as any)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
      </div>

      {/* Three.js layer — gold coin + particles, pure atmosphere */}
      {show3D && (
        <Suspense fallback={null}>
          <CoinHero3D />
        </Suspense>
      )}

      {/* Cinematic light beam sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-[6]">
        <div
          ref={beamRef}
          className="absolute inset-y-0 w-full bg-[linear-gradient(105deg,transparent_42%,hsl(var(--accent-gold)/0.12)_50%,transparent_58%)]"
        />
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] rotate-[20deg] bg-[linear-gradient(90deg,transparent_45%,hsl(var(--primary)/0.07)_50%,transparent_55%)] animate-pulse-slow" />
      </div>

      {/* Centered Bottom Content — foreground parallax layer */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-20 md:pb-24 will-change-transform"
      >
        <h1
          ref={nameRef}
          onMouseEnter={handleTitleHover}
          onMouseMove={handleTitleTilt}
          onMouseLeave={handleTitleTiltLeave}
          aria-label="Mr. CAP"
          className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] will-change-transform cursor-pointer select-none ${
            glitching ? "animate-glitch" : ""
          }`}
          style={{
            color: "hsl(38, 33%, 89%)",
            letterSpacing: "0",
            lineHeight: "1.05",
            transformStyle: "preserve-3d",
            perspective: "800px",
            textShadow: "0 0 80px hsl(333 64% 51% / 0.25)",
          }}
        >
          {TITLE.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="hero-char inline-block will-change-transform"
              style={{ transformOrigin: "bottom center", whiteSpace: "pre" }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p
          ref={taglineRef}
          className="mt-3 px-6 text-center text-sm md:text-base font-medium tracking-[0.15em] uppercase text-foreground/60 will-change-transform"
        >
          Houston Hip-Hop Artist · South Park Coalition
        </p>
        <div
          ref={releaseRef}
          className="mt-4 flex items-center gap-3 text-xs md:text-sm font-medium tracking-[0.2em] uppercase will-change-transform"
        >
          <span className="text-foreground/90">The Art of ISM - Book</span>
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-gold">Out Now</span>
        </div>

        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-4 will-change-transform">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticWrapper strength={0.15}>
              <Button
                size="lg"
                className="rounded-full bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/50 font-semibold uppercase tracking-wider px-10 py-6 text-sm transition-all duration-500 shadow-[0_0_30px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.2)]"
                asChild
              >
                <a href="/mr-cap-discography">
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
                <a href="/videos">Watch Videos</a>
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.15}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 text-foreground/80 hover:border-primary/40 hover:text-foreground font-medium uppercase tracking-wider px-8 py-6 text-sm transition-all duration-500"
                asChild
              >
                <a href="/booking">Book Mr. CAP</a>
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
              <a href="#fan-capture">Join the Legacy List →</a>
            </Button>
          </MagneticWrapper>
        </div>
      </div>

      {/* Scroll-to-explore hint */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 transition-opacity duration-500 ${
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

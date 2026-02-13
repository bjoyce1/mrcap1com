import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import heroImage from "@/assets/mrcap-hero-bg.jpg";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const releaseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });
      gsap.set(nameRef.current, { y: 60, opacity: 0 });
      gsap.set(releaseRef.current, { y: 40, opacity: 0 });
      gsap.set(ctaRef.current, { y: 30, opacity: 0 });

      // Hero entrance animation timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
      })
        .to(
          nameRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.8"
        )
        .to(
          releaseRef.current,
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
        );

      // Subtle parallax on scroll
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // No separate name parallax — let it stay anchored with release info to avoid overlap

      // Animated gradient overlay based on scroll
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
          const opacity = 0.3 + progress * 0.35; // opacity shifts from 30% to 65%
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
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full-bleed Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={heroImage}
          alt="Mr. CAP"
          className="h-full w-full object-cover object-top"
        />
        {/* Subtle bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Animated gradient overlay */}
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-30 will-change-opacity"
        />
      </div>

      {/* Centered Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-16 md:pb-24">
        {/* Artist Name - Bold, Centered */}
        <h1
          ref={nameRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold uppercase tracking-wider text-cap-gold will-change-transform"
          style={{ color: "hsl(43, 91%, 61%)" }}
        >
          Mr. CAP
        </h1>

        {/* Release Info */}
        <div
          ref={releaseRef}
          className="mt-4 flex items-center gap-3 text-sm md:text-base font-medium tracking-widest uppercase will-change-transform"
        >
          <span className="text-foreground font-bold">The Ties That Bind Us</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">Out Now</span>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="mt-8 will-change-transform">
          <MagneticWrapper strength={0.15}>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/80 bg-foreground/10 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background font-semibold uppercase tracking-wider px-8 py-6 text-sm transition-all duration-300"
              asChild
            >
              <a
                href="https://www.sound.xyz/mrcap/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 h-4 w-4" />
                Listen Now
              </a>
            </Button>
          </MagneticWrapper>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-pulse-slow">
        <div className="w-px h-8 bg-gradient-to-b from-foreground/50 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;

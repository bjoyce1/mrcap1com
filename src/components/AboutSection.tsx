import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const stats = [
  { number: "30+", label: "Years in the Game" },
  { number: "100+", label: "Tracks Released" },
  { number: "1st", label: "Houston NFT Rapper" },
  { number: "Emmy", label: "Award Contributor" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      const bioParagraphs = bioRef.current?.querySelectorAll("p");
      if (bioParagraphs) {
        gsap.fromTo(bioParagraphs, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: bioRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        });
      }

      gsap.fromTo(quoteRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, {
        clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.2, ease: "power4.inOut",
        scrollTrigger: { trigger: quoteRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      });

      const statCards = statsRef.current?.querySelectorAll(".stat-card");
      if (statCards) {
        gsap.fromTo(statCards, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }

      if (bgImageRef.current) {
        gsap.fromTo(bgImageRef.current, { y: -50 }, {
          y: 50, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-spacing relative overflow-hidden"
    >
      {/* Background Image with Fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          ref={bgImageRef}
          src="/images/about-bg.png" 
          alt="" 
          className="absolute right-0 top-0 h-[120%] w-auto object-cover object-left opacity-90 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 will-change-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[1px] bg-primary" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
              Biography
            </span>
          </div>
          <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl tracking-tight">
            About <span className="text-gradient-orange">Mr. CAP</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Main Bio — Asymmetric wider */}
          <div ref={bioRef} className="lg:col-span-3 space-y-6">
            <p className="text-lg md:text-xl text-foreground leading-relaxed font-light will-change-transform text-balance">
              <span className="text-primary font-medium">Mr. CAP</span> (born Cornelius A. Pratt, April 5, 1973) is a Houston-based
              rapper, entrepreneur, and media producer whose career spans decades within the Southern hip hop underground. 
              Raised in Houston's Third Ward, he began performing at a young age and later became an original member of the 
              South Park Coalition, one of Texas' most enduring independent hip hop collectives.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform text-balance">
              Known for narrative-driven lyricism and Houston-rooted authenticity, Mr. CAP has released solo and 
              collaborative projects while maintaining a strong presence in the city's cultural ecosystem. His work 
              has been covered by major outlets including{" "}
              <span className="text-foreground">Houston Press</span> and{" "}
              <span className="text-foreground">Houston Chronicle</span>, documenting both his musical output and 
              long-standing role in Houston hip hop.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform text-balance">
              Beyond music, Mr. CAP contributed to the documentary{" "}
              <span className="italic text-foreground">"The Life: Sex Trafficking and Modern-Day Slavery"</span>, 
              which won a <span className="text-primary font-medium">Lone Star Emmy Award</span>. He was also honored during the 
              50th Anniversary of Hip Hop by Broadcast Houston and received a{" "}
              <span className="text-foreground">Certificate of Congressional Recognition</span> from Congresswoman Sheila Jackson Lee.
            </p>

            {/* Pull Quote */}
            <blockquote ref={quoteRef} className="border-l-2 border-primary pl-8 py-6 my-10 will-change-transform">
              <p className="text-xl md:text-2xl text-foreground italic font-light leading-relaxed">
                "These recognitions reflect not just music, but years of cultural contribution and storytelling."
              </p>
              <cite className="text-sm text-muted-foreground not-italic mt-3 block">— Mr. CAP</cite>
            </blockquote>

            {/* Internal Links */}
            <div className="flex flex-wrap gap-6 pt-4">
              <Link 
                to="/who-is-mr-cap" 
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                Read Full Biography →
              </Link>
              <Link 
                to="/mr-cap-discography" 
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                View Full Discography →
              </Link>
            </div>
          </div>

          {/* Stats Panel — Cinematic offset */}
          <div ref={statsRef} className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="stat-card glass rounded-2xl p-6 text-center will-change-transform"
                >
                  <p className="font-display text-3xl md:text-4xl text-primary mb-2">
                    {item.number}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
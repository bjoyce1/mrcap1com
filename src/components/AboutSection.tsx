import { MapPin, Music, Code, Award } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);

  const highlights = [
    { icon: MapPin, label: "Third Ward, Houston", desc: "Houston, Texas" },
    { icon: Music, label: "SPC Original", desc: "South Park Coalition" },
    { icon: Award, label: "Lone Star Emmy", desc: "Award-Winning Contributor" },
    { icon: Code, label: "Tech Innovator", desc: "Web & Blockchain" },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Bio paragraphs staggered reveal
      const bioParagraphs = bioRef.current?.querySelectorAll("p");
      if (bioParagraphs) {
        gsap.fromTo(
          bioParagraphs,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Quote reveal with clip-path
      gsap.fromTo(
        quoteRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Highlights cards staggered reveal from right
      const highlightCards = highlightsRef.current?.querySelectorAll(".highlight-card");
      if (highlightCards) {
        gsap.fromTo(
          highlightCards,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Parallax effect on background image
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { y: -50 },
          {
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-32 border-b border-white/5 relative overflow-hidden"
    >
      {/* Background Image with Fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          ref={bgImageRef}
          src="/images/about-bg.png" 
          alt="" 
          className="absolute right-0 top-0 h-[120%] w-auto object-cover object-left opacity-95 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 will-change-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Biography
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-medium tracking-tight">
            About <span className="text-gradient-orange">Mr. CAP</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Bio */}
          <div ref={bioRef} className="lg:col-span-2 space-y-6">
            <p className="text-lg text-foreground leading-relaxed font-light will-change-transform">
              <span className="text-primary font-medium">Mr. CAP</span> (born Cornelius A. Pratt, April 5, 1973) is a Houston-based
              rapper, entrepreneur, and media producer whose career spans decades within the Southern hip hop underground. 
              Raised in Houston's Third Ward, he began performing at a young age and later became an original member of the 
              South Park Coalition, one of Texas' most enduring independent hip hop collectives.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform">
              Known for narrative-driven lyricism and Houston-rooted authenticity, Mr. CAP has released solo and 
              collaborative projects while maintaining a strong presence in the city's cultural ecosystem. His work 
              has been covered by major outlets including{" "}
              <span className="text-foreground">Houston Press</span> and{" "}
              <span className="text-foreground">Houston Chronicle</span>, documenting both his musical output and 
              long-standing role in Houston hip hop.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform">
              Beyond music, Mr. CAP contributed to the documentary{" "}
              <span className="italic text-foreground">"The Life: Sex Trafficking and Modern-Day Slavery"</span>, 
              which won a <span className="text-primary font-medium">Lone Star Emmy Award</span>. He was also honored during the 
              50th Anniversary of Hip Hop by Broadcast Houston and received a{" "}
              <span className="text-foreground">Certificate of Congressional Recognition</span> from Congresswoman Sheila Jackson Lee.
            </p>

            {/* Pull Quote */}
            <blockquote ref={quoteRef} className="border-l-2 border-primary pl-6 py-4 my-8 will-change-transform">
              <p className="text-xl text-foreground italic font-light leading-relaxed">
                "These recognitions reflect not just music, but years of cultural contribution and storytelling."
              </p>
              <cite className="text-sm text-muted-foreground not-italic mt-2 block">— Mr. CAP</cite>
            </blockquote>

            {/* Internal Links */}
            <div className="flex flex-wrap gap-4 pt-4">
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

          {/* Highlights Sidebar */}
          <div ref={highlightsRef} className="space-y-4">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="highlight-card bg-white/[0.02] rounded-xl border border-white/5 p-5 hover:border-primary/30 transition-colors group will-change-transform"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-medium text-foreground tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

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

  const highlights = [
    { icon: MapPin, label: "Houston, TX", desc: "South Park Born" },
    { icon: Music, label: "SPC Member", desc: "South Park Coalition" },
    { icon: Code, label: "Tech Innovator", desc: "Web & Blockchain" },
    { icon: Award, label: "Jack Yates", desc: "Class of '92" },
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
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/images/about-bg.png" 
          alt="" 
          className="absolute right-0 top-0 h-full w-auto object-cover object-left opacity-20"
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
              Cornelius A. Pratt, professionally known as{" "}
              <span className="text-primary font-medium">Mr. CAP</span>, is a Houston-born
              rapper, writer, and creative technologist with deep roots in the South Park
              Coalition. Raised in a musical family and performing since age eight, CAP's voice
              carries the weight of lived experience — from street lessons and spiritual
              reflections to entrepreneurship and innovation.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform">
              After graduating from Jack Yates Senior High School and studying Computer Network
              Engineering and Computer Science, he took his talent beyond the mic into digital
              distribution, web and graphic design, and blockchain-based ventures. His debut
              album,
              <span className="italic text-foreground"> "2 Tha Grave" (2011)</span>, introduced
              his signature blend of raw lyricism, storytelling, and Southern grit.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light will-change-transform">
              Today, with The SPC's latest project{" "}
              <span className="italic text-foreground">"The Ties That Bind Us"</span> and the
              lead single <span className="italic text-foreground">"Bet'n On Me"</span>, Mr.
              CAP stands at the intersection of music, media, and technology — bridging old
              school integrity with new school innovation while representing Houston, South Park
              Coalition, and independent creators worldwide.
            </p>

            {/* Pull Quote */}
            <blockquote ref={quoteRef} className="border-l-2 border-primary pl-6 py-4 my-8 will-change-transform">
              <p className="text-xl text-foreground italic font-light leading-relaxed">
                "Houston's Mr. CAP is an original SPC member, rapper, and tech-minded
                entrepreneur turning real-life experience into music, media, and modern legacy."
              </p>
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

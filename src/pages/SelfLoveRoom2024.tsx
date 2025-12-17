import { Link, useLocation } from "react-router-dom";
import { selfLove2024 } from "@/data/selfLove2024";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { ArrowLeft } from "lucide-react";

export default function SelfLoveRoom2024() {
  const location = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section ref={sectionRef} className="mx-auto max-w-6xl px-4 py-20 pt-32">
        <Link
          to="/self-love"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Installation
        </Link>

        <header ref={headerRef} className="mb-10">
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Room I
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold uppercase tracking-wide">
            2024: The Awakening
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Enter the first room of the installation. Select a story to step
            into the work.
          </p>
        </header>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {selfLove2024.map((s) => (
            <Link
              key={s.slug}
              to={`/self-love/2024/${s.slug}`}
              state={{ backgroundLocation: location }}
              className="group rounded-2xl border border-border/20 bg-card/50 overflow-hidden hover:bg-card/70 transition-all duration-300"
            >
              <div className="aspect-[9/16] max-h-[320px] bg-muted/20 overflow-hidden">
                <img
                  src={s.coverImage}
                  alt={`${s.character} artwork`}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                  {s.character}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {s.storyTitle}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {s.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center rounded-xl border border-border/20 bg-muted/30 px-3 py-2 text-sm text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Read Story →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

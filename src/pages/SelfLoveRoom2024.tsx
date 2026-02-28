import { Link, useLocation } from "react-router-dom";
import { selfLove2024 } from "@/data/selfLove2024";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { ArrowLeft } from "lucide-react";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

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

        <div style={{ position: 'relative', minHeight: '400px' }}>
          <ChromaGrid
            items={selfLove2024.map((s) => ({
              image: s.coverImage,
              title: s.storyTitle,
              subtitle: s.excerpt,
              handle: s.character,
              borderColor: "hsl(var(--primary))",
              gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.08), hsl(var(--background)))",
              slug: s.slug,
            } as ChromaGridItem))}
            columns={3}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            renderCard={(item) => (
              <Link
                to={`/self-love/2024/${item.slug}`}
                state={{ backgroundLocation: location }}
                className="block h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-[9/16] max-h-[320px] bg-muted/20 overflow-hidden rounded-t-[20px]">
                  <img
                    src={item.image as string}
                    alt={`${item.handle} artwork`}
                    className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">{item.handle}</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.subtitle}</p>
                  <div className="mt-4 inline-flex items-center rounded-xl border border-border/20 bg-muted/30 px-3 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    Read Story →
                  </div>
                </div>
              </Link>
            )}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}

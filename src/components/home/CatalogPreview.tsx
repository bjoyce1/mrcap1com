import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";
import albumColdAssPimp from "@/assets/album-cold-ass-pimp.jpg";

const albums = [
  {
    title: "The Art Of ISM",
    year: "2019",
    label: "Sony Music / The Orchard",
    image: albumArtOfIsm,
  },
  {
    title: "2 Tha Grave",
    year: "2011",
    label: "Cap Records",
    image: albumGrave,
  },
  {
    title: "O.N.E. on O.N.E.",
    year: "2005",
    label: "O.N.E. 4 Da Money",
    image: albumOneOnOne,
  },
  {
    title: "Tha Cold Ass Pimp",
    year: "2006",
    label: "O.N.E. 4 Da Money",
    image: albumColdAssPimp,
  },
];

const CatalogPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Staggered album card reveal
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="flex items-end justify-between mb-12" style={{ opacity: 0 }}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                Catalog
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              From the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cap-gold">Vault</span>
            </h2>
          </div>
          <Button variant="fluxOutline" size="sm" className="rounded-full hidden md:flex" asChild>
            <Link to="/music">
              Full Discography <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {albums.map((album, i) => (
            <div
              key={album.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{ opacity: 0 }}
            >
              <Link to="/music" className="group block">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-border/10">
                  <img
                    src={album.image}
                    alt={`${album.title} album cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-foreground font-medium">
                      {album.year}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {album.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{album.label}</p>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
            <Link to="/music">
              Full Discography <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";
import SectionShell from "@/components/home/SectionShell";

const albumArtOfIsm = "/images/thumbnails/album-art-of-ism-thumb.webp";
const albumGrave = "/images/thumbnails/album-grave-thumb.webp";
const albumOneOnOne = "/images/thumbnails/album-one-on-one-thumb.webp";
const albumColdAssPimp = "/images/thumbnails/album-cold-ass-pimp-thumb.webp";

const albums = [
  { title: "The Art Of ISM", year: "2019", label: "Sony Music / The Orchard", image: albumArtOfIsm },
  { title: "2 Tha Grave", year: "2011", label: "Cap Records", image: albumGrave },
  { title: "O.N.E. on O.N.E.", year: "2005", label: "O.N.E. 4 Da Money", image: albumOneOnOne },
  { title: "Tha Cold Ass Pimp", year: "2006", label: "O.N.E. 4 Da Money", image: albumColdAssPimp },
];

const CatalogPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: reduce ? 0 : 80, opacity: 0, scale: reduce ? 1 : 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: reduce ? 0.5 : 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: x * 12,
      rotationX: -y * 12,
      transformPerspective: 800,
      duration: 0.4,
      ease: "power2.out",
      transformOrigin: "center",
    });
  };
  const handleTiltLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div ref={sectionRef}>
      <SectionShell
        index="05"
        eyebrow="Catalog"
        title={
          <>
            From the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cap-gold to-primary bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">
              Vault
            </span>
            <style>{`@keyframes shimmer { to { background-position: -200% center; } }`}</style>
          </>
        }
      >
        {/* Desktop: grid; Mobile: horizontal snap */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {albums.map((album, i) => (
            <div
              key={album.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              onMouseMove={(e) => handleTilt(e, i)}
              onMouseLeave={() => handleTiltLeave(i)}
              style={{ opacity: 0, transformStyle: "preserve-3d" }}
              className="will-change-transform"
            >
              <Link to="/discography" className="group block">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-border/10">
                  <img
                    src={album.image}
                    alt={`${album.title} album cover`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Gloss sweep */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
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

        {/* Mobile: horizontal snap row */}
        <div className="md:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {albums.map((album) => (
            <Link
              key={album.title}
              to="/discography"
              className="group block shrink-0 w-[60vw] max-w-[240px] snap-center"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-border/10">
                <img
                  src={album.image}
                  alt={`${album.title} album cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-foreground font-medium">
                    {album.year}
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-foreground text-sm line-clamp-1">{album.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{album.label}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:justify-end">
          <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
            <Link to="/discography">
              Full Discography <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </SectionShell>
    </div>
  );
};

export default CatalogPreview;

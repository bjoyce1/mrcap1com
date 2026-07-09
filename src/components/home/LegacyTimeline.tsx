import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

import capPortrait from "@/assets/cap-hero-portrait.webp";
import albumOneOnOne from "@/assets/album-one-on-one.webp";
import albumGrave from "@/assets/album-grave.webp";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import nftLimitless from "@/assets/nft-limitless.webp";
import albumTies from "@/assets/album-ties.webp";
import artOfIsmBook from "@/assets/art-of-ism-hero.webp";

interface Era {
  year: string;
  title: string;
  text: string;
  image: string;
  link: string;
  linkLabel: string;
}

const ERAS: Era[] = [
  {
    year: "1987",
    title: "The Foundation",
    text: "South Park, Houston. An original member of the legendary South Park Coalition — where the ISM was born.",
    image: capPortrait,
    link: "/south-park-coalition",
    linkLabel: "The SPC Story",
  },
  {
    year: "2005",
    title: "O.N.E. on O.N.E.",
    text: "The grind years. Independent releases that built a catalog and a reputation, one record at a time.",
    image: albumOneOnOne,
    link: "/mr-cap-discography",
    linkLabel: "The Catalog",
  },
  {
    year: "2011",
    title: "2 Tha Grave",
    text: "Loyalty to the streets and the sound. Houston underground, uncompromised.",
    image: albumGrave,
    link: "/mr-cap-discography",
    linkLabel: "Listen",
  },
  {
    year: "2019",
    title: "The Art of ISM",
    text: "The statement album — distributed by Sony Music / The Orchard. A philosophy pressed to wax.",
    image: albumArtOfIsm,
    link: "/album/the-art-of-ism",
    linkLabel: "The Album",
  },
  {
    year: "2021",
    title: "First of a Kind",
    text: "The first Houston rapper to sell a hip-hop NFT. Three decades in, still moving first.",
    image: nftLimitless,
    link: "/nft",
    linkLabel: "Digital Art",
  },
  {
    year: "2024",
    title: "The Ties That Bind Us",
    text: "A grown-man statement with the whole SPC — 19 tracks of honest, unflinching Houston hip-hop.",
    image: albumTies,
    link: "/album/the-ties-that-bind-us",
    linkLabel: "Stream It",
  },
  {
    year: "NOW",
    title: "The Legacy Continues",
    text: "The Art of ISM book, new music, new frontiers. The story is still being written.",
    image: artOfIsmBook,
    link: "/art-of-ism",
    linkLabel: "The Book",
  },
];

/**
 * The Legacy Timeline — a pinned horizontal scroll journey on desktop,
 * a snap-scrolling shelf on touch/small screens.
 */
const LegacyTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current!;
          const getDistance = () => track.scrollWidth - window.innerWidth;

          const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`;
                }
              },
            },
          });

          // Era cards drift up slightly as they enter the viewport
          gsap.utils.toArray<HTMLElement>(".era-card").forEach((card) => {
            gsap.fromTo(
              card,
              { y: 60, autoAlpha: 0.3 },
              {
                y: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: "left 90%",
                  end: "left 55%",
                  scrub: true,
                },
              }
            );
          });

          return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
          };
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background"
      aria-label="Career timeline"
    >
      {/* Header inside the pinned viewport */}
      <div className="absolute top-0 inset-x-0 z-20 pt-14 lg:pt-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6">
          <p className="catalog-stamp">The Journey · 1987 — Now</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3 text-foreground">
            Three Decades <span className="text-gold">Deep</span>
          </h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-20 h-px bg-foreground/10 hidden lg:block">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-primary to-[hsl(var(--accent-gold))]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Horizontal track — pinned & scrubbed on desktop, swipeable below */}
      <div className="overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none">
        <div
          ref={trackRef}
          className="flex items-stretch gap-8 lg:gap-14 w-max min-h-screen pt-44 lg:pt-56 pb-20 px-6 lg:px-12 will-change-transform"
        >
          {ERAS.map((era, i) => (
            <article
              key={i}
              className="era-card group relative w-[78vw] sm:w-[420px] lg:w-[460px] shrink-0 snap-center"
            >
              {/* Giant ghost year */}
              <span
                aria-hidden="true"
                className="absolute -top-16 lg:-top-24 left-0 font-display text-7xl lg:text-9xl leading-none text-transparent select-none pointer-events-none transition-colors duration-700 group-hover:text-foreground/5"
                style={{ WebkitTextStroke: "1.5px hsl(38 33% 89% / 0.18)" }}
              >
                {era.year}
              </span>

              <div className="relative rounded-2xl overflow-hidden border border-border/70 bg-card card-lift">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={era.image}
                    alt={`${era.title} — ${era.year}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 catalog-stamp bg-background/70 backdrop-blur px-3 py-1.5 rounded-full">
                    {era.year}
                  </span>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="font-display text-2xl lg:text-3xl text-foreground">
                    {era.title}
                  </h3>
                  <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {era.text}
                  </p>
                  <Link
                    to={era.link}
                    className="link-sweep inline-flex items-center gap-2 mt-5 text-xs font-semibold tracking-[0.2em] uppercase text-gold cursor-pointer"
                  >
                    {era.linkLabel}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* End cap — CTA */}
          <div className="flex items-center shrink-0 pr-[10vw]">
            <Link
              to="/who-is-mr-cap"
              className="group/cta flex flex-col items-start gap-4 cursor-pointer"
            >
              <span className="font-display text-4xl lg:text-6xl text-foreground leading-tight">
                Know the
                <br />
                <span className="text-gradient-gold">Whole Story</span>
              </span>
              <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase text-foreground/70 group-hover/cta:text-gold transition-colors duration-300">
                Who is Mr. CAP
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-2" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyTimeline;

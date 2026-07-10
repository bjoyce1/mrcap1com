import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { useAlbums } from "@/hooks/useStreamingData";
import type { Album } from "@/stores/playerStore";
import { Vinyl } from "./Vinyl";

type CardItem = {
  year: string;
  title: string;
  meta: string;
  img: string;
  href: string;
};

const FALLBACK_COVER = "/placeholder.svg";

export default function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: albums, isLoading } = useAlbums();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 901px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const cards: CardItem[] = (albums ?? []).map((a: Album) => ({
    year: a.release_year ? String(a.release_year) : "—",
    title: a.title,
    meta: `${a.track_count || ""}${a.track_count ? " TRACKS · " : ""}${(a.artist || "MR. CAP").toUpperCase()}`,
    img: a.cover_art_url || FALLBACK_COVER,
    href: `/album/${a.slug}`,
  }));

  useLayoutEffect(() => {
    if (!isDesktop || !cards.length) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      if (distance() <= 0) return;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [isDesktop, cards.length]);

  if (isLoading || !cards.length) {
    return (
      <section className="catalog-section py-24 text-center">
        <p className="eyebrow justify-center">The Catalog</p>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          {isLoading ? "Loading the record…" : "Catalog coming soon."}
        </p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="catalog-section relative bg-[#0b0908] text-[#f2ecdf] overflow-hidden">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-12 hairline-b">
        <span className="eyebrow">The Catalog</span>
        <h2 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] mt-4">
          TWENTY-PLUS YEARS{" "}
          <span className="font-serif-italic normal-case tracking-normal text-[#d8a948]">on wax</span>
        </h2>
        <p className="mt-4 max-w-xl text-[#f2ecdfa0] font-mono text-sm">
          Albums, mixtapes, chain-stamped releases. Scroll through the record.
        </p>
      </div>

      {/* Desktop horizontal scrub */}
      <div className="hidden min-[901px]:block overflow-hidden">
        <div ref={trackRef} className="flex gap-10 px-10 py-20 will-change-transform">
          {cards.map((c) => (
            <Card key={c.href} c={c} />
          ))}
        </div>
      </div>

      {/* Mobile native scroll */}
      <div className="min-[901px]:hidden flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 py-12">
        {cards.map((c) => (
          <div key={c.href} className="snap-start shrink-0 w-[78vw] max-w-[340px]">
            <Card c={c} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ c }: { c: CardItem }) {
  return (
    <Link to={c.href} className="disco-card group block w-[300px] md:w-[360px] shrink-0">
      <div className="relative">
        {/* Year poster element behind sleeve */}
        <div
          aria-hidden="true"
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-0 font-display text-outline pointer-events-none select-none text-[7rem] md:text-[9rem] leading-none"
        >
          {c.year}
        </div>

        {/* Art + Vinyl */}
        <div className="art-wrap relative aspect-square">
          <Vinyl cover={c.img} />
          <div className="art">
            <img src={c.img} alt={`${c.title} cover art`} loading="lazy" />
          </div>
        </div>
      </div>

      <h3 className="font-display mt-6 text-xl md:text-2xl">{c.title}</h3>
      <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-[#f2ecdf8c] uppercase">
        {c.meta}
      </p>
    </Link>
  );
}

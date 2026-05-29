import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  DSRoot,
  NavV3,
  FooterV3,
  Scene,
  Stage,
  Display,
  Eyebrow,
  Lead,
  Body,
  Caption,
  CTA,
  MarqueeRow,
  MediaFrame,
} from "@/design-system";

gsap.registerPlugin(ScrollTrigger);

// ── Catalog data (condensed from Discography) ────────────────
type Release = {
  title: string;
  artist: string;
  year: string;
  label: string;
  role: string;
  cover: string;
  to?: string;
  spotify?: string;
  apple?: string;
  featured?: boolean;
  note?: string;
};

const RELEASES: Release[] = [
  {
    title: "Bet On Her",
    artist: "Mr. CAP",
    year: "2026",
    label: "CAP Records",
    role: "Single — current release",
    cover: "/images/covers/bet-on-her.webp",
    to: "/bet-on-her",
    featured: true,
    note: "The new single. A meditation on devotion, faith and the women who shape a legacy.",
  },
  {
    title: "The Ties That Bind Us",
    artist: "South Park Coalition",
    year: "2024",
    label: "South Park Coalition LLC",
    role: "SPC group album",
    cover: "/images/covers/album-ties.webp",
    to: "/discography",
    note: "19 tracks. K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped version Jan 2025.",
  },
  {
    title: "The Art Of ISM",
    artist: "Mr. CAP",
    year: "2019",
    label: "Sony Music / The Orchard",
    role: "3rd studio album",
    cover: "/images/covers/nft-art-of-ism.webp",
    to: "/art-of-ism",
    note: "Production by Zaytoven, Metro Boomin & Mike Will Made-It.",
  },
  {
    title: "2 Tha Grave",
    artist: "Mr. CAP",
    year: "2011",
    label: "Cap Records",
    role: "Studio album",
    cover: "/images/covers/album-grave.webp",
    to: "/discography",
  },
  {
    title: "Tha Cold Ass Pimp",
    artist: "Mr. CAP",
    year: "2006",
    label: "O.N.E. 4 Da Money Ent.",
    role: "Mixtape",
    cover: "/images/covers/album-cold-ass-pimp.webp",
    to: "/discography",
  },
  {
    title: "O.N.E. on O.N.E.",
    artist: "O.N.E. & Mr. CAP",
    year: "2005",
    label: "O.N.E. 4 Da Money Ent.",
    role: "Collab album",
    cover: "/images/covers/album-one-on-one.webp",
    to: "/discography",
  },
];

const SINGLES = [
  { year: "2024", title: "Social Media is a Ho Stroll", artist: "Mr. CAP feat. Ai'Eshsa" },
  { year: "2024", title: "Bet'n On Me", artist: "South Park Coalition" },
  { year: "2023", title: "Dippin Thru the Metaverse", artist: "Mr. CAP" },
  { year: "2023", title: "Southern Sounds (Ultra ISM)", artist: "Mr. CAP feat. Venita Vyne" },
  { year: "2023", title: "H-Town Represent", artist: "Mr. CAP feat. Ciddy Boi P" },
  { year: "2021", title: "Limitless (NFT)", artist: "Mr. CAP feat. K-Rino" },
  { year: "2018", title: "Today Was A Great Day", artist: "Mr. CAP" },
  { year: "2015", title: "Capism", artist: "Mr. CAP" },
];

const MARQUEE = [
  "Studio Albums",
  "Singles",
  "Mixtapes",
  "Collabs",
  "NFT Drops",
  "Slowed & Chopped",
  "South Park Coalition",
];

// ── JSON-LD ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": "https://mrcap1.com/#musicgroup",
      name: "Mr. CAP",
      url: "https://mrcap1.com/music",
      genre: ["Hip Hop", "Houston Rap", "Southern Hip Hop"],
    },
    {
      "@type": "MusicPlaylist",
      name: "Mr. CAP — Complete Catalog",
      url: "https://mrcap1.com/music",
      numTracks: RELEASES.length + SINGLES.length,
      track: [
        ...RELEASES.map((r) => ({
          "@type": "MusicAlbum",
          name: r.title,
          datePublished: r.year,
          byArtist: { "@type": "Person", name: "Mr. CAP" },
        })),
        ...SINGLES.map((s) => ({
          "@type": "MusicRecording",
          name: s.title,
          byArtist: { "@type": "Person", name: "Mr. CAP" },
        })),
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Music", item: "https://mrcap1.com/music" },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────
const MusicV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState<string | "all">("all");

  const featured = RELEASES.find((r) => r.featured) ?? RELEASES[0];
  const rest = RELEASES.filter((r) => r !== featured);

  const years = Array.from(new Set(SINGLES.map((s) => s.year)));
  const filteredSingles =
    activeYear === "all" ? SINGLES : SINGLES.filter((s) => s.year === activeYear);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector("[data-hero-bg]"), {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelectorAll("[data-fade]"), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 70%",
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <DSRoot>
      <Helmet>
        <title>Music — Mr. CAP | Complete Catalog & Latest Releases</title>
        <meta
          name="description"
          content="The complete Mr. CAP catalog. Studio albums, singles, NFT drops, and South Park Coalition releases — from 2005 to today."
        />
        <link rel="canonical" href="https://mrcap1.com/music" />
        <meta property="og:title" content="Music — Mr. CAP" />
        <meta
          property="og:description"
          content="The complete Mr. CAP catalog. Studio albums, singles, NFT drops, SPC releases."
        />
        <meta property="og:url" content="https://mrcap1.com/music" />
        <meta property="og:image" content="https://mrcap1.com/images/covers/bet-on-her.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      {/* ───── Hero ───── */}
      <Scene
        ref={heroRef}
        full
        background={
          <div
            data-hero-bg
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${featured.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35) saturate(0.85)",
            }}
          />
        }
        overlay
      >
        <Stage tone="transparent" className="text-center">
          <Eyebrow>The Catalog</Eyebrow>
          <Display as="h1" className="mt-6">
            Three decades.
            <br />
            One body of work.
          </Display>
          <Lead className="mx-auto mt-8 max-w-2xl">
            Every album, every single, every collaboration — a chronicle of Houston hip-hop
            from a founding voice of the South Park Coalition.
          </Lead>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CTA to="#featured">Latest release</CTA>
            <CTA to="#catalog" variant="ghost">
              Full catalog
            </CTA>
          </div>
        </Stage>
      </Scene>

      <MarqueeRow items={MARQUEE} />

      {/* ───── Featured release ───── */}
      <section id="featured" ref={featuredRef}>
        <Stage>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div data-fade>
              <MediaFrame ratio="square" className="shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                <img
                  src={featured.cover}
                  alt={`${featured.title} cover art`}
                  className="h-full w-full object-cover"
                />
              </MediaFrame>
            </div>
            <div data-fade>
              <Eyebrow>{featured.role}</Eyebrow>
              <Display as="h2" size="md" className="mt-6">
                {featured.title}
              </Display>
              <Caption className="mt-4">
                {featured.artist} · {featured.year} · {featured.label}
              </Caption>
              {featured.note && <Body className="mt-8 max-w-prose">{featured.note}</Body>}
              <div className="mt-10 flex flex-wrap gap-4">
                {featured.to && <CTA to={featured.to}>Open release</CTA>}
                <CTA to="/discography" variant="ghost">
                  Full discography
                </CTA>
              </div>
            </div>
          </div>
        </Stage>
      </section>

      {/* ───── Catalog grid ───── */}
      <section id="catalog">
        <Stage>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Studio Albums & Collabs</Eyebrow>
              <Display as="h2" size="md" className="mt-4">
                The catalog
              </Display>
            </div>
            <Body className="max-w-md opacity-70">
              Six bodies of work spanning solo records, collaborations, and the South Park
              Coalition collective.
            </Body>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={r.to ?? "/discography"} className="group block">
                  <MediaFrame ratio="square" className="overflow-hidden">
                    <img
                      src={r.cover}
                      alt={`${r.title} cover art`}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </MediaFrame>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl tracking-tight">{r.title}</h3>
                    <span className="font-mono text-xs opacity-50">{r.year}</span>
                  </div>
                  <Caption className="mt-2">{r.role} · {r.label}</Caption>
                </Link>
              </motion.div>
            ))}
          </div>
        </Stage>
      </section>

      {/* ───── Singles timeline ───── */}
      <section>
        <Stage tone="contrast">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Singles & Features</Eyebrow>
              <Display as="h2" size="md" className="mt-4">
                The timeline
              </Display>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveYear("all")}
                className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
                  activeYear === "all"
                    ? "bg-[hsl(var(--ds-bone))] text-[hsl(var(--ds-bg))]"
                    : "border border-current/20 opacity-60 hover:opacity-100"
                }`}
              >
                All
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
                    activeYear === y
                      ? "bg-[hsl(var(--ds-bone))] text-[hsl(var(--ds-bg))]"
                      : "border border-current/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-current/10">
            {filteredSingles.map((s, i) => (
              <motion.li
                key={`${s.year}-${s.title}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="grid grid-cols-[80px_1fr] items-baseline gap-6 py-6 sm:grid-cols-[100px_1fr_auto]"
              >
                <span className="font-mono text-xs uppercase tracking-widest opacity-50">
                  {s.year}
                </span>
                <div>
                  <div className="font-display text-xl tracking-tight sm:text-2xl">{s.title}</div>
                  <Caption className="mt-1">{s.artist}</Caption>
                </div>
                <span className="hidden font-mono text-xs uppercase tracking-widest opacity-40 sm:block">
                  Single
                </span>
              </motion.li>
            ))}
          </ul>
        </Stage>
      </section>

      {/* ───── Closing CTA ───── */}
      <Scene
        background={
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, hsl(var(--ds-oxblood) / 0.4), transparent 60%)",
            }}
          />
        }
      >
        <Stage tone="transparent" className="text-center">
          <Eyebrow>Listen everywhere</Eyebrow>
          <Display as="h2" size="md" className="mt-6">
            Stream the catalog.
          </Display>
          <Lead className="mx-auto mt-8 max-w-xl">
            CAP STREAM, Spotify, Apple Music, and every major platform.
          </Lead>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CTA to="/discography">Open CAP STREAM</CTA>
            <CTA
              to="https://open.spotify.com/artist/0gPMSqRJ4VfTRKHaaG8gdR"
              variant="ghost"
              external
            >
              Spotify
            </CTA>
          </div>
        </Stage>
      </Scene>

      <FooterV3 />
    </DSRoot>
  );
};

export default MusicV3;

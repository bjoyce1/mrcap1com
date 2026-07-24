import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Play, ExternalLink, Calendar, Disc3, ChevronRight, ArrowUpRight, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import CitationBlock from "@/components/CitationBlock";
import PressKitModal from "@/components/PressKitModal";
import BiographyShareRow from "@/components/BiographyShareRow";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChapterNav, { type Chapter } from "@/components/ChapterNav";
import ImageLightbox, { type LightboxImage } from "@/components/ImageLightbox";

const CHAPTERS: Chapter[] = [
  { id: "ch-hero", num: "00", label: "Prologue" },
  { id: "ch-code", num: "01", label: "The Code" },
  { id: "ch-origin", num: "02", label: "Origin" },
  { id: "ch-spc", num: "03", label: "SPC Legacy" },
  { id: "ch-timeline", num: "04", label: "Timeline" },
  { id: "ch-evolution", num: "05", label: "Evolution" },
  { id: "ch-receipts", num: "06", label: "Receipts" },
  { id: "ch-universe", num: "07", label: "Universe" },
];

// Swap in the trailer's YouTube ID when available to enable the embedded, captioned player.
// While null, the poster acts as a lazy link to the official PBS page (no iframe network cost).
const TRAILER_YOUTUBE_ID: string | null = null;

import portrait from "@/assets/cap-hero-portrait.webp";
import coin from "@/assets/mr-cap-coin.webp";
import albumTies from "@/assets/album-ties.webp";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import albumGrave from "@/assets/album-grave.webp";
import albumOneOnOne from "@/assets/album-one-on-one.webp";
import albumColdPimp from "@/assets/album-cold-ass-pimp.webp";
import nftLimitless from "@/assets/nft-limitless.webp";
import theLifeDoc from "@/assets/the-life-documentary.webp";
import spcAustin from "@/assets/spc-austin-2025.webp";
import spcOrigins from "/images/spc-houston-origins.webp";
import spcSkyline from "/images/spc-houston-skyline.webp";
import spcStudio from "/images/spc-mr-cap-studio.jpg";
import spcVinyl from "/images/spc-vinyl-legacy.webp";
import artOfIsmHero from "@/assets/art-of-ism-hero.webp";
import originChildhood from "@/assets/cap-origin-childhood.png.asset.json";
import originChildhood400 from "@/assets/cap-origin-childhood-400.webp.asset.json";
import originChildhood800 from "@/assets/cap-origin-childhood-800.webp.asset.json";
import originChildhood1200 from "@/assets/cap-origin-childhood-1200.webp.asset.json";

/* ---------------- small building blocks (page-scoped) ---------------- */

const Stamp = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] uppercase text-[hsl(var(--accent-gold))]">
    <span className="h-px w-8 bg-[hsl(var(--accent-gold))]/60" />
    {children}
  </span>
);

const Rule = () => <div className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--accent-gold))]/40 to-transparent" />;

const Reveal = ({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Chrome coin (pointer-reactive, lazy, static fallback) ---------------- */

const ChromeCoin = ({ src }: { src: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({ x: dy * -18, y: dx * 22 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <div ref={ref} className="relative aspect-square w-full max-w-[520px] mx-auto [perspective:1200px]">
      <div
        className="relative h-full w-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--accent-gold)/0.4),transparent_60%)] blur-2xl" />
        <img
          src={src}
          alt="Mr. CAP coin — Capicoin monogram"
          className="relative h-full w-full object-contain drop-shadow-[0_30px_60px_hsl(var(--accent-gold)/0.25)]"
          loading="lazy"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay opacity-60"
          style={{ background: "conic-gradient(from 210deg, transparent, hsl(var(--accent-gold)/0.35), transparent 40%, transparent)" }}
        />
      </div>
    </div>
  );
};

/* ---------------- Data ---------------- */

const pillars = [
  { k: "01", t: "Artist", d: "Three decades of narrative-driven Southern hip-hop — from cassette-era South Park to global streaming." },
  { k: "02", t: "South Park Coalition", d: "Long-time member of the DIY collective that wrote the independent playbook for Houston." },
  { k: "03", t: "Entrepreneur", d: "Founder of CAP Distributions, Mortuary Media LLC, and a creative agency — building the infrastructure other artists rent." },
  { k: "04", t: "Cultural Architect", d: "Documentary contributor, blockchain pioneer, Capicoin builder — engineering the systems the next era will use." },
];

const timeline = [
  {
    slug: "origin",
    year: "Origin",
    tag: "ORIGIN",
    title: "Houston, Texas",
    body: "Cornelius A. Pratt — son of two musicians. Raised in the Third Ward and South Park.",
    art: {
      src: originChildhood1200.url,
      srcSet: `${originChildhood400.url} 400w, ${originChildhood800.url} 800w, ${originChildhood1200.url} 1200w`,
      sizes: "(max-width: 768px) 192px, 256px",
      fallback: originChildhood.url,
    },
    alt: "Childhood portrait of Cornelius A. Pratt (Mr. CAP) as a young boy in a blue velvet suit and bow tie, smiling.",
    caption: "Origin portrait — Cornelius A. Pratt, Houston, Texas",
  },
  { slug: "spc-1990s", year: "1990s", tag: "COALITION", title: "South Park Coalition", body: "Joins the collective that codified independence for Houston hip-hop.", art: spcOrigins, alt: "Mr. CAP with the South Park Coalition in Houston" },
  { slug: "one-on-one-2005", year: "2005", tag: "CATALOG", title: "O.N.E. on O.N.E.", body: "Collab album with O.N.E. — narrative, discipline, Houston-rooted craftsmanship.", art: albumOneOnOne, alt: "O.N.E. on O.N.E. album artwork" },
  { slug: "cold-ass-pimp-2006", year: "2006", tag: "CATALOG", title: "Tha Cold Ass Pimp", body: "An early solo statement — street realism as literature.", art: albumColdPimp, alt: "Tha Cold Ass Pimp album artwork" },
  { slug: "2-tha-grave-2011", year: "2011", tag: "DEBUT", title: "2 Tha Grave", body: "Debut LP — collaborations across SPC and the Screwed Up Click movement.", art: albumGrave, alt: "2 Tha Grave album artwork" },
  { slug: "art-of-ism-2019", year: "2019", tag: "OPUS", title: "The Art of ISM", body: "A philosophy pressed to record — released via Sony Music / The Orchard.", art: albumArtOfIsm, alt: "The Art of ISM album artwork" },
  { slug: "first-nft-2021", year: "2021", tag: "FIRST", title: "First Houston rapper to sell a Hip-Hop NFT", body: "Ownership on-chain. Independence, upgraded.", art: nftLimitless, alt: "Limitless NFT artwork" },
  { slug: "ties-that-bind-2024", year: "2024", tag: "COLLECTIVE", title: "The Ties That Bind Us", body: "SPC group album — featuring “Bet'n On Me.”", art: albumTies, alt: "The Ties That Bind Us album artwork" },
  { slug: "legacy-now", year: "NOW", tag: "ERA", title: "Legacy in Motion", body: "Capicoin (CCHX), Art of ISM ecosystem, and the ongoing catalog.", art: coin, alt: "Capicoin (CCHX) medallion" },
];

const universe = [
  { to: "/music", label: "Music Catalog", sub: "Every album. Every era.", img: albumArtOfIsm },
  { to: "/south-park-coalition", label: "South Park Coalition", sub: "The blueprint.", img: spcAustin },
  { to: "/art-of-ism", label: "The Art of ISM", sub: "Album · book · philosophy.", img: artOfIsmHero },
  { to: "/nft", label: "NFT Gallery", sub: "On-chain ownership.", img: nftLimitless },
  { to: "/opk", label: "Press Kit / OPK", sub: "Media assets and downloads.", img: spcStudio },
  { to: "/videos", label: "Videos", sub: "Music & visual archive.", img: spcVinyl },
  { to: "/merch", label: "Store", sub: "Wearable archive.", img: spcSkyline },
  { to: "/booking", label: "Booking", sub: "Shows · features · talks.", img: portrait },
];

/* ---------------- Page ---------------- */

const WhoIsMrCap = () => {
  const [pressKitOpen, setPressKitOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const timelineImages: LightboxImage[] = useMemo(
    () =>
      timeline
        .filter((m) => !!m.art)
        .map((m) => {
          const src = typeof m.art === "string" ? m.art! : (m.art as any).src;
          const srcSet =
            typeof m.art === "string" ? undefined : (m.art as any).srcSet;
          const sizes =
            typeof m.art === "string" ? undefined : (m.art as any).sizes;
          return {
            src,
            srcSet,
            sizes,
            alt: m.alt || `${m.title} — ${m.tag}`,
            caption: (m as any).caption || `${m.year} · ${m.title}`,
            credit: "Mr. CAP Archive",
          };
        }),
    []
  );
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Deep-link support: scroll to a timeline entry when the URL hash targets one.
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith("#t-")) return;
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    const t = window.setTimeout(scrollToHash, 350);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  const copyEntryLink = async (slug: string, title: string) => {
    const url = `${window.location.origin}/who-is-mr-cap#t-${slug}`;
    try {
      if (window.history?.replaceState) {
        window.history.replaceState(null, "", `#t-${slug}`);
      }
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1800);
      toast.success("Link copied", { description: `${title} — ${url}` });
    } catch {
      toast.error("Couldn't copy — long-press the link to copy manually.");
    }
  };
  const pageTitle = "Who Is Mr. CAP? — Houston Original, SPC Legend, Independent Architect";
  const metaDescription =
    "Mr. CAP (Cornelius A. Pratt) — Houston-born rapper, South Park Coalition member, entrepreneur and blockchain pioneer. Three decades of music, ownership, and independent evolution.";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 200]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        name: "Mr. CAP",
        alternateName: "Cornelius A. Pratt",
        url: "https://mrcap1.com/who-is-mr-cap",
        birthPlace: { "@type": "Place", name: "Houston, Texas, USA" },
        jobTitle: ["Rapper", "Entrepreneur", "Founder"],
        description:
          "Houston-born rapper, entrepreneur, and cultural architect. Long-time member of the South Park Coalition and founder of CAP Distributions.",
        affiliation: [{ "@type": "MusicGroup", name: "South Park Coalition" }],
        owns: { "@type": "Organization", name: "CAP Distributions" },
        sameAs: [
          "https://mrcap1.com",
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.instagram.com/mrcapism/",
          "https://twitter.com/mrcap1",
          "https://www.youtube.com/@mrcap1",
          "https://music.apple.com/us/artist/mr-cap/561550224",
          "https://opensea.io/mrcap",
          "https://www.wikidata.org/wiki/Q139960172",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Who is Mr. CAP?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, entrepreneur, and cultural architect best known as a long-time member of the South Park Coalition. His career spans three decades of independent music, business ventures, and blockchain innovation.",
            },
          },
          {
            "@type": "Question",
            name: "What is Mr. CAP's real name?",
            acceptedAnswer: { "@type": "Answer", text: "Cornelius A. Pratt. Born in Houston, Texas and raised in South Park." },
          },
          {
            "@type": "Question",
            name: "Is Mr. CAP part of South Park Coalition?",
            acceptedAnswer: { "@type": "Answer", text: "Yes — Mr. CAP is a long-time member of the South Park Coalition (SPC), one of Houston's most influential independent hip-hop collectives." },
          },
          {
            "@type": "Question",
            name: "What is CAP Distributions?",
            acceptedAnswer: { "@type": "Answer", text: "CAP Distributions is a digital distribution company founded by Mr. CAP to help independent artists release music globally without sacrificing ownership." },
          },
          {
            "@type": "Question",
            name: "How can I book Mr. CAP?",
            acceptedAnswer: { "@type": "Answer", text: "Book Mr. CAP for concerts, festivals, features, speaking engagements, interviews, and creative/technology conversations at mrcap1.com/booking." },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
          { "@type": "ListItem", position: 2, name: "Who Is Mr. CAP", item: "https://mrcap1.com/who-is-mr-cap" },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href="https://mrcap1.com/who-is-mr-cap" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrcap1.com/who-is-mr-cap" />
        <meta property="og:image" content="https://mrcap1.com/images/spc-mr-cap-studio.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-[hsl(var(--accent-gold))] selection:text-background">
        <Navigation />

        <main className="whois-page">
          <ChapterNav chapters={CHAPTERS} />
          {/* ============ 1. CINEMATIC HERO ============ */}
          <section id="ch-hero" ref={heroRef} className="relative min-h-[100svh] overflow-hidden scroll-mt-24">
            {/* Backdrop */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(1200px 700px at 70% 30%, hsl(var(--candy-magenta)/0.18), transparent 60%), radial-gradient(900px 600px at 20% 80%, hsl(var(--accent-gold)/0.10), transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, hsl(var(--foreground)/0.3) 0 1px, transparent 1px 3px)",
                }}
              />
            </motion.div>

            {/* Breadcrumb */}
            <nav className="absolute top-24 left-0 right-0 z-20">
              <div className="container mx-auto px-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                <Link to="/" className="hover:text-[hsl(var(--accent-gold))] transition-colors">Index</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground">Who Is Mr. CAP</span>
              </div>
            </nav>

            <div className="container mx-auto px-6 pt-40 pb-24 md:pt-48 md:pb-32">
              <div className="grid lg:grid-cols-12 gap-8 items-center relative">
                {/* Left: Typography */}
                <motion.div style={{ y: titleY }} className="lg:col-span-7 relative z-10">
                  <Reveal>
                    <Stamp>File No. 001 · Houston, TX · Origin File</Stamp>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <h1 className="mt-8 font-display tracking-tight">
                      <span className="block leading-[1.1] pb-2 text-[hsl(var(--foreground)/0.55)] text-[clamp(2.2rem,5vw,4rem)]">Who is</span>
                      <span
                        className="block leading-[0.95] text-[clamp(4rem,13vw,11rem)] bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)/0.9) 40%, hsl(var(--accent-gold)) 100%)",
                        }}
                      >
                        MR. CAP
                      </span>
                    </h1>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <p className="mt-8 max-w-xl text-lg md:text-xl text-[hsl(var(--foreground)/0.75)] leading-relaxed font-light">
                      Three decades of <span className="text-foreground">music</span>, <span className="text-foreground">ownership</span>, and{" "}
                      <span className="text-foreground">independent evolution</span> — pressed into vinyl, distributed on-chain, and still built in South Park.
                    </p>
                  </Reveal>

                  <Reveal delay={0.3}>
                    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.28em] uppercase text-[hsl(var(--foreground)/0.6)]">
                      {["Houston Original", "SPC", "Artist", "Founder", "Futurist"].map((t) => (
                        <li key={t} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent-gold))]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.4}>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <Button variant="flux" size="lg" asChild className="rounded-none">
                        <Link to="/music">
                          <Music className="mr-2 h-4 w-4" />
                          Listen to the Catalog
                        </Link>
                      </Button>
                      <Button variant="fluxOutline" size="lg" asChild className="rounded-none">
                        <Link to="/booking">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Mr. CAP
                        </Link>
                      </Button>
                      <button
                        type="button"
                        onClick={() => setPressKitOpen(true)}
                        className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] uppercase text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
                      >
                        View / Download Press Kit
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </Reveal>

                  <Reveal delay={0.5}>
                    <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                      <span>South Park · Houston</span>
                      <span>Active since the 1990s</span>
                      <span>Independent by design</span>
                    </div>
                  </Reveal>
                </motion.div>

                {/* Right: Portrait + Coin */}
                <div className="lg:col-span-5 relative">
                  <motion.div style={{ y: portraitY }} className="relative aspect-[4/5] w-full max-w-[520px] mx-auto">
                    <div className="absolute -inset-6 border border-[hsl(var(--accent-gold))]/25" />
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        clipPath: "polygon(0 4%, 100% 0, 100% 96%, 0 100%)",
                      }}
                    >
                      <img
                        src={portrait}
                        alt="Mr. CAP portrait — Houston, Texas"
                        className="h-full w-full object-cover"
                        style={{ filter: "contrast(1.05) saturate(0.9)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 mix-blend-multiply" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent,hsl(var(--background))_120%)]" />
                    </div>

                    {/* Corner tick marks */}
                    {[
                      "top-0 left-0",
                      "top-0 right-0 rotate-90",
                      "bottom-0 left-0 -rotate-90",
                      "bottom-0 right-0 rotate-180",
                    ].map((pos) => (
                      <span key={pos} className={`absolute ${pos} w-6 h-6 border-t border-l border-[hsl(var(--accent-gold))]/70`} />
                    ))}

                    {/* Metadata slab */}
                    <div className="absolute -bottom-4 left-4 right-4 bg-background/95 backdrop-blur border-l-2 border-[hsl(var(--accent-gold))] px-4 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                      <span className="text-muted-foreground">Subject</span>
                      <span className="text-foreground">Cornelius A. Pratt</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Scroll cue */}
              <div className="mt-16 flex items-center justify-between">
                <Rule />
              </div>
            </div>
          </section>

          {/* ============ 2. THE MAN / THE CODE ============ */}
          <section id="ch-code" className="relative py-32 md:py-40 scroll-mt-24">
            <div className="container mx-auto px-6">
              <Reveal>
                <Stamp>Chapter 01 · The Man / The Code</Stamp>
              </Reveal>

              <div className="mt-10 grid lg:grid-cols-12 gap-x-12 gap-y-16">
                <Reveal delay={0.05} className="lg:col-span-6 min-w-0">
                  <h2 className="font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.95] [text-wrap:balance] break-words">
                    Two names.
                    <br />
                    <span className="text-[hsl(var(--accent-gold))]">One code.</span>
                  </h2>
                </Reveal>

                <Reveal delay={0.15} className="lg:col-span-6 min-w-0 space-y-6 text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
                  <p>
                    <span className="text-foreground font-medium">Cornelius A. Pratt</span> is the son of two musicians, raised in Houston's Third Ward and South Park, and shaped by a city that has always demanded proof.{" "}
                    <span className="text-foreground font-medium">Mr. CAP</span> is what happens when that proof gets pressed to record, sold direct, and refuses to expire.
                  </p>
                  <p>
                    One name signs the paperwork. The other signs the work. They operate under the same principle: own it, ship it, outlast the rest.
                  </p>
                </Reveal>
              </div>

              {/* Pull quote */}
              <Reveal delay={0.1}>
                <blockquote className="mt-24 max-w-5xl">
                  <p className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] text-foreground">
                    <span className="text-[hsl(var(--accent-gold))]">“</span>The technology changed. The principle didn't:{" "}
                    <em className="not-italic underline decoration-[hsl(var(--accent-gold))] decoration-2 underline-offset-8">own the work.</em>
                    <span className="text-[hsl(var(--accent-gold))]">”</span>
                  </p>
                  <footer className="mt-6 font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
                    — Mr. CAP · Est. Houston TX
                  </footer>
                </blockquote>
              </Reveal>

              {/* Pillars */}
              <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4">
                {pillars.map((p, i) => (
                  <Reveal key={p.k} delay={i * 0.08}>
                    <div className="group relative border-t border-[hsl(var(--foreground)/0.15)] pt-8 pr-6 pb-8 md:min-h-[280px] hover:border-[hsl(var(--accent-gold))] transition-colors duration-500">
                      <div className="font-mono text-[10px] tracking-[0.35em] text-[hsl(var(--accent-gold))]">{p.k}</div>
                      <h3 className="mt-4 font-display text-2xl md:text-3xl leading-tight">{p.t}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ============ 3. ORIGIN — SOUTH PARK, HOUSTON ============ */}
          <section id="ch-origin" className="relative py-32 md:py-40 overflow-hidden scroll-mt-24">
            {/* Layered archival backdrop */}
            <div className="absolute inset-0 -z-10">
              <img src={spcSkyline} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[0.18]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
            </div>

            <div className="container mx-auto px-6">
              <Reveal>
                <Stamp>Chapter 02 · Origin · South Park, Houston</Stamp>
              </Reveal>

              <div className="mt-12 grid lg:grid-cols-12 gap-10 items-start">
                <Reveal delay={0.05} className="lg:col-span-5 min-w-0">
                  <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] [text-wrap:balance] break-words">
                    Raised in the <span className="text-[hsl(var(--accent-gold))]">South Park</span>.
                    <br /> Shaped by the block.
                  </h2>
                </Reveal>

                <Reveal delay={0.15} className="lg:col-span-7 min-w-0 space-y-6 text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
                  <p>
                    The son of two musicians, he was performing before most kids picked up an instrument — eight years old at his first show, later graduating from Jack Yates Senior High and moving through the city's earliest independent circuits with The Raise Up Posse.
                  </p>
                  <p>
                    South Park taught the curriculum: <span className="text-foreground">realism, discipline, authenticity, survival.</span> The block wrote the syllabus. Everything after — the coalitions, the labels, the tokens — is the same lesson, translated forward.
                  </p>
                </Reveal>
              </div>

              {/* Archival strip */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { src: spcOrigins, cap: "SPC · Origins" },
                  { src: spcStudio, cap: "Studio · Houston" },
                  { src: spcVinyl, cap: "Vinyl · Legacy" },
                  { src: spcAustin, cap: "SPC · Austin 2025" },
                ].map((f, i) => (
                  <Reveal key={f.cap} delay={i * 0.08}>
                    <figure
                      className={`relative overflow-hidden border border-[hsl(var(--foreground)/0.12)] ${
                        i % 2 ? "translate-y-6 md:translate-y-10" : ""
                      }`}
                    >
                      <img
                        src={f.src}
                        alt={f.cap}
                        loading="lazy"
                        className="h-64 md:h-80 w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                        style={{ filter: "grayscale(0.35) contrast(1.08)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                      <figcaption className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-[0.28em] uppercase text-foreground/85">
                        <span className="text-[hsl(var(--accent-gold))]">{String(i + 1).padStart(2, "0")}</span>
                        <span>{f.cap}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ============ 4. SPC LEGACY — THE BLUEPRINT ============ */}
          <section id="ch-spc" className="relative py-32 md:py-40 scroll-mt-24">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                  <Reveal><Stamp>Chapter 03 · SPC Legacy</Stamp></Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="mt-8 font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.92]">
                      Not a badge.
                      <br />
                      <span className="text-[hsl(var(--accent-gold))]">A blueprint.</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="mt-8 text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
                      The South Park Coalition wasn't a label deal or a scene. It was a working model — masters retained, product moved direct, artists carried on tour by artists. Mr. CAP has spent a career inside that model and building on top of it.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <Link
                      to="/south-park-coalition"
                      className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
                    >
                      Enter the SPC archive
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </Reveal>
                </div>

                {/* Blueprint principles */}
                <div className="lg:col-span-7">
                  <Reveal delay={0.15}>
                    <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-[hsl(var(--accent-gold))] mb-6">
                      · The Blueprint ·
                    </div>
                  </Reveal>
                  <div className="grid gap-0 divide-y divide-[hsl(var(--foreground)/0.12)] border-y border-[hsl(var(--foreground)/0.12)]">
                    {[
                      { n: "I", t: "Own the work", d: "Masters, publishing, direct catalog. No landlord." },
                      { n: "II", t: "Build the audience", d: "Show by show, tape by tape, city by city. Compound." },
                      { n: "III", t: "Outlast the hype", d: "Longevity is the flex. Careers over cycles." },
                    ].map((b, i) => (
                      <Reveal key={b.n} delay={0.2 + i * 0.1}>
                        <div className="group grid grid-cols-[64px_1fr_auto] items-center gap-6 py-8">
                          <div className="font-display text-3xl text-[hsl(var(--accent-gold))]">{b.n}</div>
                          <div>
                            <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight">{b.t}</h3>
                            <p className="mt-1 text-sm md:text-base text-muted-foreground">{b.d}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[hsl(var(--foreground)/0.35)] group-hover:text-[hsl(var(--accent-gold))] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ 5. CAREER TIMELINE ============ */}
          <section id="ch-timeline" className="relative py-32 md:py-40 bg-gradient-to-b from-transparent via-[hsl(var(--card)/0.35)] to-transparent scroll-mt-24">
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
                <div>
                  <Reveal><Stamp>Chapter 04 · Catalog Timeline</Stamp></Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.92]">
                      30+ years, <span className="text-[hsl(var(--accent-gold))]">on record.</span>
                    </h2>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <Link to="/mr-cap-discography" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors">
                    Full Discography <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Reveal>
              </div>

              <ol className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(var(--accent-gold))]/40 to-transparent" aria-hidden />

                {timeline.map((m, i) => {
                  const left = i % 2 === 0;
                  return (
                    <li
                      key={m.slug}
                      id={`t-${m.slug}`}
                      className="relative py-10 md:py-14 scroll-mt-32 target:[&>div]:ring-1"
                    >
                      <div className={`grid md:grid-cols-2 gap-10 items-center`}>
                        {/* text */}
                        <Reveal
                          delay={0.05}
                          y={30}
                          className={`min-w-0 pl-12 md:pl-0 ${left ? "md:pr-16 md:text-right" : "md:order-2 md:pl-16"}`}
                        >
                          <div className={`flex items-center gap-3 ${left ? "md:justify-end" : ""}`}>
                            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-[hsl(var(--accent-gold))]">{m.tag}</div>
                            <button
                              type="button"
                              onClick={() => copyEntryLink(m.slug, m.title)}
                              aria-label={`Copy shareable link to ${m.title}`}
                              title="Copy link to this entry"
                              className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground hover:text-[hsl(var(--accent-gold))] focus:outline-none focus-visible:text-[hsl(var(--accent-gold))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--accent-gold))] px-2 py-1 border border-[hsl(var(--foreground)/0.1)] hover:border-[hsl(var(--accent-gold)/0.6)] transition-colors"
                            >
                              {copiedSlug === m.slug ? (
                                <>
                                  <Check className="w-3 h-3" aria-hidden />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Link2 className="w-3 h-3" aria-hidden />
                                  Copy Link
                                </>
                              )}
                            </button>
                          </div>
                          <div className="mt-2 font-display text-4xl md:text-5xl">{m.year}</div>
                          <h3 className="mt-3 font-display text-xl md:text-2xl text-foreground [text-wrap:balance]">{m.title}</h3>
                          <p className={`mt-2 text-sm md:text-base text-muted-foreground max-w-md ${left ? "md:ml-auto" : ""}`}>
                            {m.body}
                          </p>
                        </Reveal>

                        {/* art */}
                        <Reveal
                          delay={0.15}
                          y={30}
                          className={`pl-12 md:pl-0 ${left ? "md:order-2 md:pl-16" : "md:pr-16 md:flex md:justify-end"}`}
                        >
                        {m.art ? (
                            <button
                              type="button"
                              onClick={() => {
                                const src = typeof m.art === "string" ? m.art : m.art.src;
                                const idx = timelineImages.findIndex((img) => img.src === src);
                                setLightboxIndex(idx >= 0 ? idx : 0);
                              }}
                              className="group relative w-48 md:w-64 aspect-square text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                              aria-label={`Open enlarged view of ${m.alt || m.title}`}
                            >
                              <div className="absolute inset-0 bg-[hsl(var(--accent-gold))]/10 blur-2xl" />
                              <img
                                src={typeof m.art === "string" ? m.art : m.art.src}
                                srcSet={typeof m.art === "string" ? undefined : m.art.srcSet}
                                sizes={typeof m.art === "string" ? undefined : m.art.sizes}
                                alt={m.alt || m.title}
                                loading="lazy"
                                decoding="async"
                                className="relative h-full w-full object-cover shadow-[0_30px_60px_hsl(0_0%_0%/0.6)] border border-[hsl(var(--foreground)/0.1)] transition-transform duration-700 group-hover:-translate-y-1 group-hover:rotate-[-1deg]"
                              />
                              <span className="sr-only">Open enlarged view</span>
                            </button>
                          ) : (
                            <div className="w-48 md:w-64 aspect-square border border-dashed border-[hsl(var(--accent-gold))]/40 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                              Genesis
                            </div>
                          )}
                        </Reveal>
                      </div>

                      {/* node */}
                      <span className="absolute left-4 md:left-1/2 top-14 -translate-x-1/2 h-3 w-3 rounded-full bg-[hsl(var(--accent-gold))] shadow-[0_0_0_4px_hsl(var(--background)),0_0_20px_hsl(var(--accent-gold)/0.6)]" />
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* ============ 6. FROM CASSETTES TO CODE ============ */}
          <section id="ch-evolution" className="relative py-32 md:py-40 overflow-hidden scroll-mt-24">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <Reveal><Stamp>Chapter 05 · From Cassettes to Code</Stamp></Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="mt-8 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.9]">
                      Same principle.
                      <br />
                      <span className="text-[hsl(var(--accent-gold))]">New infrastructure.</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-8 space-y-6 text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
                      <p>
                        <span className="text-foreground">CAP Distributions</span> puts independent artists on global platforms without giving up ownership. In February 2021, Mr. CAP became the <span className="text-foreground">first Houston rapper to sell a Hip-Hop NFT</span> — extending the ownership principle into on-chain culture alongside blockchain projects like <span className="text-foreground">Capicoin (CCHX)</span>.
                      </p>
                      <p>
                        <span className="text-foreground">The Art of ISM</span> is where the philosophy lives out loud — album, book, and a worldview built around individual sovereignty.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="mt-10 flex flex-wrap gap-4">
                      <Button variant="fluxOutline" asChild className="rounded-none">
                        <Link to="/nft"><Disc3 className="mr-2 h-4 w-4" /> NFT Gallery</Link>
                      </Button>
                      <Button variant="fluxOutline" asChild className="rounded-none">
                        <Link to="/art-of-ism">The Art of ISM <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </Reveal>
                </div>

                {/* Coin visual */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <Reveal delay={0.05}>
                    <div className="relative">
                      <ChromeCoin src={coin} />
                      <div className="mt-6 flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                        <span>Capicoin · CCHX</span>
                        <span>First Houston Hip-Hop NFT · 2021</span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* ============ 7. RECEIPTS ============ */}
          <section id="ch-receipts" className="relative py-24 md:py-32 border-y border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--card)/0.4)] scroll-mt-24">
            <div className="container mx-auto px-6">
              <Reveal><Stamp>Chapter 06 · Receipts</Stamp></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] max-w-3xl">
                  Cultural impact, documented.
                </h2>
              </Reveal>

              <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[hsl(var(--foreground)/0.12)] border-y border-[hsl(var(--foreground)/0.12)]">
                {[
                  { n: "30+", l: "Years in the catalog" },
                  { n: "SPC", l: "Long-time member" },
                  { n: "2021", l: "First Houston Hip-Hop NFT" },
                  { n: "Global", l: "Streaming distribution" },
                ].map((s, i) => (
                  <Reveal key={s.l} delay={i * 0.08}>
                    <div className="p-6 md:p-8">
                      <div className="font-display text-4xl md:text-5xl text-[hsl(var(--accent-gold))]">{s.n}</div>
                      <div className="mt-2 font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">{s.l}</div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Documentary block */}
              <div className="mt-16 grid lg:grid-cols-12 gap-10 items-center">
                <Reveal className="lg:col-span-5 min-w-0">
                  <figure className="relative">
                    {TRAILER_YOUTUBE_ID ? (
                      <button
                        type="button"
                        onClick={() => setDocOpen(true)}
                        aria-label="Play trailer: The Life — Sex Trafficking and Modern-Day Slavery (opens video with captions)"
                        aria-haspopup="dialog"
                        className="group relative block w-full overflow-hidden border border-[hsl(var(--foreground)/0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <img
                          src={theLifeDoc}
                          alt="The Life: Sex Trafficking and Modern-Day Slavery — documentary key art"
                          loading="lazy"
                          decoding="async"
                          width={1280}
                          height={720}
                          className="w-full aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--accent-gold))] text-background shadow-[0_4px_24px_hsl(0_0%_0%/0.5)] transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" />
                          </span>
                        </span>
                        <span className="absolute left-3 bottom-3 font-mono text-[10px] tracking-[0.28em] uppercase text-white/90">
                          Play trailer · Captions on
                        </span>
                      </button>
                    ) : (
                      <a
                        href="https://www.pbs.org/show/the-life/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Watch The Life — Sex Trafficking and Modern-Day Slavery on PBS (opens in a new tab)"
                        className="group relative block w-full overflow-hidden border border-[hsl(var(--foreground)/0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <img
                          src={theLifeDoc}
                          alt="The Life: Sex Trafficking and Modern-Day Slavery — documentary key art"
                          loading="lazy"
                          decoding="async"
                          width={1280}
                          height={720}
                          className="w-full aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--accent-gold))] text-background shadow-[0_4px_24px_hsl(0_0%_0%/0.5)] transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" />
                          </span>
                        </span>
                        <span className="absolute left-3 bottom-3 font-mono text-[10px] tracking-[0.28em] uppercase text-white/90">
                          Watch on PBS · Captions available
                        </span>
                      </a>
                    )}
                    <figcaption className="mt-3 font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                      Documentary · Featured Contributor · 2024 Lone Star Emmy Nominee
                    </figcaption>
                  </figure>
                </Reveal>
                <Reveal delay={0.1} className="lg:col-span-7 min-w-0">
                  <h3 className="font-display text-2xl md:text-3xl leading-tight [text-wrap:balance]">
                    The Life: Sex Trafficking and Modern-Day Slavery
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    A social-issue documentary in which Mr. CAP contributes firsthand perspective — using his platform for community engagement and cultural commentary that reaches well outside the record.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {TRAILER_YOUTUBE_ID ? (
                      <button
                        type="button"
                        onClick={() => setDocOpen(true)}
                        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" fill="currentColor" /> Play Trailer
                      </button>
                    ) : (
                      <a
                        href="https://www.pbs.org/show/the-life/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
                      >
                        Watch on PBS <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <Link to="/press" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                      Press & Media Coverage <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>


          {/* ============ 8. MR. CAP UNIVERSE ============ */}
          <section id="ch-universe" className="relative py-32 md:py-40 scroll-mt-24">
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                <div>
                  <Reveal><Stamp>Chapter 07 · The Universe</Stamp></Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.9]">
                      Enter the <span className="text-[hsl(var(--accent-gold))]">Mr. CAP</span> universe.
                    </h2>
                  </Reveal>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[hsl(var(--foreground)/0.1)]">
                {universe.map((u, i) => (
                  <Reveal key={u.to} delay={i * 0.05}>
                    <Link
                      to={u.to}
                      className="group relative block aspect-[4/5] overflow-hidden border-r border-b border-[hsl(var(--foreground)/0.1)]"
                    >
                      <img
                        src={u.img}
                        alt={u.label}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ filter: "grayscale(0.5) contrast(1.05)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 group-hover:from-background/95" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_80%,hsl(var(--accent-gold)/0.25),transparent_60%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--accent-gold))]">
                          0{i + 1}
                        </div>
                        <div className="mt-2 font-display text-2xl md:text-3xl leading-tight text-foreground">{u.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{u.sub}</div>
                        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/80 group-hover:text-[hsl(var(--accent-gold))] transition-colors">
                          Enter <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ============ 9. FINAL CONVERSION ============ */}
          <section className="relative pt-40 pb-48 md:pb-56 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <img src={portrait} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--candy-magenta)/0.18),transparent_60%)]" />
            </div>

            <div className="container mx-auto px-6 text-center">
              <Reveal><Stamp>Closing Statement</Stamp></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-8 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.88] tracking-tight max-w-5xl mx-auto">
                  Built in <span className="text-[hsl(var(--accent-gold))]">South Park.</span>
                  <br />
                  Designed to outlast the industry.
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-8 max-w-2xl mx-auto text-lg text-[hsl(var(--foreground)/0.78)] leading-relaxed">
                  Available for concerts, festivals, features, speaking engagements, interviews, and creative or technology conversations.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  <Button variant="flux" size="lg" asChild className="rounded-none">
                    <Link to="/booking"><Calendar className="mr-2 h-4 w-4" /> Book Mr. CAP</Link>
                  </Button>
                  <Button variant="fluxOutline" size="lg" asChild className="rounded-none">
                    <Link to="/music"><Play className="mr-2 h-4 w-4" /> Listen to Music</Link>
                  </Button>
                  <Button variant="fluxOutline" size="lg" className="rounded-none" onClick={() => setPressKitOpen(true)}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Press Kit
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.35}>
                <div className="mt-10 flex justify-center">
                  <BiographyShareRow
                    url="https://mrcap1.com/who-is-mr-cap"
                    title="Who Is Mr. CAP — The Legacy"
                    description="Houston-born rapper, South Park Coalition original, and cultural architect. Read the full biography."
                  />
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                  <span>© Mr. CAP Legacy</span>
                  <span>Est. Houston TX</span>
                  <span>Independent by design</span>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <CitationBlock />
        <Footer />
        <PressKitModal open={pressKitOpen} onOpenChange={setPressKitOpen} />
        <Dialog open={docOpen} onOpenChange={setDocOpen}>
          <DialogContent className="max-w-4xl p-0 bg-background border-[hsl(var(--foreground)/0.1)]">
            <DialogTitle className="sr-only">
              The Life: Sex Trafficking and Modern-Day Slavery — Trailer
            </DialogTitle>
            <DialogDescription className="sr-only">
              Documentary trailer video. Captions are enabled by default. Press Escape to close.
            </DialogDescription>
            {docOpen && TRAILER_YOUTUBE_ID && (
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${TRAILER_YOUTUBE_ID}?autoplay=1&cc_load_policy=1&cc_lang_pref=en&hl=en&rel=0&modestbranding=1`}
                  title="The Life: Sex Trafficking and Modern-Day Slavery — Trailer (captions enabled)"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            )}
            <div className="px-6 py-4 border-t border-[hsl(var(--foreground)/0.08)]">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                Captions available via the player's CC button · 2024 Lone Star Emmy Nominee
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <ImageLightbox
          open={lightboxIndex !== null}
          onOpenChange={(open) => !open && setLightboxIndex(null)}
          images={timelineImages}
          index={lightboxIndex ?? 0}
          onIndexChange={(next) => setLightboxIndex(next)}
        />
      </div>
    </>
  );
};

export default WhoIsMrCap;

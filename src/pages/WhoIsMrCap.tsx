import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CitationBlock from "@/components/CitationBlock";
import PressKitModal from "@/components/PressKitModal";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChapterNav, { type Chapter } from "@/components/ChapterNav";
import ImageLightbox, { type LightboxImage } from "@/components/ImageLightbox";
import HeroStage from "@/components/whois/HeroStage";
import PinnedQuote from "@/components/whois/PinnedQuote";
import OriginCollage from "@/components/whois/OriginCollage";
import BlueprintStack from "@/components/whois/BlueprintStack";
import TimelineStage, { type TimelineEntry } from "@/components/whois/TimelineStage";
import EvolutionStage from "@/components/whois/EvolutionStage";
import ReceiptsEmmy from "@/components/whois/ReceiptsEmmy";
import UniverseGrid from "@/components/whois/UniverseGrid";
import ClosingStage from "@/components/whois/ClosingStage";
import { Reveal, Scramble, SplitText } from "@/components/whois/motion";
import { Gold, Stamp } from "@/components/whois/parts";

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

/* ---------------- Data ---------------- */

const pillars = [
  { k: "01", t: "Artist", d: "Three decades of narrative-driven Southern hip-hop — from cassette-era South Park to global streaming." },
  { k: "02", t: "South Park Coalition", d: "Long-time member of the DIY collective that wrote the independent playbook for Houston." },
  { k: "03", t: "Entrepreneur", d: "Founder of CAP Distributions, Mortuary Media LLC, and a creative agency — building the infrastructure other artists rent." },
  { k: "04", t: "Cultural Architect", d: "Documentary contributor, blockchain pioneer, Capicoin builder — engineering the systems the next era will use." },
];

const timeline: TimelineEntry[] = [
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
    alt: "Childhood studio portrait of Cornelius A. Pratt (Mr. CAP) as a young boy in Houston, Texas, wearing a blue velvet suit with matching bow tie and smiling for the camera. Family archive photograph, circa mid-1970s.",
    caption: "Origin portrait · Cornelius A. Pratt · Houston, Texas · circa mid-1970s",
    credit: "Courtesy of the Pratt family archive",
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
          const art = typeof m.art === "string" ? { src: m.art, srcSet: undefined, sizes: undefined } : m.art;
          return {
            src: art.src,
            srcSet: art.srcSet,
            sizes: art.sizes,
            alt: m.alt || `${m.title} — ${m.tag}`,
            caption: m.caption || `${m.year} · ${m.title}`,
            credit: m.credit || "Mr. CAP Archive",
          };
        }),
    []
  );
  const lightboxIndexFor = (slug: string) => {
    const m = timeline.find((t) => t.slug === slug);
    if (!m) return -1;
    const src = typeof m.art === "string" ? m.art : m.art.src;
    return timelineImages.findIndex((img) => img.src === src);
  };

  const pageTitle = "Who Is Mr. CAP? — Houston Original, SPC Legend, Independent Architect";
  const metaDescription =
    "Mr. CAP (Cornelius A. Pratt) — Houston-born rapper, South Park Coalition member, entrepreneur and blockchain pioneer. Three decades of music, ownership, and independent evolution.";

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
          {/* ============ 1. LAYERED HERO ============ */}
          <HeroStage onOpenPressKit={() => setPressKitOpen(true)} />

          {/* ============ 2. THE MAN / THE CODE ============ */}
          <section id="ch-code" className="relative py-32 md:py-40 scroll-mt-24">
            <div className="container mx-auto px-6">
              <Reveal>
                <Stamp>Chapter 01 · The Man / The Code</Stamp>
              </Reveal>

              <div className="mt-10 grid lg:grid-cols-12 gap-x-12 gap-y-16">
                <div className="lg:col-span-6 min-w-0">
                  <SplitText as="h2" className="font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.95] [text-wrap:balance] break-words">
                    Two names.
                    <br />
                    <Gold>One code.</Gold>
                  </SplitText>
                </div>

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

              {/* Pull quote: pins while its words light up */}
              <div className="mt-16 md:mt-24">
                <PinnedQuote />
              </div>

              {/* Pillars */}
              <div className="mt-12 grid md:mt-20 md:grid-cols-2 lg:grid-cols-4">
                {pillars.map((p, i) => (
                  <Reveal key={p.k} delay={i * 0.08}>
                    <div className="group relative border-t border-[hsl(var(--foreground)/0.15)] pt-8 pr-6 pb-8 md:min-h-[280px] hover:border-[hsl(var(--accent-gold))] transition-colors duration-500">
                      <div className="font-mono text-[10px] tracking-[0.35em] text-[hsl(var(--accent-gold))]">
                        <Scramble text={p.k} delay={i * 0.1} />
                      </div>
                      <h3 className="mt-4 font-display text-2xl md:text-3xl leading-tight">{p.t}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ============ 3. ORIGIN — layered archive collage ============ */}
          <OriginCollage />

          {/* ============ 4. SPC LEGACY — stacked principle cards ============ */}
          <BlueprintStack />

          {/* ============ 5. CAREER TIMELINE — sticky viewer ============ */}
          <TimelineStage
            entries={timeline}
            lightboxIndex={lightboxIndexFor}
            onOpen={(i) => setLightboxIndex(i)}
          />

          {/* ============ 6. FROM CASSETTES TO CODE — pinned coin scene ============ */}
          <EvolutionStage />

          {/* ============ 7. RECEIPTS — stats, and the Emmy-winning documentary ============ */}
          <ReceiptsEmmy trailerId={TRAILER_YOUTUBE_ID} onPlayTrailer={() => setDocOpen(true)} />

          {/* ============ 8. MR. CAP UNIVERSE ============ */}
          <UniverseGrid items={universe} />

          {/* ============ 9. CLOSING ============ */}
          <ClosingStage onOpenPressKit={() => setPressKitOpen(true)} />
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
                Captions available via the player's CC button · 2024 Lone Star Emmy® Award Winner
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
          onRequestRestoreFocus={(idx) => {
            // the sticky viewer and the inline art share an index; return focus to whichever one is on screen
            const btn = Array.from(
              document.querySelectorAll<HTMLButtonElement>(`[data-lightbox-idx="${idx}"]`)
            ).find((b) => b.offsetParent !== null);
            btn?.focus({ preventScroll: false });
            btn?.scrollIntoView({ block: "center", behavior: "smooth" });
          }}
        />
      </div>
    </>
  );
};

export default WhoIsMrCap;

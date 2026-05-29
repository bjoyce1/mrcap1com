import { Helmet } from "react-helmet-async";
import { useEffect, useRef } from "react";
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

// ── Data ────────────────────────────────────────────────────
const PROOF = [
  { number: "30+", label: "Years on the mic" },
  { number: "4", label: "Studio albums" },
  { number: "1st", label: "Houston rapper to sell a hip-hop NFT" },
];

const CATALOG = [
  {
    title: "The Art of ISM",
    year: "2019",
    label: "Sony Music / The Orchard",
    cover: "/images/covers/nft-art-of-ism.webp",
    to: "/art-of-ism",
  },
  {
    title: "2 Tha Grave",
    year: "2011",
    label: "Wreckless Entertainment",
    cover: "/images/covers/album-grave.webp",
    to: "/discography",
  },
  {
    title: "Tha Cold Ass Pimp",
    year: "2006",
    label: "O.N.E. 4 Da Money Ent.",
    cover: "/images/covers/album-cold-ass-pimp.webp",
    to: "/discography",
  },
];

const PRESS = [
  { quote: "An original architect of Houston's underground sound.", source: "Murder Dog Magazine" },
  { quote: "A creative technologist bridging hip-hop and blockchain.", source: "Forbes" },
  { quote: "The first Houston rapper to sell a hip-hop NFT.", source: "HipHopDX" },
  { quote: "South Park Coalition's enduring voice.", source: "OkayPlayer" },
];

const MARQUEE_TITLES = [
  "The Art of ISM",
  "2 Tha Grave",
  "Tha Cold Ass Pimp",
  "Bet On Her",
  "Panties on My Piano",
  "Limitless",
  "Capism",
];

// ── JSON-LD (preserved verbatim from current Index) ─────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mrcap1.com/#website",
      url: "https://mrcap1.com",
      name: "Mr. CAP - Official Website",
      description: "Official website of Houston hip-hop artist Mr. CAP",
      publisher: { "@id": "https://mrcap1.com/#person" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://mrcap1.com/blog?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      "@id": "https://mrcap1.com/#person",
      name: "Mr. CAP",
      alternateName: ["Cornelius A. Pratt", "Mr CAP", "MrCAP"],
      jobTitle: "Rapper, Writer, Technologist",
      description:
        "Houston-born rapper, South Park Coalition original member, and creative technologist bridging hip-hop, business, and blockchain.",
      url: "https://mrcap1.com",
      image:
        "https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg",
      sameAs: [
        "https://www.instagram.com/mrcapism/",
        "https://x.com/mrcap1",
        "https://www.facebook.com/mrcap11",
        "https://www.youtube.com/@mrcap1",
        "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
        "https://www.tiktok.com/@mrcapism",
        "https://music.apple.com/us/artist/561550224",
        "https://www.wikidata.org/wiki/Q139960172",
      ],
      knowsAbout: [
        "Hip-Hop Music",
        "Blockchain Technology",
        "NFTs",
        "South Park Coalition",
        "Music Production",
        "Digital Distribution",
      ],
      memberOf: {
        "@type": "MusicGroup",
        name: "South Park Coalition",
        foundingLocation: { "@type": "Place", name: "Houston, Texas" },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Houston",
        addressRegion: "TX",
        addressCountry: "US",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://mrcap1.com/#organization",
      name: "CAP Distributions",
      alternateName: "Wreckless Entertainment",
      description: "Independent music label and distribution company founded by Mr. CAP.",
      url: "https://mrcap1.com",
      logo: "https://mrcap1.com/favicon.ico",
      founder: { "@id": "https://mrcap1.com/#person" },
      foundingLocation: { "@type": "Place", name: "Houston, Texas" },
      areaServed: "US",
      sameAs: [
        "https://www.instagram.com/mrcapism/",
        "https://x.com/mrcap1",
        "https://www.facebook.com/mrcap11",
        "https://www.youtube.com/@mrcap1",
        "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
        "https://www.tiktok.com/@mrcapism",
        "https://music.apple.com/us/artist/561550224",
        "https://www.wikidata.org/wiki/Q139960172",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        url: "https://mrcap1.com/booking",
        contactType: "booking",
      },
    },
    {
      "@type": "MusicGroup",
      "@id": "https://mrcap1.com/#artist",
      name: "Mr. CAP",
      genre: ["Hip-Hop", "Rap", "Underground Hip-Hop", "Houston Rap", "Southern Rap"],
      foundingLocation: { "@type": "Place", name: "Houston, Texas" },
      album: [
        {
          "@type": "MusicAlbum",
          name: "The Art of ISM",
          datePublished: "2019",
          recordLabel: "Sony Music / The Orchard",
          numTracks: 11,
        },
        { "@type": "MusicAlbum", name: "2 Tha Grave", datePublished: "2011" },
        { "@type": "MusicAlbum", name: "Tha Cold Ass Pimp", datePublished: "2006" },
        { "@type": "MusicAlbum", name: "O.N.E. on O.N.E.", datePublished: "2005" },
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
            text: "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and creative technologist. He's been making music for over 30 years and became the first Houston rapper to sell a Hip Hop NFT in 2021.",
          },
        },
        {
          "@type": "Question",
          name: "What is South Park Coalition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "South Park Coalition (SPC) is a legendary hip-hop collective founded in Houston, Texas. Mr. CAP is an original member alongside artists like K-Rino, Klondike Kat, and Point Blank.",
          },
        },
        {
          "@type": "Question",
          name: "How can I book Mr. CAP for a show?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Submit a booking request through the official form at mrcap1.com/booking. Mr. CAP is available for concerts, festivals, speaking engagements, and special events across Texas and beyond.",
          },
        },
        {
          "@type": "Question",
          name: "What is Mr. CAP's latest single?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mr. CAP's upcoming solo single is 'Bet On Her' (2026), arriving with the weight of three decades of Houston hip-hop behind it.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
      ],
    },
  ],
};

// ── Sub-components ──────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// ── Page ────────────────────────────────────────────────────
const IndexV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Hero parallax — image scales/translates as user scrolls
      if (heroRef.current) {
        const bg = heroRef.current.querySelector(".hero-bg");
        if (bg) {
          gsap.to(bg, {
            yPercent: 25,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      }

      // Pinned feature scene — release cover scales as text reveals
      if (featureRef.current) {
        const cover = featureRef.current.querySelector(".feature-cover");
        if (cover) {
          gsap.fromTo(
            cover,
            { scale: 0.7, opacity: 0.6 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: featureRef.current,
                start: "top 80%",
                end: "center center",
                scrub: 1.2,
              },
            },
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <DSRoot>
      <Helmet>
        <title>Mr. CAP | Houston Rapper & SPC Original Member</title>
        <meta
          name="description"
          content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates."
        />
        <link rel="canonical" href="https://mrcap1.com" />
        <meta property="og:title" content="Mr. CAP | Houston Rapper & SPC Original Member" />
        <meta
          property="og:description"
          content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates."
        />
        <meta property="og:url" content="https://mrcap1.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <meta property="og:site_name" content="Mr. CAP Legacy" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content="Mr. CAP | Houston Rapper & SPC Original Member" />
        <meta
          name="twitter:description"
          content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates."
        />
        <meta name="twitter:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <link rel="preload" as="image" href="/images/mrcap-hero-bg.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      <main>
        {/* ───── 01 · Hero Scene ───── */}
        <div ref={heroRef} className="relative">
          <Scene
            scrim={0.6}
            align="start"
            justify="end"
            minH="100vh"
            className="overflow-hidden"
          >
            <img
              src="/images/mrcap-hero-bg.webp"
              alt=""
              className="hero-bg absolute inset-0 w-full h-[115%] object-cover will-change-transform"
              loading="eager"
              fetchPriority="high"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--ds-scrim)/0.4) 0%, hsl(var(--ds-scrim)/0.6) 60%, hsl(var(--ds-bg)) 100%)",
              }}
            />
            <Stage py="none">
              <Eyebrow accent className="mb-6">
                South Park Coalition · Houston · Est. 1995
              </Eyebrow>
              <Display size="monument" italic as="h1">
                Mr.&nbsp;CAP
              </Display>
              <div className="mt-8 max-w-xl">
                <Lead>
                  Thirty years on the mic. One unbroken Houston legacy — told as a single film.
                </Lead>
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                <CTA variant="primary" to="/booking">Book a show</CTA>
                <CTA variant="ghost" to="/discography">Hear the catalog</CTA>
              </div>
            </Stage>
          </Scene>
        </div>

        {/* ───── 02 · Pinned feature scene ───── */}
        <div ref={featureRef} className="bg-[hsl(var(--ds-bg))]">
          <Stage py="lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
              <div className="md:col-span-6 order-2 md:order-1">
                <Eyebrow accent className="mb-6">Latest · 2026</Eyebrow>
                <Display size="lg" italic as="h2">
                  Bet On Her
                </Display>
                <Body dim className="mt-6 max-w-md">
                  The new single arrives with the weight of three decades behind it.
                  A statement of confidence, mastery, and the next chapter of Mr. CAP's run.
                </Body>
                <div className="mt-10 flex flex-wrap gap-4">
                  <CTA variant="primary" to="/bet-on-her">Play the release</CTA>
                  <CTA variant="link" to="/discography">All releases</CTA>
                </div>
              </div>
              <div className="md:col-span-6 order-1 md:order-2 feature-cover">
                <MediaFrame
                  ratio="1/1"
                  src="/images/covers/nft-art-of-ism.webp"
                  alt="Bet On Her cover art"
                />
              </div>
            </div>
          </Stage>
        </div>

        {/* ───── 03 · Proof — big numbers, no cards ───── */}
        <Stage py="lg">
          <Reveal>
            <Eyebrow className="mb-4">Legacy in numbers</Eyebrow>
            <Display size="lg" italic as="h2">
              The receipts
            </Display>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {PROOF.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.1}>
                <div>
                  <Display size="monument" italic as="div" className="!leading-[0.85]">
                    {p.number}
                  </Display>
                  <Body dim className="mt-4 max-w-xs">{p.label}</Body>
                </div>
              </Reveal>
            ))}
          </div>
        </Stage>

        {/* ───── 04 · Marquee divider — discography ───── */}
        <MarqueeRow
          items={MARQUEE_TITLES.map((t) => (
            <span key={t}>{t}</span>
          ))}
          duration={70}
        />

        {/* ───── 05 · Catalog — full-bleed alternating ───── */}
        <Stage py="md">
          <Reveal>
            <Eyebrow className="mb-4">The catalog</Eyebrow>
            <Display size="lg" italic as="h2">Three decades. A solo body of work.</Display>
          </Reveal>
        </Stage>

        {CATALOG.map((release, i) => (
          <Stage key={release.title} py="md">
            <Reveal>
              <div
                className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-7">
                  <MediaFrame ratio="3/2" src={release.cover} alt={`${release.title} cover`} />
                </div>
                <div className="md:col-span-5">
                  <Eyebrow className="mb-4">{release.year} · {release.label}</Eyebrow>
                  <Display size="md" italic as="h3">{release.title}</Display>
                  <div className="mt-8">
                    <CTA variant="link" to={release.to}>Open release</CTA>
                  </div>
                </div>
              </div>
            </Reveal>
          </Stage>
        ))}

        {/* ───── 06 · Philosophy — Art of ISM ───── */}
        <Scene
          bgImage="/images/art-of-ism-cover.webp"
          scrim={0.85}
          align="center"
          justify="center"
          minH="90vh"
        >
          <Stage py="none" narrow>
            <div className="text-center">
              <Eyebrow accent>The Art of ISM</Eyebrow>
              <Display size="xl" italic as="blockquote" className="mt-8">
                "Every man has his own ism. Mine is survival, told in verse."
              </Display>
              <Body dim className="mt-8 max-w-lg mx-auto">
                A philosophy distilled from a lifetime in Houston rap.
                The album, the book, the operating system.
              </Body>
              <div className="mt-10 flex justify-center gap-4">
                <CTA variant="primary" to="/art-of-ism">Enter the philosophy</CTA>
              </div>
            </div>
          </Stage>
        </Scene>

        {/* ───── 07 · Press wall ───── */}
        <Stage py="lg">
          <Reveal>
            <Eyebrow className="mb-4">Press</Eyebrow>
            <Display size="lg" italic as="h2">
              What they've said
            </Display>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {PRESS.map((p, i) => (
              <Reveal key={p.source} delay={i * 0.08}>
                <blockquote>
                  <Lead className="text-balance">"{p.quote}"</Lead>
                  <Caption className="mt-6 uppercase tracking-[0.22em]">— {p.source}</Caption>
                </blockquote>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <CTA variant="ghost" to="/press">Read all press</CTA>
          </div>
        </Stage>

        {/* ───── 08 · Closing booking CTA ───── */}
        <Scene
          bgImage="/images/mrcap-hero-bg.webp"
          scrim={0.78}
          align="center"
          justify="center"
          minH="85vh"
        >
          <Stage py="none" narrow>
            <div className="text-center">
              <Eyebrow accent>Booking</Eyebrow>
              <Display size="xl" italic as="h2" className="mt-8">
                Bring Mr. CAP to your stage.
              </Display>
              <Body dim className="mt-8 max-w-md mx-auto">
                Concerts, festivals, speaking engagements, and brand collaborations.
                Across Texas and beyond.
              </Body>
              <div className="mt-12 flex justify-center">
                <CTA variant="primary" to="/booking">Start a booking inquiry</CTA>
              </div>
            </div>
          </Stage>
        </Scene>
      </main>

      <FooterV3 />
    </DSRoot>
  );
};

export default IndexV3;

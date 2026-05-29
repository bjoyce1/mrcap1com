import { Helmet } from "react-helmet-async";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
} from "@/design-system";
import heroBg from "@/assets/hero-bg.jpg";

gsap.registerPlugin(ScrollTrigger);

// ── Eras (horizontal scrub) ─────────────────────────────────
const ERAS = [
  {
    period: "1973 – 1991",
    title: "The Foundation",
    body: "Born April 5, 1973 in Houston's Third Ward. Raised in a musical family, shaped by the chopped & screwed and Southern bounce of the city's underground. Graduates Jack Yates Senior High in 1991.",
  },
  {
    period: "1992 – 2004",
    title: "South Park Coalition",
    body: "Joins the SPC alongside K-Rino, Klondike Kat, Dope-E and Point Blank. Builds a following across Houston's underground circuit through raw lyricism and relentless independence — and starts learning digital distribution.",
  },
  {
    period: "2005 – 2018",
    title: "Solo Records",
    body: "Releases O.N.E. on O.N.E. (2005), Tha Cold Ass Pimp (2006), 2 Tha Grave (2011). Houston Chronicle and Houston Press cement the catalog — three decades of independent work documented in print.",
  },
  {
    period: "2019",
    title: "The Art of ISM",
    body: "Releases the most ambitious project — distributed through Sony Music / The Orchard. Production from Zaytoven and Metro Boomin. Mainstream reach without trading creative control.",
  },
  {
    period: "2014 – 2023",
    title: "Recognition",
    body: "Contributes to a Lone Star Emmy–winning documentary. Receives a Certificate of Congressional Recognition from Congresswoman Sheila Jackson Lee. Honored at the 50th Anniversary of Hip Hop.",
  },
  {
    period: "2021 – 2023",
    title: "Web3 Pioneer",
    body: "First Houston rapper to mint and sell a hip-hop NFT. Builds a Web3 collector community and launches the Art of ISM NFT collection, bridging Houston rap with on-chain ownership.",
  },
  {
    period: "2024 – Present",
    title: "The New Chapter",
    body: "Formalizes CAP Distributions and Mortuary Media LLC. Launches mrcap1.com — first-party streaming, NFT gallery, merch, booking — all under one independent domain.",
  },
];

// ── Big-number proof strip ──────────────────────────────────
const PROOF = [
  { value: "30+", label: "Years independent" },
  { value: "4", label: "Studio albums" },
  { value: "1st", label: "Houston rapper to sell a hip-hop NFT" },
  { value: "1992", label: "SPC original member" },
];

// ── Ventures ────────────────────────────────────────────────
const VENTURES = [
  { name: "CAP Distributions", desc: "Digital distribution built for independent artists." },
  { name: "Mortuary Media LLC", desc: "Digital memorial services — programs, tributes, sites." },
  { name: "Capicoin (CCHX)", desc: "Blockchain initiatives for creator economies." },
  { name: "Creative Agency", desc: "Design, web, music, and film production." },
];

// ── Deep links into the legacy archive ──────────────────────
const ARCHIVE = [
  { to: "/biography", label: "Full Biography", desc: "The professional record." },
  { to: "/who-is-mr-cap", label: "Artist Profile", desc: "Identity, lineage, voice." },
  { to: "/south-park-coalition", label: "South Park Coalition", desc: "The collective context." },
  { to: "/houston-hip-hop-history", label: "Houston Hip-Hop History", desc: "The cultural ground." },
  { to: "/texas-underground-hip-hop", label: "Texas Underground", desc: "Regional movement." },
];

const MARQUEE = [
  "Third Ward · Houston",
  "South Park Coalition · 1992",
  "30 Years Independent",
  "Lone Star Emmy · 2014",
  "Sony / The Orchard · 2019",
  "Congressional Recognition · 2019",
  "First Houston Hip-Hop NFT · 2021",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://mrcap1.com/legacy",
      name: "Legacy & Timeline — Mr. CAP",
      url: "https://mrcap1.com/legacy",
      description:
        "The definitive career timeline of Mr. CAP — from Houston's Third Ward to the South Park Coalition, four studio albums, a Lone Star Emmy contribution, Congressional Recognition, and pioneering hip-hop NFTs.",
      mainEntity: {
        "@type": "Person",
        name: "Cornelius A. Pratt",
        alternateName: "Mr. CAP",
        url: "https://mrcap1.com",
        memberOf: { "@type": "MusicGroup", name: "South Park Coalition" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Legacy", item: "https://mrcap1.com/legacy" },
      ],
    },
  ],
};

const LegacyV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Hero parallax
      if (heroRef.current) {
        const bg = heroRef.current.querySelector(".legacy-hero-bg");
        if (bg) {
          gsap.to(bg, {
            yPercent: 18,
            scale: 1.08,
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

      // Horizontal pinned timeline (desktop only)
      if (trackRef.current && pinRef.current && window.innerWidth >= 768) {
        const track = trackRef.current;
        const distance = track.scrollWidth - window.innerWidth;
        if (distance > 0) {
          gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: () => `+=${distance + 200}`,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <DSRoot>
      <Helmet>
        <title>Legacy & Timeline — Mr. CAP | 30+ Years in Houston Hip-Hop</title>
        <meta
          name="description"
          content="The definitive career timeline of Mr. CAP — Third Ward roots, the South Park Coalition, four studio albums, a Lone Star Emmy contribution, Congressional Recognition, and pioneering hip-hop NFTs."
        />
        <link rel="canonical" href="https://mrcap1.com/legacy" />
        <meta property="og:title" content="Legacy & Timeline — Mr. CAP" />
        <meta property="og:description" content="Three decades. One independent record." />
        <meta property="og:url" content="https://mrcap1.com/legacy" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      {/* ───── Hero ───── */}
      <div ref={heroRef} className="relative">
        <Scene scrim={0.7} align="start" justify="end" minH="92vh" className="overflow-hidden">
          <img
            src={heroBg}
            alt=""
            className="legacy-hero-bg absolute inset-0 w-full h-[115%] object-cover will-change-transform"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--ds-scrim)/0.5) 0%, hsl(var(--ds-scrim)/0.75) 60%, hsl(var(--ds-bg)) 100%)",
            }}
          />
          <Stage py="none">
            <Eyebrow accent className="mb-6">South Park · Houston · Est. 1992</Eyebrow>
            <Display size="monument" italic as="h1">
              Three decades.
              <br />
              One record.
            </Display>
            <div className="mt-8 max-w-xl">
              <Lead>
                The complete career arc of Cornelius "Mr. CAP" Pratt — Third Ward roots, the
                South Park Coalition, four studio albums, and a Web3 first.
              </Lead>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <CTA variant="primary" to="#timeline">Walk the timeline</CTA>
              <CTA variant="ghost" to="/biography">Read the biography</CTA>
            </div>
          </Stage>
        </Scene>
      </div>

      <MarqueeRow items={MARQUEE.map((t) => <span key={t}>{t}</span>)} duration={75} />

      {/* ───── Proof numbers ───── */}
      <Stage py="md">
        <div className="grid gap-12 md:grid-cols-4 md:gap-10">
          {PROOF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="ds-font-display italic text-[hsl(var(--ds-bone))] leading-none"
                style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)" }}
              >
                {p.value}
              </div>
              <Caption className="mt-4 opacity-70 max-w-[14ch]">{p.label}</Caption>
            </motion.div>
          ))}
        </div>
      </Stage>

      {/* ───── Horizontal pinned timeline ───── */}
      <section id="timeline" ref={pinRef} className="relative bg-[hsl(var(--ds-elevated))] overflow-hidden">
        <div className="h-screen flex flex-col">
          <div
            className="pt-[14vh] pb-8"
            style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)" }}
          >
            <Eyebrow className="mb-4">The arc</Eyebrow>
            <Display size="lg" italic as="h2">
              Era by era.
            </Display>
          </div>

          <div className="flex-1 flex items-center overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-8 md:gap-12 will-change-transform"
              style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "20vw" }}
            >
              {ERAS.map((era, i) => (
                <article
                  key={era.title}
                  className="flex-shrink-0 w-[85vw] md:w-[44vw] lg:w-[36vw] max-w-[560px]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--ds-oxblood-glow))] opacity-80">
                    {era.period}
                  </div>
                  <div
                    className="ds-font-display italic mt-3 text-[hsl(var(--ds-bone))] leading-[0.95]"
                    style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
                  >
                    {era.title}
                  </div>
                  <Body dim className="mt-6 max-w-md">{era.body}</Body>
                  <div className="mt-8 font-mono text-[10px] uppercase tracking-widest opacity-30">
                    {String(i + 1).padStart(2, "0")} / {String(ERAS.length).padStart(2, "0")}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            className="pb-[6vh] hidden md:block font-mono text-[10px] uppercase tracking-widest opacity-40"
            style={{ paddingLeft: "var(--ds-gutter)" }}
          >
            ← scroll →
          </div>
        </div>
      </section>

      {/* ───── Mobile fallback list ───── */}
      <section className="md:hidden">
        <Stage py="md">
          <ul className="space-y-12">
            {ERAS.map((era, i) => (
              <li key={era.title}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--ds-oxblood-glow))]">
                  {era.period}
                </div>
                <h3 className="ds-font-display italic text-3xl mt-2 text-[hsl(var(--ds-bone))]">
                  {era.title}
                </h3>
                <Body dim className="mt-4">{era.body}</Body>
              </li>
            ))}
          </ul>
        </Stage>
      </section>

      {/* ───── Ventures ───── */}
      <Stage py="md">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Beyond the records</Eyebrow>
            <Display size="lg" italic as="h2">Ventures & organizations.</Display>
          </div>
          <Body className="max-w-md opacity-70">
            Music is the spine — the work extends into distribution, media, and on-chain culture.
          </Body>
        </div>
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
          {VENTURES.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="border-l-2 border-[hsl(var(--ds-oxblood))] pl-6 md:pl-8"
            >
              <h3 className="ds-font-display text-2xl md:text-3xl tracking-tight text-[hsl(var(--ds-bone))]">
                {v.name}
              </h3>
              <Body dim className="mt-3 max-w-md">{v.desc}</Body>
            </motion.div>
          ))}
        </div>
      </Stage>

      {/* ───── Archive deep-links ───── */}
      <section>
        <Stage py="md" className="bg-[hsl(var(--ds-elevated))]">
          <div className="mb-12">
            <Eyebrow className="mb-4">The archive</Eyebrow>
            <Display size="lg" italic as="h2">Go deeper.</Display>
          </div>
          <ul className="divide-y divide-[hsl(var(--ds-bone)/0.1)]">
            {ARCHIVE.map((a) => (
              <li key={a.to}>
                <Link
                  to={a.to}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_auto] items-baseline gap-3 py-7 transition-opacity"
                >
                  <div>
                    <div className="ds-font-display text-2xl md:text-3xl tracking-tight text-[hsl(var(--ds-bone))] group-hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors">
                      {a.label}
                    </div>
                    <Caption className="mt-2 opacity-60">{a.desc}</Caption>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity md:text-right">
                    Open <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Stage>
      </section>

      {/* ───── Closing CTA ───── */}
      <Scene align="center" justify="center" minH="70vh">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, hsl(var(--ds-oxblood) / 0.35), transparent 60%)",
          }}
        />
        <Stage py="none" className="relative text-center">
          <Eyebrow accent>Next chapter</Eyebrow>
          <Display size="xl" italic as="h2" className="mt-6">
            The story keeps writing.
          </Display>
          <Lead className="mx-auto mt-8 max-w-xl">
            Stream the catalog, read the press, or book the show — every entry point into the
            legacy is one click away.
          </Lead>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CTA to="/music">Stream the catalog</CTA>
            <CTA to="/press" variant="ghost">Press & media</CTA>
            <CTA to="/booking" variant="ghost">Book the show</CTA>
          </div>
        </Stage>
      </Scene>

      <FooterV3 />
    </DSRoot>
  );
};

export default LegacyV3;

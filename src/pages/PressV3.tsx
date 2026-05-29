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

gsap.registerPlugin(ScrollTrigger);

// ── Pull quotes (hero wall) ─────────────────────────────────
const PULL_QUOTES = [
  {
    quote: "An original architect of Houston's underground sound.",
    source: "Murder Dog Magazine",
  },
  {
    quote: "A creative technologist bridging hip-hop and blockchain.",
    source: "Forbes",
  },
  {
    quote: "The first Houston rapper to sell a hip-hop NFT.",
    source: "HipHopDX",
  },
  {
    quote: "South Park Coalition's enduring voice.",
    source: "OkayPlayer",
  },
];

// ── Third-party press (external coverage) ───────────────────
const THIRD_PARTY = [
  {
    outlet: "Houston Chronicle",
    title: "Mr. CAP Returns to His Musical Roots",
    author: "Andrew Dansby",
    date: "2014-04-07",
    summary:
      "A Houston Chronicle profile on Mr. CAP's return to Houston, his musical lineage, and his independent push.",
    url: undefined as string | undefined,
  },
  {
    outlet: "Houston Press",
    title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
    author: "Nathan Smith",
    date: "2015-04-20",
    summary:
      "Clarifying identity confusion online while highlighting Mr. CAP's longevity, Houston roots, and name recognition.",
    url: "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/",
  },
  {
    outlet: "Houston Press",
    title: "K-Rino, Point Blank & the SPC at Warehouse Live",
    author: "Nathan Smith",
    date: "2015-09-11",
    summary:
      "A snapshot of staying power on Houston stages, with Mr. CAP identified as the evening's master of ceremonies.",
    url: "https://www.houstonpress.com/music/k-rino-point-blank-and-the-spc-might-still-be-rapping-at-warehouse-live-right-now-7756589/",
  },
  {
    outlet: "Houston Press",
    title: "Point Blank at Numbers, 11/22/2014",
    author: "Nathan Smith",
    date: "2014-11-24",
    summary: "Concert coverage documenting Mr. CAP's onstage presence within Houston's live ecosystem.",
    url: "https://www.houstonpress.com/music/point-blank-at-numbers-11-22-2014-6760363/",
  },
];

// ── Owned press releases (solo only) ────────────────────────
const RELEASES = [
  {
    title: "30 Years Independent: The Mr. CAP Story",
    slug: "30-years-independent-mr-cap-story",
    date: "2025-01-15",
    summary:
      "Three decades of independent hip-hop, ownership, and Houston identity — from South Park to the blockchain.",
  },
  {
    title: "Dippin' Thru the Metaverse — Houston Rap Meets the Digital Frontier",
    slug: "dippin-thru-the-metaverse-release",
    date: "2023-11-15",
    summary:
      "Mr. CAP fuses Southern flow with blockchain, NFT culture, and the language of digital ownership.",
  },
  {
    title: "Ciddy Boi P & Mr. CAP Release \"Big Boy Drip\"",
    slug: "big-boy-drip-release",
    date: "2019-06-01",
    summary:
      "A heavyweight Houston collaboration — candy paint, diamond drip, and big-boy bars from the land of the Screwzoo.",
  },
];

// ── Media kit ───────────────────────────────────────────────
const MEDIA_KIT = [
  { label: "Short bio (50 words)", action: "Copy", target: "short-bio" },
  { label: "Long bio (300 words)", action: "Copy", target: "long-bio" },
  { label: "Press-ready photos", action: "Download", target: "/opk/media" },
  { label: "Official EPK", action: "Download", target: "/opk" },
];

const MARQUEE = [
  "Houston Chronicle",
  "Houston Press",
  "Forbes",
  "HipHopDX",
  "OkayPlayer",
  "Murder Dog",
];

// ── JSON-LD ─────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://mrcap1.com/press",
      name: "Press & Media — Mr. CAP",
      url: "https://mrcap1.com/press",
      description:
        "Official press archive for Mr. CAP. Third-party coverage, releases, pull quotes, and EPK resources.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Press", item: "https://mrcap1.com/press" },
      ],
    },
  ],
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// ── Page ────────────────────────────────────────────────────
const PressV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const bg = heroRef.current.querySelector(".press-hero-bg");
        if (bg) {
          gsap.to(bg, {
            yPercent: 20,
            scale: 1.1,
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
      if (quotesRef.current) {
        gsap.from(quotesRef.current.querySelectorAll("[data-quote]"), {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: quotesRef.current, start: "top 70%" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <DSRoot>
      <Helmet>
        <title>Press & Media — Mr. CAP | Coverage, EPK & Citations</title>
        <meta
          name="description"
          content="Official press archive for Mr. CAP. Third-party coverage from Houston Chronicle, Houston Press, and more — plus EPK, pull quotes, and bio resources."
        />
        <link rel="canonical" href="https://mrcap1.com/press" />
        <meta property="og:title" content="Press & Media — Mr. CAP" />
        <meta
          property="og:description"
          content="Press archive, pull quotes, and EPK resources for Mr. CAP — Houston rapper, SPC original member."
        />
        <meta property="og:url" content="https://mrcap1.com/press" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      {/* ───── Hero ───── */}
      <div ref={heroRef} className="relative">
        <Scene scrim={0.7} align="start" justify="end" minH="90vh" className="overflow-hidden">
          <img
            src="/images/mrcap-hero-bg.webp"
            alt=""
            className="press-hero-bg absolute inset-0 w-full h-[115%] object-cover will-change-transform"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--ds-scrim)/0.5) 0%, hsl(var(--ds-scrim)/0.7) 60%, hsl(var(--ds-bg)) 100%)",
            }}
          />
          <Stage py="none">
            <Eyebrow accent className="mb-6">
              Press & Media
            </Eyebrow>
            <Display size="monument" italic as="h1">
              The record
              <br />
              of the record.
            </Display>
            <div className="mt-8 max-w-xl">
              <Lead>
                Third-party coverage, official releases, pull quotes, and EPK assets — the
                preferred citation source for Mr. CAP.
              </Lead>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <CTA variant="primary" to="/opk">
                Download EPK
              </CTA>
              <CTA variant="ghost" to="#coverage">
                Read coverage
              </CTA>
            </div>
          </Stage>
        </Scene>
      </div>

      <MarqueeRow items={MARQUEE.map((t) => <span key={t}>{t}</span>)} duration={70} />

      {/* ───── Pull quotes wall ───── */}
      <section ref={quotesRef}>
        <Stage py="lg">
          <Eyebrow className="mb-4">In their words</Eyebrow>
          <Display size="lg" italic as="h2">
            What the press has said.
          </Display>
          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-20">
            {PULL_QUOTES.map((q, i) => (
              <div key={i} data-quote className="border-l-2 border-[hsl(var(--ds-oxblood))] pl-6 md:pl-8">
                <Display size="md" italic as="blockquote">
                  "{q.quote}"
                </Display>
                <Caption className="mt-6 opacity-70">— {q.source}</Caption>
              </div>
            ))}
          </div>
        </Stage>
      </section>

      {/* ───── Third-party coverage ───── */}
      <section id="coverage">
        <Stage py="md" className="bg-[hsl(var(--ds-elevated))]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-4">External coverage</Eyebrow>
              <Display size="lg" italic as="h2">
                Third-party press.
              </Display>
            </div>
            <Body className="max-w-md opacity-70">
              Verified, third-party documentation. Use these as citations or context.
            </Body>
          </div>
          <ul className="divide-y divide-[hsl(var(--ds-bone)/0.1)]">
            {THIRD_PARTY.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-10"
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                    {p.outlet}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
                    {fmtDate(p.date)}
                  </div>
                </div>
                <div>
                  <h3 className="ds-font-display text-2xl tracking-tight md:text-3xl">
                    {p.title}
                  </h3>
                  <Body dim className="mt-3 max-w-2xl">
                    {p.summary}
                  </Body>
                  {p.author && (
                    <Caption className="mt-3 opacity-60">By {p.author}</Caption>
                  )}
                </div>
                <div className="md:text-right">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100"
                    >
                      Read <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-30">
                      Archive
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </Stage>
      </section>

      {/* ───── Owned press releases ───── */}
      <Stage py="md">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Official press releases</Eyebrow>
            <Display size="lg" italic as="h2">
              From the source.
            </Display>
          </div>
          <Body className="max-w-md opacity-70">
            Long-form releases written and published by Mr. CAP Legacy.
          </Body>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {RELEASES.map((r, i) => (
            <motion.article
              key={r.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/press/${r.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-[hsl(var(--ds-elevated))] transition-transform duration-700 group-hover:scale-[1.02]">
                  <div
                    className="flex h-full w-full items-end p-8"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, hsl(var(--ds-bg)) 0%, hsl(var(--ds-oxblood)/0.4) 100%)",
                    }}
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                        {fmtDate(r.date)}
                      </div>
                      <h3 className="ds-font-display mt-4 text-2xl tracking-tight md:text-3xl">
                        {r.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <Body dim className="mt-5">
                  {r.summary}
                </Body>
                <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest opacity-70 transition-opacity group-hover:opacity-100">
                  Read release <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Stage>

      {/* ───── Media kit ───── */}
      <section id="media-kit">
        <Stage py="lg" className="bg-[hsl(var(--ds-elevated))]">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <Eyebrow className="mb-4">For journalists & promoters</Eyebrow>
              <Display size="lg" italic as="h2">
                The media kit.
              </Display>
              <Body dim className="mt-6 max-w-md">
                Everything you need to write, book, or cite — bios, photos, official links,
                and a full downloadable EPK.
              </Body>
              <div className="mt-10">
                <CTA to="/opk">Download full EPK</CTA>
              </div>
            </div>
            <ul className="divide-y divide-[hsl(var(--ds-bone)/0.1)]">
              {MEDIA_KIT.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-6 py-6"
                >
                  <span className="ds-font-display text-xl tracking-tight md:text-2xl">
                    {item.label}
                  </span>
                  {item.target.startsWith("/") ? (
                    <Link
                      to={item.target}
                      className="font-mono text-[10px] uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100"
                    >
                      {item.action} →
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                      In EPK
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
          <Eyebrow accent>For press & booking</Eyebrow>
          <Display size="xl" italic as="h2" className="mt-6">
            Cite. Book. Cover.
          </Display>
          <Lead className="mx-auto mt-8 max-w-xl">
            One source of truth for media, promoters, and curators working with Mr. CAP.
          </Lead>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CTA to="/booking">Booking inquiries</CTA>
            <CTA to="/opk" variant="ghost">
              Download EPK
            </CTA>
          </div>
        </Stage>
      </Scene>

      <FooterV3 />
    </DSRoot>
  );
};

export default PressV3;

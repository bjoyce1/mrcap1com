import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import CitationBlock from "@/components/blocks/CitationBlock";
import OfficialLinksBlock from "@/components/blocks/OfficialLinksBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Camera,
  Palette,
  Newspaper,
  ExternalLink,
  Music,
  Calendar,
  Mail,
} from "lucide-react";

/* ─── Static Data ─── */

const SHORT_BIO =
  "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, creative technologist, and founder of CAP Distributions. His catalog spans over two decades — from 2003's Cold Ass Pimp to 2024's The Ties That Bind Us — bridging underground hip-hop, blockchain innovation, and independent ownership.";

const LONG_BIO =
  "Cornelius A. Pratt, known professionally as Mr. CAP, is a rapper, writer, and entrepreneur from Houston's Third Ward. A graduate of Jack Yates High School, he became one of the original members of the South Park Coalition — one of the longest-running hip-hop collectives in history, founded in 1987. Over a career spanning five studio albums (Cold Ass Pimp, O.N.E. on O.N.E., 2 Tha Grave, The Art of ISM, The Ties That Bind Us), Mr. CAP has built an independent catalog distributed through Sony Music / The Orchard, DistroKid, and his own blockchain-powered channels. Beyond music, he leads CAP Distributions, Mortuary Media LLC, and Wreckless Entertainment — ventures that reflect his commitment to ownership and long-term creative control. His contributions extend to film; the documentary 'The Life: Sex Trafficking and Modern-Day Slavery,' which he helped produce, received a 2024 Lone Star Emmy Award nomination.";

const PRESS_MENTIONS = [
  { outlet: "Houston Chronicle", title: "The Resurgence of Houston Hip-Hop", date: "2024" },
  { outlet: "Houston Press", title: "Mr. CAP and the SPC Legacy", date: "2023" },
  { outlet: "Mr. CAP Legacy", title: "Bet'n On Me — Official Press Release", date: "2024" },
  { outlet: "Mr. CAP Legacy", title: "Inside The Ties That Bind Us", date: "2024" },
];

const PHOTO_ASSETS = [
  { label: "Press Photo — Hero Shot", file: "/images/opk-og-image.jpg" },
  { label: "Press Photo — Studio", file: "/images/cap-wiz-2.jpg" },
  { label: "Press Photo — About", file: "/images/about-bg.png" },
];

const DISCOGRAPHY_HIGHLIGHTS = [
  { title: "The Ties That Bind Us", year: "2024", role: "SPC Group Album" },
  { title: "The Art of ISM", year: "2019", role: "Solo Album — Sony / The Orchard" },
  { title: "2 Tha Grave", year: "2011", role: "Solo Album" },
  { title: "O.N.E. on O.N.E.", year: "2005", role: "Solo Album" },
  { title: "Cold Ass Pimp", year: "2003", role: "Solo Album" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

/* ─── Component ─── */

const PressKit = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Mr. CAP Press Kit",
      url: "https://mrcap1.com/press-kit",
      description:
        "Official press kit for Mr. CAP — download bios, photos, logos, and access press references for media coverage.",
      mainEntity: {
        "@type": "Person",
        name: "Mr. CAP",
        alternateName: "Cornelius A. Pratt",
        jobTitle: "Rapper, Writer, Technologist",
        sameAs: [
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.instagram.com/mrcapism/",
          "https://x.com/mrcap1",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Press", item: "https://mrcap1.com/press" },
        { "@type": "ListItem", position: 3, name: "Press Kit", item: "https://mrcap1.com/press-kit" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Press Kit | Mr. CAP — Bios, Photos, Logos & Media Assets"
        description="Official press kit for Mr. CAP. Download approved bios, high-resolution photos, logos, and access press references for media coverage, interviews, and event promotion."
        canonical="https://mrcap1.com/press-kit"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker="Media Resources"
          title="Press Kit"
          description="Everything journalists, promoters, curators, and event coordinators need — in one place. Download approved bios, photos, and logos. Access press references and official links."
          ctas={[
            { label: "Contact for Media", href: "/booking", variant: "primary" as const },
            { label: "View Full Press Archive", href: "/press", variant: "secondary" as const },
          ]}
        />

        {/* ── Download Full Press Kit ── */}
        <motion.section {...fadeUp} className="py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  One-Click Download
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Download the complete press kit — bios, photos, logos, and discography — in a printer-friendly format.
              </p>
              <Button
                variant="flux"
                size="lg"
                className="rounded-full gap-2"
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  if (!printWindow) return;
                  printWindow.document.write(`<!DOCTYPE html><html><head><title>Mr. CAP — Press Kit</title><style>
                    body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#111;line-height:1.6}
                    h1{font-size:28px;margin-bottom:4px}h2{font-size:18px;margin-top:28px;border-bottom:1px solid #ddd;padding-bottom:6px}
                    .label{font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:4px}
                    .item{margin:8px 0}.meta{font-size:13px;color:#666}
                    img{max-width:200px;margin:8px 8px 8px 0}
                    @media print{body{margin:20px}}
                  </style></head><body>
                    <h1>Mr. CAP — Official Press Kit</h1>
                    <p class="meta">Cornelius A. Pratt | Houston Hip-Hop Artist | South Park Coalition<br/>
                    Contact: wrecklessent@gmail.com | mrcap1.com</p>
                    
                    <h2>Short Bio</h2>
                    <p>${SHORT_BIO}</p>
                    
                    <h2>Extended Bio</h2>
                    <p>${LONG_BIO}</p>
                    
                    <h2>Discography Highlights</h2>
                    ${DISCOGRAPHY_HIGHLIGHTS.map(a => `<div class="item"><strong>${a.title}</strong> (${a.year}) — ${a.role}</div>`).join("")}
                    
                    <h2>Press References</h2>
                    ${PRESS_MENTIONS.map(m => `<div class="item"><strong>${m.title}</strong><br/><span class="meta">${m.outlet} · ${m.date}</span></div>`).join("")}
                    
                    <h2>Press Photos</h2>
                    <p class="meta">High-resolution images available at mrcap1.com/press-kit</p>
                    ${PHOTO_ASSETS.map(p => `<img src="https://mrcap1.com${p.file}" alt="${p.label}"/>`).join("")}
                    
                    <h2>Official Links</h2>
                    <div class="item">Website: mrcap1.com</div>
                    <div class="item">Spotify: open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug</div>
                    <div class="item">Instagram: @mrcapism</div>
                    <div class="item">YouTube: @mrcap1</div>
                    <div class="item">X/Twitter: @mrcap1</div>
                    
                    <hr style="margin-top:30px"/>
                    <p class="meta">Generated from mrcap1.com/press-kit · ${new Date().toLocaleDateString()}</p>
                  </body></html>`);
                  printWindow.document.close();
                  setTimeout(() => printWindow.print(), 500);
                }}
              >
                <Download className="w-4 h-4" />
                Download Press Kit (PDF)
              </Button>
            </div>
          </div>
        </motion.section>

        {/* ── Short Bio ── */}
        <motion.section {...fadeUp} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Short Bio
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{SHORT_BIO}</p>
              <p className="text-xs text-muted-foreground/60 mt-4 italic">
                Approved for print, digital, and broadcast use. No modifications without permission.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Long Bio ── */}
        <motion.section {...fadeUp} className="py-4">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Extended Bio
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">{LONG_BIO}</p>
              <div className="mt-5">
                <Link to="/biography">
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Full Biography
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Press Photos ── */}
        <motion.section {...fadeUp} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Press Photos
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-5">
                High-resolution images approved for editorial, promotional, and event use.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PHOTO_ASSETS.map((photo) => (
                  <div key={photo.label} className="group relative">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted/30 border border-border/20">
                      <img
                        src={photo.file}
                        alt={photo.label}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{photo.label}</span>
                      <a
                        href={photo.file}
                        download
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Logos & Branding ── */}
        <motion.section {...fadeUp} className="py-4">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Logos & Branding
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-5">
                Official logos and brand marks. Do not alter colors, proportions, or typography.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Mr. CAP Logo", file: "/images/opk-download.png" },
                  { label: "SPC Austin 2025 Mark", file: "/images/covers/pomp-standard.png" },
                ].map((logo) => (
                  <div key={logo.label} className="group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted/20 border border-border/20 flex items-center justify-center p-4">
                      <img
                        src={logo.file}
                        alt={logo.label}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{logo.label}</span>
                      <a
                        href={logo.file}
                        download
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Discography Highlights ── */}
        <motion.section {...fadeUp} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Discography Highlights
                </span>
              </div>
              <div className="space-y-3">
                {DISCOGRAPHY_HIGHLIGHTS.map((album) => (
                  <div
                    key={album.title}
                    className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">{album.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">({album.year})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{album.role}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link to="/music">
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                    <Music className="w-3.5 h-3.5" />
                    View Full Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Press References ── */}
        <motion.section {...fadeUp} className="py-4">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Press References
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-5">
                Selected coverage and press features. For the full archive, visit the{" "}
                <Link to="/press" className="text-primary hover:underline">
                  Press page
                </Link>
                .
              </p>
              <div className="space-y-3">
                {PRESS_MENTIONS.map((mention, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{mention.title}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-primary">{mention.outlet}</span>
                        <span className="text-xs text-muted-foreground">· {mention.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/press">
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                    <Newspaper className="w-3.5 h-3.5" />
                    Full Press Archive
                  </Button>
                </Link>
                <Link to="/opk">
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Online Press Kit (OPK)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Contact ── */}
        <motion.section {...fadeUp} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest uppercase text-primary">
                  Media Contact
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-1">
                For press inquiries, interview requests, and media appearances:
              </p>
              <a
                href="mailto:wrecklessent@gmail.com"
                className="text-primary font-medium hover:underline"
              >
                wrecklessent@gmail.com
              </a>
              <div className="mt-5 flex justify-center gap-3">
                <Link to="/booking">
                  <Button variant="default" size="sm" className="rounded-2xl gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Submit Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <OfficialLinksBlock />

        <CitationBlock
          canonicalUrl="https://mrcap1.com/press-kit"
          description="This page is the official press kit for Mr. CAP — approved bios, photos, logos, discography highlights, and press references for media use."
          links={[
            { label: "Press", href: "/press" },
            { label: "Booking", href: "/booking" },
            { label: "Music", href: "/music" },
            { label: "Home", href: "/" },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default PressKit;

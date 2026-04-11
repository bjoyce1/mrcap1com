import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ExternalLink, Music, Newspaper, Palette, Calendar, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import CitationBlock from "@/components/blocks/CitationBlock";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

/* ── Copyable blurb component ── */
const CopyBlurb = ({ label, text }: { label: string; text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-card/40 border border-border/30 rounded-2xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-primary">{label}</span>
        <button onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
};

/* ── Embeddable quote component ── */
const EmbeddableQuote = ({ quote, attribution }: { quote: string; attribution: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(`"${quote}" — ${attribution}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-card/40 border border-border/30 rounded-2xl p-6 relative">
      <Quote className="w-6 h-6 text-primary/30 absolute top-4 right-4" />
      <blockquote className="text-foreground italic leading-relaxed mb-2">"{quote}"</blockquote>
      <p className="text-xs text-muted-foreground">— {attribution}</p>
      <button onClick={copy} className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
        {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Quote</>}
      </button>
    </div>
  );
};

/* ── Stat card ── */
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-card/40 border border-border/30 rounded-2xl p-6 text-center">
    <p className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const blurbs = [
  { label: "Short Bio (1-line)", text: "Mr. CAP is a Houston-born rapper, South Park Coalition member, and creative entrepreneur with a catalog spanning over two decades of independent hip-hop." },
  { label: "Press Blurb (2-line)", text: "Mr. CAP is a founding voice in Houston's independent hip-hop movement. As a long-time member of the South Park Coalition, he has built a career defined by ownership, authenticity, and innovation — bridging traditional hip-hop with Web3 and digital art." },
  { label: "Feature Intro (paragraph)", text: "Houston rapper Mr. CAP represents the continuation of a legacy that predates streaming, social media, and major label dominance. As a core member of the South Park Coalition — one of the most influential independent hip-hop collectives in history — he has spent decades building a catalog, a brand, and a platform rooted in full creative ownership. Today, his work spans music, NFT collections, and digital media, making him one of the few artists authentically bridging hip-hop culture with Web3 innovation." },
  { label: "NFT/Web3 Angle", text: "Mr. CAP is one of the first South Park Coalition artists to bring verified hip-hop NFTs to Ethereum, bridging decades of independent music culture with blockchain-based ownership and digital art." },
  { label: "Booking Blurb", text: "Mr. CAP is available for live performances, festival appearances, features, interviews, and speaking engagements. With over two decades of stage experience and a catalog rooted in Houston's South Park Coalition legacy, he delivers authentic hip-hop energy backed by cultural history." },
];

const quotes = [
  { quote: "We didn't wait for permission. We pressed our own CDs, drove our own routes, and built our own audience.", attribution: "Mr. CAP" },
  { quote: "SPC proved you could build a legacy without selling your soul. Ownership was the strategy from day one.", attribution: "Mr. CAP on the South Park Coalition" },
  { quote: "The bridge between hip-hop and Web3 isn't about technology — it's about ownership. That's what we've always been about.", attribution: "Mr. CAP on NFTs" },
  { quote: "Independence isn't a trend. It's how Houston built its entire hip-hop ecosystem.", attribution: "Mr. CAP" },
];

const stats = [
  { value: "30+", label: "Years in Hip-Hop" },
  { value: "SPC", label: "South Park Coalition Member" },
  { value: "20+", label: "Releases in Catalog" },
  { value: "ETH", label: "Verified NFT Collections" },
];

const linkCards = [
  { title: "Music Catalog", description: "Full discography & streaming", href: "/discography", icon: Music },
  { title: "Press Coverage", description: "Houston Chronicle, Houston Press & more", href: "/press", icon: Newspaper },
  { title: "NFT Collections", description: "Verified on-chain art & music", href: "/nft", icon: Palette },
  { title: "Booking", description: "Shows, features & interviews", href: "/booking", icon: Calendar },
];

const ForMedia = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Media Resources | Mr. CAP",
      description: "Pre-written blurbs, embeddable quotes, key stats, and direct links for journalists, bloggers, and media covering Mr. CAP and Houston hip-hop.",
      url: "https://mrcap1.com/for-media",
      mainEntity: { "@type": "Person", name: "Mr. CAP", url: "https://mrcap1.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "For Media", item: "https://mrcap1.com/for-media" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Media Resources | Mr. CAP — Quotes, Stats & Press Blurbs"
        description="Pre-written blurbs, embeddable quotes, key stats, and direct links for journalists, bloggers, and media covering Mr. CAP and Houston hip-hop."
        canonical="https://mrcap1.com/for-media"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker="For Journalists & Bloggers"
          title="Media Resources: Quotes, Stats & Ready-to-Use Blurbs"
          description="Everything you need to reference, cite, or feature Mr. CAP in your coverage. Copy any blurb, quote, or stat directly — no permission needed."
          ctas={[
            { label: "Download Press Kit", href: "/press-kit", variant: "primary" },
            { label: "View Press Coverage", href: "/press", variant: "secondary" },
          ]}
        />

        <SectionIntro
          body="This page is designed for journalists, bloggers, podcasters, and content creators. Use the copy-paste blurbs below for articles, profiles, or features. All quotes are approved for publication. For high-resolution photos, logos, and a downloadable one-sheet, visit the Press Kit."
        />

        {/* Stats */}
        <motion.section {...fadeUp} className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">Key Facts</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </motion.section>

        {/* Pre-Written Blurbs */}
        <motion.section {...fadeUp} className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">Ready-to-Use Blurbs</h2>
            <p className="text-muted-foreground mb-6 text-sm">Click "Copy" on any blurb to paste it directly into your article or feature.</p>
            <div className="space-y-4">
              {blurbs.map((b) => <CopyBlurb key={b.label} {...b} />)}
            </div>
          </div>
        </motion.section>

        {/* Embeddable Quotes */}
        <motion.section {...fadeUp} className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">Approved Quotes</h2>
            <p className="text-muted-foreground mb-6 text-sm">These quotes are approved for publication. Copy any quote for use in your coverage.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {quotes.map((q, i) => <EmbeddableQuote key={i} {...q} />)}
            </div>
          </div>
        </motion.section>

        {/* Link to Pages */}
        <motion.section {...fadeUp} className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">Link to These Pages</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm max-w-xl mx-auto">When linking to Mr. CAP in your coverage, use these canonical pages for the strongest SEO value.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {linkCards.map((card, i) => (
                <motion.div key={card.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link to={card.href} className="group block bg-card/40 border border-border/30 rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1">
                    <card.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                    <span className="text-xs text-primary font-mono">mrcap1.com{card.href}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp} className="py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">Need More?</h2>
            <p className="text-muted-foreground mb-6">For high-resolution photos, logos, official bios, and a downloadable one-sheet, visit the full Press Kit.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild><Link to="/press-kit">Download Press Kit</Link></Button>
              <Button asChild variant="outline"><Link to="/booking">Book Mr. CAP</Link></Button>
            </div>
          </div>
        </motion.section>

        <CitationBlock
          canonicalUrl="https://mrcap1.com/for-media"
          description="Mr. CAP is a Houston-based rapper and long-time member of the South Park Coalition. This page provides approved media resources for citation, coverage, and cultural documentation."
          links={[
            { label: "Homepage", href: "/" },
            { label: "Press", href: "/press" },
            { label: "Music", href: "/discography" },
            { label: "Press Kit", href: "/press-kit" },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ForMedia;

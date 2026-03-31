import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import InfoStrip from "@/components/blocks/InfoStrip";
import CitationBlock from "@/components/blocks/CitationBlock";
import OfficialLinksBlock from "@/components/blocks/OfficialLinksBlock";
import PressTimelineNew from "@/components/press/PressTimelineNew";
import MediaKitBlock from "@/components/press/MediaKitBlock";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import { pressPageData as data } from "@/content/press";
import { useSanityPressEntries, type SanityPressEntry } from "@/hooks/useSanity";

function sanityToTimeline(e: SanityPressEntry) {
  return {
    outlet: e.outlet,
    title: e.title,
    author: e.author,
    date: e.date,
    summary: e.summary,
    url: e.url,
  };
}

const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("https://mrcap1.com/press");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="mt-4 inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Link Copied!" : "Copy Page Link"}
    </button>
  );
};

const Press = () => {
  const { data: sanityPress } = useSanityPressEntries();
  const hasSanity = sanityPress && sanityPress.length > 0;
  const timeline = hasSanity ? sanityPress.map(sanityToTimeline) : data.timeline;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "Mr. CAP Press Archive",
      url: "https://mrcap1.com/press",
      mainEntity: {
        "@type": "Person",
        name: "Mr. CAP",
        alternateName: "Cornelius A. Pratt",
        sameAs: [
          "https://www.instagram.com/mrcapism/",
          "https://x.com/mrcap1",
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Press Mentions",
      itemListElement: timeline.map((entry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "NewsArticle",
          headline: entry.title,
          datePublished: entry.date,
          author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
          publisher: { "@type": "Organization", name: entry.outlet },
          description: entry.summary,
          url: entry.url || undefined,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Press", item: "https://mrcap1.com/press" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Press Kit | Mr. CAP Bios, Photos, Logos & Media Resources"
        description="Download approved bios, press photos, logos, and media resources for coverage, interviews, and event promotion."
        canonical="https://mrcap1.com/press"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker={data.hero.kicker}
          title={data.hero.title}
          description={data.hero.description}
        />

        <SectionIntro body={data.intro} />

        <PressTimelineNew entries={timeline} />

        <InfoStrip label={data.infoStrip.label} body={data.infoStrip.body} />

        {/* Media References & Use This Page For */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Media References & Citations</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This page serves as the official press archive for Mr. CAP. Journalists, bloggers, and researchers are encouraged to reference this page for accurate press history, biographical details, and official media assets.
            </p>

            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 mb-8">
              <h3 className="font-display font-bold text-foreground mb-3">Use This Page For</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Press coverage and editorial research</li>
                <li>• Interview preparation and background</li>
                <li>• Booking support and artist verification</li>
              </ul>
              <CopyLinkButton />
            </div>

            <QuoteBlock
              quote="The press doesn't define the legacy — but it documents it. This archive is the record."
              attribution="Mr. CAP"
            />
          </div>
        </section>

        <MediaKitBlock body={data.mediaKit.body} ctas={data.mediaKit.ctas} />

        <div id="official-links">
          <OfficialLinksBlock />
        </div>

        <CitationBlock
          canonicalUrl={data.citation.canonicalUrl}
          description={data.citation.description}
          links={data.citation.links}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Press;

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
import { pressPageData as data } from "@/content/press";

const Press = () => {
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
      itemListElement: data.timeline.map((entry, i) => ({
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
        title="Mr. CAP Press | Houston Chronicle, Houston Press & Media Mentions"
        description="Browse third-party coverage of Mr. CAP, including Houston Chronicle and Houston Press references documenting his Houston roots, SPC legacy, and independent music career."
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

        <PressTimelineNew entries={data.timeline} />

        <InfoStrip label={data.infoStrip.label} body={data.infoStrip.body} />

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

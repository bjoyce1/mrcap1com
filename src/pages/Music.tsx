import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import CitationBlock from "@/components/blocks/CitationBlock";
import CTAButtonRow from "@/components/blocks/CTAButtonRow";
import StartHereCards from "@/components/music/StartHereCards";
import CatalogReleaseList from "@/components/music/CatalogReleaseList";
import StoryNotesBlock from "@/components/music/StoryNotesBlock";
import { musicPageData as data } from "@/content/music";

const Music = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      name: "Mr. CAP Official Catalog",
      url: "https://mrcap1.com/music",
      numTracks: 5,
      track: data.catalog.map((r) => ({
        "@type": "MusicRecording",
        name: r.title,
        datePublished: r.year,
        description: r.summary,
        byArtist: { "@type": "Person", name: "Mr. CAP" },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Music", item: "https://mrcap1.com/music" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Music | Mr. CAP Discography, New Releases & Essential Catalog"
        description="Explore Mr. CAP's latest release and catalog, with streaming links, credits, and release details."
        canonical="https://mrcap1.com/music"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker={data.hero.kicker}
          title={data.hero.title}
          description={data.hero.description}
          ctas={data.hero.ctas}
        />

        <SectionIntro body={data.intro} />

        <StartHereCards cards={data.startHere} />

        <CatalogReleaseList releases={data.catalog} />

        <StoryNotesBlock body={data.storyNotes} />

        <CitationBlock
          canonicalUrl={data.citation.canonicalUrl}
          description={data.citation.description}
          links={data.citation.links}
        />

        <CTAButtonRow items={data.finalCTAs} />
      </main>

      <Footer />
    </div>
  );
};

export default Music;

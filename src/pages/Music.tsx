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
import { useSanityReleases, type SanityRelease } from "@/hooks/useSanity";

function releaseToCatalogEntry(r: SanityRelease) {
  return {
    title: r.title,
    year: r.releaseDate?.slice(0, 4) || "",
    tag: r.type || "release",
    summary: r.description || "",
  };
}

function releaseToStartHere(r: SanityRelease) {
  const slug = typeof r.slug === "object" ? r.slug?.current : r.slug;
  return {
    title: r.title,
    meta: r.releaseDate?.slice(0, 4) || "",
    summary: r.description || "",
    slug: slug || r.title.toLowerCase().replace(/\s+/g, "-"),
    image: r.coverArt || "/placeholder.svg",
  };
}

const Music = () => {
  const { data: sanityReleases } = useSanityReleases();
  const hasSanity = sanityReleases && sanityReleases.length > 0;

  const catalog = hasSanity ? sanityReleases.map(releaseToCatalogEntry) : data.catalog;
  const startHere = hasSanity ? sanityReleases.slice(0, 3).map(releaseToStartHere) : data.startHere;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      name: "Mr. CAP Official Catalog",
      url: "https://mrcap1.com/music",
      numTracks: catalog.length,
      track: catalog.map((r) => ({
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

        <StartHereCards cards={startHere} />

        <CatalogReleaseList releases={catalog} />

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

import { lazy, Suspense, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";

const NFTGalleryHero3D = lazy(() => import("@/components/nft/NFTGalleryHero3D"));
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import CitationBlock from "@/components/blocks/CitationBlock";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import VerifiedContractBlock from "@/components/nft/VerifiedContractBlock";
import WalletConnectPanel from "@/components/nft/WalletConnectPanel";
import UnlockGrid from "@/components/nft/UnlockGridNew";
import { nftPageData as data } from "@/content/nft";

const NFTGallery = () => {
  const [holderVerified, setHolderVerified] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback(cb, { timeout: 2500 })
        : setTimeout(cb, 800);
    idle(() => setShow3D(true));
  }, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Mr. CAP NFT & Collector Access",
      url: "https://mrcap1.com/nft",
      description: data.intro,
      mainEntity: {
        "@type": "Person",
        name: "Mr. CAP",
        sameAs: ["https://opensea.io/mrcap1/created"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "NFT", item: "https://mrcap1.com/nft" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Digital Art & Web3 | Mr. CAP Collections, Context & Links"
        description="Explore the intersection of hip-hop and digital ownership through Mr. CAP's digital-art and Web3 work."
        canonical="https://mrcap1.com/nft"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <div className="relative">
          <PageHero
            kicker={data.hero.kicker}
            title={data.hero.title}
            description={data.hero.description}
            ctas={data.hero.ctas}
          />
          {/* Floating gallery of gold-framed pieces */}
          {show3D && (
            <Suspense fallback={null}>
              <NFTGalleryHero3D />
            </Suspense>
          )}
        </div>

        <SectionIntro body={data.intro} />

        <VerifiedContractBlock data={data.contract} />

        <WalletConnectPanel onStatusChange={setHolderVerified} />

        <UnlockGrid cards={data.unlockCards} unlocked={holderVerified} />

        <FAQAccordion items={data.faq} />

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

export default NFTGallery;

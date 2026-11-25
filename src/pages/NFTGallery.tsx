import { lazy, useEffect, useState } from "react";
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
import { routeSeo } from "@/seo/routes";
import Safe3D from "@/components/Safe3D";
import nftFallback from "@/assets/nft-limitless.webp";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO entry={routeSeo("/nft")} />
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
            <Safe3D
              fallback={
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] items-center justify-center lg:flex">
                  <img src={nftFallback} alt="" loading="lazy" decoding="async" className="max-h-[70%] w-auto object-contain opacity-80" />
                </div>
              }
            >
              <NFTGalleryHero3D />
            </Safe3D>
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

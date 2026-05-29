import { Helmet } from "react-helmet-async";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
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
} from "@/design-system";
import { ArtOfIsmCollection } from "@/components/ArtOfIsmCollection";
import { OtherNftsGallery } from "@/components/OtherNftsGallery";
import { nftPageData as data } from "@/content/nft";

gsap.registerPlugin(ScrollTrigger);

const CONTRACT_FACTS = [
  { label: "Collection", value: data.contract.collection },
  { label: "Chain", value: data.contract.chain },
  { label: "Standard", value: data.contract.standard },
  { label: "Contract", value: `${data.contract.contractAddress.slice(0, 10)}…${data.contract.contractAddress.slice(-6)}` },
];

export default function VisualV3() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".v3-visual-hero-bg", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Mr. CAP Visual & NFT Hub",
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
        { "@type": "ListItem", position: 2, name: "Visual", item: "https://mrcap1.com/nft" },
      ],
    },
  ];

  return (
    <DSRoot>
      <Helmet>
        <title>Visual & NFT Archive | Mr. CAP — On-Chain Hip-Hop</title>
        <meta
          name="description"
          content="The visual archive: The Art of ISM NFT album, verified contracts, collector unlocks, and the full digital-art ecosystem."
        />
        <link rel="canonical" href="https://mrcap1.com/nft" />
        <meta property="og:title" content="Visual & NFT Archive | Mr. CAP" />
        <meta property="og:description" content={data.intro} />
        <meta property="og:url" content="https://mrcap1.com/nft" />
        <meta property="og:image" content="https://mrcap1.com/images/covers/nft-art-of-ism.webp" />
        {jsonLd.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>

      <NavV3 />

      <main>
        {/* ── HERO ── */}
        <div ref={heroRef}>
          <Scene
            bgImage="/images/covers/nft-art-of-ism.webp"
            scrim={0.7}
            align="start"
            justify="end"
            minH="100vh"
          >
            <div className="v3-visual-hero-bg absolute inset-0 -z-10" />
            <Stage py="none">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                className="max-w-4xl"
              >
                <Eyebrow accent className="mb-6">Visual / NFT / On-Chain</Eyebrow>
                <Display size="monument" italic className="mb-8">
                  Owned, not <span className="not-italic">streamed.</span>
                </Display>
                <Lead className="mb-10 max-w-2xl text-[hsl(var(--ds-bone-dim))]">
                  The Art of ISM lives on-chain. Verified contract, verified creator wallet,
                  collector-only unlocks. The independent model — applied to digital scarcity.
                </Lead>
                <div className="flex flex-wrap gap-4">
                  <CTA variant="primary" href={data.contract.openseaUrl}>View on OpenSea</CTA>
                  <CTA variant="ghost" to="/music">Hear the catalog</CTA>
                </div>
              </motion.div>
            </Stage>
          </Scene>
        </div>

        {/* ── INTRO ── */}
        <Stage py="md" narrow>
          <Eyebrow className="mb-4">The premise</Eyebrow>
          <Lead className="text-[hsl(var(--ds-bone))]">{data.intro}</Lead>
        </Stage>

        {/* ── VERIFIED CONTRACT ── */}
        <Stage py="md">
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-12">
            <div className="grid md:grid-cols-[1fr_2fr] gap-12">
              <div>
                <Eyebrow accent className="mb-4">Attestation</Eyebrow>
                <Display size="md" italic>Verified on-chain.</Display>
              </div>
              <div>
                <dl className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
                  {CONTRACT_FACTS.map((f) => (
                    <div key={f.label}>
                      <Caption className="uppercase tracking-[0.2em] mb-2">{f.label}</Caption>
                      <Body className="font-mono text-sm break-all">{f.value}</Body>
                    </div>
                  ))}
                </dl>
                <div className="mt-10 flex flex-wrap gap-6">
                  <CTA variant="link" href={data.contract.etherscanUrl}>Etherscan</CTA>
                  <CTA variant="link" href={data.contract.openseaUrl}>OpenSea</CTA>
                </div>
              </div>
            </div>
          </div>
        </Stage>

        {/* ── ART OF ISM COLLECTION (live) ── */}
        <Stage py="md">
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-16 mb-12">
            <Eyebrow accent className="mb-4">Flagship release</Eyebrow>
            <Display size="lg" italic className="mb-4">The Art of ISM.</Display>
            <Body dim className="max-w-2xl">
              The album, tokenized track by track. Each piece is an individual music NFT — playable
              here, verifiable on-chain.
            </Body>
          </div>
          <ArtOfIsmCollection />
        </Stage>

        {/* ── COLLECTOR UNLOCKS ── */}
        <Stage py="md">
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-16 mb-12">
            <Eyebrow accent className="mb-4">Collector access</Eyebrow>
            <Display size="lg" italic>Hold the token. Open the door.</Display>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.unlockCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="p-8 bg-[hsl(var(--ds-elevated))] shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] hover:translate-y-[-2px] transition-transform duration-[var(--ds-dur-slow)]"
              >
                <Caption className="mb-4">Unlock {String(i + 1).padStart(2, "0")}</Caption>
                <Display size="md" as="h3" className="mb-3">{card.title}</Display>
                <Body dim>{card.description}</Body>
              </motion.div>
            ))}
          </div>
        </Stage>

        {/* ── WALLET GALLERY ── */}
        <Stage py="md">
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-16 mb-12">
            <Eyebrow accent className="mb-4">Live wallet</Eyebrow>
            <Display size="lg" italic className="mb-4">Beyond the album.</Display>
            <Body dim className="max-w-2xl">
              Collaborations, drops, and one-off pieces — pulled live from the artist's verified wallet.
            </Body>
          </div>
          <OtherNftsGallery />
        </Stage>

        {/* ── FAQ ── */}
        <Stage py="md" narrow>
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-16">
            <Eyebrow accent className="mb-4">For the curious</Eyebrow>
            <Display size="lg" italic className="mb-12">Common questions.</Display>
            <div className="space-y-0">
              {data.faq.map((f, i) => (
                <details
                  key={i}
                  className="group border-b border-[hsl(var(--ds-bone)/0.08)] py-6 cursor-pointer"
                >
                  <summary className="flex items-start justify-between gap-6 list-none">
                    <Display size="md" as="h3" className="!text-[1.25rem] md:!text-[1.5rem]">
                      {f.question}
                    </Display>
                    <span className="ds-font-eyebrow text-[hsl(var(--ds-bone-faint))] mt-2 group-open:rotate-45 transition-transform duration-[var(--ds-dur-fast)]">+</span>
                  </summary>
                  <Body dim className="mt-4 pr-12">{f.answer}</Body>
                </details>
              ))}
            </div>
          </div>
        </Stage>

        {/* ── CLOSER ── */}
        <Scene minH="80vh" align="center" justify="center" scrim={0} grain>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(var(--ds-oxblood)/0.25) 0%, hsl(var(--ds-bg)) 70%)",
            }}
          />
          <Stage py="none">
            <div className="text-center max-w-3xl mx-auto">
              <Eyebrow accent className="mb-6">Collect. Listen. Own.</Eyebrow>
              <Display size="xl" italic className="mb-10">
                The record is yours.
              </Display>
              <div className="flex flex-wrap gap-4 justify-center">
                <CTA variant="primary" href={data.contract.openseaUrl}>Browse on OpenSea</CTA>
                <CTA variant="ghost" to="/music">Back to the music</CTA>
              </div>
            </div>
          </Stage>
        </Scene>
      </main>

      <FooterV3 />
    </DSRoot>
  );
}

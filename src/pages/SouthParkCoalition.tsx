import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import CitationBlock from "@/components/blocks/CitationBlock";
import CTAButtonRow from "@/components/blocks/CTAButtonRow";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import { motion } from "framer-motion";
import { Music, Newspaper, Gem, CalendarCheck } from "lucide-react";

const SouthParkCoalition = () => {
  const pageTitle = "South Park Coalition: Houston's Independent Hip Hop Movement | Mr. CAP";
  const metaDescription =
    "The South Park Coalition created a blueprint for artist ownership, longevity, and cultural impact in Houston hip hop. Explore the origins, legacy, and Mr. CAP's role.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "name": "South Park Coalition",
        "foundingLocation": { "@type": "Place", "name": "Houston, Texas" },
        "genre": ["Hip-Hop", "Southern Hip-Hop"],
        "member": { "@type": "Person", "name": "Mr. CAP" },
        "url": "https://mrcap1.com/south-park-coalition",
        "description":
          "The South Park Coalition is one of the most influential independent hip hop collectives to come out of Houston, Texas.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The South Park Coalition (SPC) is a legendary Houston hip-hop collective founded in 1987 in the South Park neighborhood of Houston, Texas. It pioneered independent hip-hop distribution in Texas and is one of the longest-running hip-hop collectives in history.",
            },
          },
          {
            "@type": "Question",
            "name": "Why does the South Park Coalition still matter today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ownership, independence, and direct audience connection are now considered essential for artists. What SPC built decades ago is now the model many artists strive to follow.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "South Park Coalition", "item": "https://mrcap1.com/south-park-coalition" },
        ],
      },
    ],
  };

  const sections = [
    {
      title: "The Origins of the South Park Coalition",
      paragraphs: [
        "The South Park Coalition emerged from Houston's South Park neighborhood as a collective of artists determined to build their own path in the music industry.",
        "Instead of waiting for record deals, they created their own systems — producing, distributing, and promoting their music independently.",
        "This grassroots approach allowed the coalition to grow organically while maintaining full creative control.",
      ],
    },
    {
      title: "The Independent Blueprint Before Streaming",
      paragraphs: [
        "Long before streaming services existed, the South Park Coalition developed a direct-to-fan model that would later become the standard in independent music.",
        "Artists sold CDs hand-to-hand, built local fanbases, and relied on consistency rather than industry validation.",
        "This approach created a sustainable ecosystem where artists could build careers without giving up ownership of their work.",
      ],
    },
    {
      title: "Cultural Impact on Houston Hip Hop",
      paragraphs: [
        "The South Park Coalition helped define the sound and identity of Houston hip hop.",
        "Its members contributed to a culture that valued authenticity, lyrical presence, and community influence over commercial trends.",
        "Today, many independent artists unknowingly follow the same blueprint that SPC established decades earlier.",
      ],
    },
    {
      title: "Mr. CAP and the Continuation of the SPC Legacy",
      paragraphs: [
        "As a long-time member of the South Park Coalition, Mr. CAP represents the continuation of Houston's independent tradition.",
        "His catalog, performances, and creative direction reflect the same principles that defined the coalition — ownership, discipline, and longevity.",
        "Through music, media, and digital innovation, Mr. CAP continues to build on the foundation established by SPC.",
      ],
    },
    {
      title: "Why the South Park Coalition Still Matters Today",
      paragraphs: [
        "The music industry has changed, but the core principles of the South Park Coalition remain relevant.",
        "Ownership, independence, and direct audience connection are now considered essential for artists.",
        "What SPC built decades ago is now the model many artists strive to follow.",
      ],
    },
  ];

  const exploreCards = [
    { icon: Music, label: "Music Catalog", href: "/music" },
    { icon: Newspaper, label: "Press & Media Coverage", href: "/press" },
    { icon: Gem, label: "NFT & Web3 Projects", href: "/nft" },
    { icon: CalendarCheck, label: "Book Mr. CAP", href: "/booking" },
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content="South Park Coalition, SPC Houston, Houston rap collective, Houston underground hip hop, Mr CAP, independent hip hop, Houston music history"
        />
        <link rel="canonical" href="https://mrcap1.com/south-park-coalition" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="organization" />
        <meta property="og:url" content="https://mrcap1.com/south-park-coalition" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          <PageHero
            kicker="Houston Hip Hop Legacy"
            title="South Park Coalition: Houston's Independent Hip Hop Movement"
            description="Long before streaming platforms and independent distribution became the norm, the South Park Coalition created a blueprint for artist ownership, longevity, and cultural impact in Houston hip hop."
            ctas={[
              { label: "Explore Mr. CAP Music", href: "/music", variant: "primary" },
              { label: "View Press Coverage", href: "/press", variant: "secondary" },
            ]}
          />

          <SectionIntro
            body="The South Park Coalition is one of the most influential independent hip hop collectives to come out of Houston, Texas. Built on independence, consistency, and community, the coalition created a model that allowed artists to thrive without relying on major labels. This page documents the origins of the South Park Coalition, its impact on Houston's music culture, and the role artists like Mr. CAP continue to play in carrying that legacy forward."
          />

          {/* Content Sections */}
          {sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className={`py-16 ${idx % 2 === 1 ? "bg-card/30 border-y border-border/30" : ""}`}
            >
              <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                  {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground text-lg leading-relaxed mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}

          {/* Explore Cards */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-12">
                Explore the Mr. CAP Ecosystem
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {exploreCards.map((card, i) => (
                  <Link
                    key={i}
                    to={card.href}
                    className="group bg-card/40 border border-border/30 rounded-2xl p-6 text-center hover:border-primary/40 hover:bg-card/60 transition-all duration-300"
                  >
                    <card.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-foreground">{card.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-card/30 border-y border-border/30">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <p className="text-lg text-muted-foreground mb-2">
                The South Park Coalition didn't just create music — it created a system.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                If you want to understand independent hip hop at its core, this is where the blueprint begins.
              </p>
              <CTAButtonRow
                items={[
                  { label: "Listen to Mr. CAP", href: "/music", variant: "primary" },
                  { label: "View Press", href: "/press", variant: "secondary" },
                ]}
              />
            </div>
          </section>

          {/* Quote Block */}
          <QuoteBlock
            quote="The South Park Coalition created a blueprint for artist ownership, longevity, and cultural impact in Houston hip hop."
            attribution="mrcap1.com"
          />

          {/* Citation */}
          <CitationBlock
            canonicalUrl="https://mrcap1.com/south-park-coalition"
            description="Mr. CAP is a Houston-based rapper and long-time member of the South Park Coalition. This page is part of the official mrcap1.com archive and is intended for citation, research, and cultural documentation."
            lastUpdated="2026-03-31"
            links={[
              { label: "Homepage", href: "/" },
              { label: "Press", href: "/press" },
              { label: "Music", href: "/music" },
            ]}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SouthParkCoalition;

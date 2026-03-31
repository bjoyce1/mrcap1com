import { Link } from "react-router-dom";
import { ArrowRight, Music, Newspaper, Palette, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import CitationBlock from "@/components/blocks/CitationBlock";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const exploreCards = [
  { title: "Music Catalog", description: "Full discography, albums & streaming links", href: "/music", icon: Music },
  { title: "Press & Media Coverage", description: "Houston Chronicle, Houston Press & more", href: "/press", icon: Newspaper },
  { title: "NFT & Web3 Projects", description: "Verified on-chain collections & digital art", href: "/nft", icon: Palette },
  { title: "Book Mr. CAP", description: "Shows, features, interviews & speaking", href: "/booking", icon: Calendar },
];

const HoustonHipHopHistory = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Houston Hip Hop History: South Park Coalition, Independence & the Legacy of Mr. CAP",
      author: { "@type": "Person", name: "Mr. CAP" },
      publisher: { "@type": "Organization", name: "Mr. CAP Music", url: "https://mrcap1.com" },
      datePublished: "2026-03-31",
      dateModified: "2026-03-31",
      description: "An inside look at Houston's independent hip-hop history, the South Park Coalition blueprint, and Mr. CAP's role in shaping the culture.",
      url: "https://mrcap1.com/houston-hip-hop-history",
      mainEntityOfPage: "https://mrcap1.com/houston-hip-hop-history",
      about: [
        { "@type": "Thing", name: "Houston Hip Hop" },
        { "@type": "Thing", name: "South Park Coalition" },
        { "@type": "Thing", name: "Independent Hip Hop" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the South Park Coalition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The South Park Coalition (SPC) is one of the most influential independent hip-hop collectives from Houston, Texas. Founded as a blueprint for artist ownership and independence, it includes members like Mr. CAP, K-Rino, Klondike Kat, and Point Blank.",
          },
        },
        {
          "@type": "Question",
          name: "Why is Houston hip hop important?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Houston hip hop pioneered the independent music model — artists pressed their own CDs, built direct-to-fan distribution, and maintained full creative ownership decades before streaming made it mainstream.",
          },
        },
        {
          "@type": "Question",
          name: "Who is Mr. CAP?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, long-time South Park Coalition member, and creative technologist who bridges traditional hip-hop culture with Web3 and digital innovation.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Houston Hip Hop History", item: "https://mrcap1.com/houston-hip-hop-history" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Houston Hip Hop History: South Park Coalition & Mr. CAP Legacy"
        description="An inside look at Houston's independent hip-hop history, the South Park Coalition blueprint, and Mr. CAP's role in shaping the culture."
        canonical="https://mrcap1.com/houston-hip-hop-history"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker="Cultural Archive"
          title="Houston Hip Hop History: South Park Coalition, Independence & the Legacy of Mr. CAP"
          description="Before streaming, before social media, and before major label dominance, Houston built its own hip hop ecosystem — independent, resilient, and rooted in the streets. This is the story from the inside."
          ctas={[
            { label: "Explore Mr. CAP Music", href: "/music", variant: "primary" },
            { label: "View Press Coverage", href: "/press", variant: "secondary" },
          ]}
        />

        <SectionIntro
          body="Houston hip hop has always moved differently. While other cities chased major label deals, Houston artists built their own lanes — pressing their own CDs, selling music directly, and creating a culture that didn't depend on outside validation. At the center of that movement was the South Park Coalition — a collective of artists who prioritized independence, longevity, and authenticity over trends. This page documents that history, the culture behind it, and the role Mr. CAP continues to play in it today."
        />

        {/* Section 1 */}
        <motion.section {...fadeUp} className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              The Rise of Houston's Underground Scene
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Houston's underground hip hop scene wasn't built through radio — it was built through hustle.</p>
              <p>Artists created their own distribution systems, sold music hand-to-hand, and built loyal audiences without relying on major labels. This independence gave Houston a unique sound and identity that stood apart from the rest of the country.</p>
              <p>Instead of waiting to be discovered, Houston artists created their own platforms, their own markets, and their own culture.</p>
            </div>
            <QuoteBlock
              quote="We didn't wait for permission. We pressed our own CDs, drove our own routes, and built our own audience."
              attribution="Mr. CAP"
            />
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section {...fadeUp} className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              South Park Coalition and the Independent Blueprint
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The South Park Coalition (SPC) became one of the most influential independent hip hop movements to come out of Houston.</p>
              <p>SPC was not just a group — it was a blueprint.</p>
              <p>Artists within the coalition focused on ownership, consistency, and building a direct connection with their audience. They proved that it was possible to build a career without compromising creative control.</p>
              <p>This approach laid the foundation for what independent hip hop would later become in the digital era.</p>
            </div>
            <QuoteBlock
              quote="SPC proved you could build a legacy without selling your soul. Ownership was the strategy from day one."
              attribution="Mr. CAP on the South Park Coalition"
            />
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section {...fadeUp} className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Mr. CAP's Role in Houston Hip Hop
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>As a long-time member of the South Park Coalition, Mr. CAP represents the continuation of Houston's independent legacy.</p>
              <p>From early performances to a growing catalog of releases, his work reflects the same principles that defined the city's underground scene — authenticity, ownership, and longevity.</p>
              <p>Rather than chasing trends, Mr. CAP has focused on building a catalog and a platform that stands the test of time.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section {...fadeUp} className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Why Houston Artists Didn't Need Major Labels
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Houston's hip hop scene proved something most of the industry didn't expect — success doesn't require permission.</p>
              <p>By controlling their own distribution and building direct relationships with listeners, Houston artists created a sustainable model long before streaming platforms existed.</p>
              <p>This independence allowed artists to move freely, experiment creatively, and maintain ownership of their work.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 5 */}
        <motion.section {...fadeUp} className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Houston Hip Hop Today
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Today, Houston's influence can be seen across the entire music industry.</p>
              <p>The independent model pioneered by artists in the city is now the standard. Direct-to-fan distribution, ownership, and creative control are no longer rare — they're expected.</p>
              <p>Mr. CAP continues to build within that tradition, expanding into digital platforms, Web3, and new ways of connecting music with audiences.</p>
            </div>
          </div>
        </motion.section>

        {/* Explore More */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-10">
              Explore More
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {exploreCards.map((card, i) => (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={card.href}
                    className="group block bg-card/40 border border-border/30 rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1"
                  >
                    <card.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary group-hover:underline">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.section {...fadeUp} className="py-16 bg-card/20">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <p className="text-lg text-muted-foreground mb-6">
              This is more than history — it's a blueprint. If you're looking to understand independent hip hop, Houston culture, or the evolution of artist ownership, start here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild><Link to="/music">Listen Now</Link></Button>
              <Button asChild variant="outline"><Link to="/press">View Press</Link></Button>
            </div>
          </div>
        </motion.section>

        <CitationBlock
          canonicalUrl="https://mrcap1.com/houston-hip-hop-history"
          description="Mr. CAP is a Houston-based rapper and long-time member of the South Park Coalition. This page is part of the official mrcap1.com archive and is intended for citation, research, and cultural documentation."
          links={[
            { label: "Homepage", href: "/" },
            { label: "Press", href: "/press" },
            { label: "Music", href: "/music" },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default HoustonHipHopHistory;

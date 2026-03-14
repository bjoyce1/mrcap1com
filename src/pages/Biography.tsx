import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/blocks/PageHero";
import CTAButtonRow from "@/components/blocks/CTAButtonRow";
import { Building2, Music, Film, Coins, Palette, Globe, Award, MapPin } from "lucide-react";

const ventures = [
  {
    icon: Music,
    name: "CAP Distributions",
    desc: "Digital distribution company helping independent artists retain control over their creative work and revenue streams.",
  },
  {
    icon: Building2,
    name: "Mortuary Media LLC",
    desc: "Digital memorial services including funeral programs, video tributes, and memorial websites — integrating creative media with end-of-life services.",
  },
  {
    icon: Coins,
    name: "Capicoin (CCHX)",
    desc: "Blockchain-based initiatives integrating digital economies with real-world businesses, focused on creator economies and tokenized ecosystems.",
  },
  {
    icon: Palette,
    name: "Creative Agency",
    desc: "Full-service creative agency providing graphic design, web development, music production, and film production.",
  },
];

const milestones = [
  { icon: MapPin, label: "Houston, TX", detail: "Third Ward Raised" },
  { icon: Music, label: "South Park Coalition", detail: "Long-Time Member" },
  { icon: Award, label: "Lone Star Emmy", detail: "2024 Nomination" },
  { icon: Globe, label: "Blockchain Pioneer", detail: "Creator Economy" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionAnim = {
  variants: fadeUp,
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-60px" },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const Biography = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Cornelius A. Pratt",
    alternateName: "Mr. CAP",
    description:
      "Houston-based artist, entrepreneur, technologist, and creative strategist whose work bridges music, media, technology, and digital innovation.",
    url: "https://mrcap1.com/biography",
    sameAs: [
      "https://open.spotify.com/artist/5dRQz7FPkfRCCaImjIJSoj",
      "https://www.instagram.com/mikisuavecap/",
      "https://twitter.com/mikisuavecap",
    ],
    birthPlace: { "@type": "Place", name: "Houston, Texas" },
    alumniOf: { "@type": "EducationalOrganization", name: "Jack Yates Senior High School" },
    memberOf: { "@type": "MusicGroup", name: "South Park Coalition" },
    knowsAbout: [
      "Hip-Hop Music",
      "Blockchain Technology",
      "Digital Distribution",
      "Creative Entrepreneurship",
      "NFT Art",
    ],
    brand: [
      { "@type": "Organization", name: "CAP Distributions" },
      { "@type": "Organization", name: "Mortuary Media LLC" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Professional Biography — Mr. CAP | Cornelius A. Pratt</title>
        <meta
          name="description"
          content="Official professional biography of Cornelius 'Mr. CAP' Pratt — Houston artist, entrepreneur, technologist, and South Park Coalition member bridging music, media, and digital innovation."
        />
        <link rel="canonical" href="https://mrcap1.com/biography" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navigation />

      <PageHero
        kicker="Official Biography"
        title="Cornelius 'Mr. CAP' Pratt"
        description="Houston-based artist, entrepreneur, technologist, and creative strategist whose work bridges music, media, technology, and digital innovation."
        ctas={[
          { label: "View Legacy Timeline", href: "/legacy", variant: "primary" },
          { label: "Press & Media", href: "/press", variant: "secondary" },
        ]}
      />

      {/* Milestone Strip */}
      <section className="border-y border-white/5 bg-secondary/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Sections */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          {/* Early Life */}
          <motion.section {...sectionAnim}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Early Life & Roots</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Born in Houston, Texas, and raised in the city's historic Third Ward, Cornelius A. Pratt was immersed in music from an early age. The son of two musicians, he began performing at the age of eight and later graduated from Jack Yates Senior High School. His early artistic journey included performing with his rap group The Raise Up Posse, laying the foundation for a career rooted in independent artistry and creative ownership.
              </p>
            </div>
          </motion.section>

          {/* Music Career */}
          <motion.section {...sectionAnim}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Music Career</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A long-time member of the influential South Park Coalition, Mr. CAP has spent decades contributing to the cultural and entrepreneurial landscape of Houston's independent music movement while simultaneously building ventures across media, design, and emerging technology.
              </p>
              <p>
                His debut album <em className="text-foreground/80">2 Tha Grave</em>, released on April 5, 2011, featured collaborations with notable Houston artists including members of the South Park Coalition and the Screwed Up Click movement. In addition to performing and recording music, he founded CAP Distributions, a digital distribution company designed to help independent artists retain control over their creative work and revenue streams.
              </p>
            </div>
          </motion.section>

          {/* Entrepreneurship */}
          <motion.section {...sectionAnim}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Entrepreneurship & Ventures</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Beyond music, Pratt has built a diverse portfolio of ventures across media, technology, and digital platforms. He is the founder of Mortuary Media LLC, a company that provides digital memorial services such as funeral programs, video tributes, and memorial websites. The company is designed to integrate creative media with end-of-life services, including potential partnerships with life insurance providers.
              </p>
              <p>
                Mr. CAP is also deeply involved in emerging technologies including blockchain, digital assets, and decentralized platforms. He has developed projects such as Capicoin (CCHX) and other blockchain-based initiatives aimed at integrating digital economies with real-world businesses. His work in this space focuses on creator economies, tokenized ecosystems, and decentralized financial infrastructure.
              </p>
              <p>
                In addition to his work in music and technology, Pratt operates Cap Distributions, a creative agency providing services in graphic design, web development, music production, and film production. His creative work extends into visual storytelling, digital branding, and multimedia production for artists, entrepreneurs, and organizations.
              </p>
            </div>
          </motion.section>

          {/* Documentary */}
          <motion.section {...sectionAnim}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Film & Documentary</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Mr. CAP has also appeared in the documentary <em className="text-foreground/80">The Life: Sex Trafficking and Modern-Day Slavery</em>, where he contributed a personal perspective from his past experiences. The film received recognition including a nomination for the 2024 Lone Star Emmy Award.
              </p>
            </div>
          </motion.section>

          {/* Vision */}
          <motion.section {...fadeUp} viewport={{ once: true, margin: "-60px" }} whileInView="show" initial="hidden">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Vision & Impact</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With a background that spans music, design, software, blockchain innovation, and creative entrepreneurship, Mr. CAP continues to build platforms that empower artists and independent creators. His work reflects a commitment to ownership, innovation, and the belief that artists can shape their own ecosystems across media, technology, and culture.
              </p>
            </div>
          </motion.section>
        </div>
      </article>

      {/* Ventures Grid */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
          >
            Ventures & Organizations
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {ventures.map((v) => (
              <motion.div
                key={v.name}
                variants={fadeUp}
                className="bg-card/60 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-primary/20 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{v.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <CTAButtonRow
            buttons={[
              { label: "View Full Legacy", href: "/legacy" },
              { label: "Press & Media Kit", href: "/press", variant: "secondary" },
              { label: "Contact & Booking", href: "/booking", variant: "ghost" },
            ]}
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Biography;

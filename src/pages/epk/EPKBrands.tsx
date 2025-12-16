import { Helmet } from "react-helmet-async";
import { Download, TrendingUp, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";

const partnershipTypes = [
  {
    title: "Brand Endorsements",
    icon: TrendingUp,
    description: "Authentic product endorsements aligned with Mr. CAP's brand values. Music, tech, lifestyle, and culture.",
  },
  {
    title: "Campaign Features",
    icon: Zap,
    description: "Integrated campaign appearances. Music licensing, content creation, and promotional activations.",
  },
  {
    title: "Product Collaborations",
    icon: Shield,
    description: "Co-branded products and limited editions. Apparel, NFT drops, and exclusive releases.",
  },
  {
    title: "Licensing & Sync",
    icon: Users,
    description: "Music licensing for commercials, films, games, and brand content. Full catalog available.",
  },
];

const audienceStats = [
  { label: "Monthly Spotify Listeners", value: "Growing" },
  { label: "Core Demo", value: "25-45" },
  { label: "Primary Markets", value: "Texas, South" },
  { label: "Engagement", value: "High" },
];

const EPKBrands = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Brand Partnership EPK – Sponsorships & Collaborations</title>
        <meta 
          name="description" 
          content="Partner with Mr. CAP for brand endorsements, campaigns, and product collaborations. Authentic voice. 30+ year legacy. Houston and beyond." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk/brands" />
        <meta property="og:title" content="Mr. CAP | Brand Partnership EPK" />
        <meta property="og:description" content="Brand partnerships, endorsements, and collaborations with Houston hip-hop artist Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/epk/brands" />
      </Helmet>

      <EPKLayout
        title="Brand Partnerships"
        subtitle="Authentic voice. Engaged audience. 30+ years of credibility in hip-hop, tech, and culture. Let's build something together."
        tagline="Brand EPK"
        ctaLabel="Discuss Partnership"
        breadcrumb="Brands"
      >
        {/* Partnership Types */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Partnership Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {partnershipTypes.map((type) => (
                <div
                  key={type.title}
                  className="bg-card/50 border border-border/50 rounded-xl p-6"
                >
                  <type.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience Overview */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Audience Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {audienceStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6">Why Partner with Mr. CAP</h2>
              <div className="bg-card/50 border border-border/50 rounded-xl p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Authenticity</h3>
                  <p className="text-muted-foreground">30+ years in the industry with zero compromises. When Mr. CAP endorses something, his audience knows it's real.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Innovation</h3>
                  <p className="text-muted-foreground">First Houston rapper to sell an NFT. Early adopter of Web3, blockchain, and digital distribution technologies.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Cultural Credibility</h3>
                  <p className="text-muted-foreground">Original member of the South Park Coalition. Deep roots in Houston hip-hop history and community.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold mb-6">Get the Brand Deck</h2>
            <Button variant="flux" size="lg" asChild>
              <a href="/brand-deck.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Brand Partnership Deck (PDF)
              </a>
            </Button>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKBrands;

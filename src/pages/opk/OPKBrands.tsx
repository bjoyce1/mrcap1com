import { Helmet } from "react-helmet-async";
import { CheckCircle, Sparkles, Megaphone, Calendar, Music, Blocks } from "lucide-react";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const whyItWorks = [
  "Established South Park Coalition credibility",
  "Loyal, mature audience",
  "Brand-safe, professional presentation",
  "Experience across music, film, media, and blockchain",
  "Proven independence and ownership mindset",
];

const partnershipOpportunities = [
  { icon: Megaphone, title: "Sponsored Content", borderColor: "#EF4444", gradient: "linear-gradient(145deg, #EF4444, hsl(var(--background)))" },
  { icon: Sparkles, title: "Brand Storytelling", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, hsl(var(--background)))" },
  { icon: Calendar, title: "Event Partnerships", borderColor: "#10B981", gradient: "linear-gradient(195deg, #10B981, hsl(var(--background)))" },
  { icon: Music, title: "Music Placement", borderColor: "#3B82F6", gradient: "linear-gradient(210deg, #3B82F6, hsl(var(--background)))" },
  { icon: Blocks, title: "Digital & NFT-based Collaborations", borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, hsl(var(--background)))" },
];

const OPKBrands = () => {
  const partnerItems: ChromaGridItem[] = partnershipOpportunities.map((item) => ({
    title: item.title,
    borderColor: item.borderColor,
    gradient: item.gradient,
    _icon: item.icon,
  }));

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Brand Partnership OPK – Sponsorships & Collaborations</title>
        <meta name="description" content="Partner with Mr. CAP for brand endorsements, campaigns, and product collaborations. Authentic voice. 30+ year legacy. Houston and beyond." />
        <link rel="canonical" href="https://mrcap1.com/opk/brands" />
        <meta property="og:title" content="Mr. CAP | Brand Partnership OPK" />
        <meta property="og:description" content="Brand partnerships, endorsements, and collaborations with Houston hip-hop artist Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/opk/brands" />
        <meta property="og:image" content="https://mrcap1.com/images/opk-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://mrcap1.com/images/opk-og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mr. CAP Brand Partnership OPK",
            "description": "Partner with Mr. CAP for brand endorsements, campaigns, and collaborations.",
            "url": "https://mrcap1.com/opk/brands",
            "mainEntity": {
              "@type": "Person",
              "@id": "https://mrcap1.com/#person",
              "name": "Mr. CAP",
              "description": "Houston hip-hop artist representing authenticity, independence, and longevity.",
              "knowsAbout": ["Hip-Hop Culture", "Brand Partnerships", "Digital Marketing", "NFT", "Blockchain"],
              "memberOf": { "@type": "MusicGroup", "name": "South Park Coalition" }
            },
            "potentialAction": { "@type": "ContactAction", "target": "mailto:southparkcoalitionllc@gmail.com", "name": "Partner With Mr. CAP" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
                { "@type": "ListItem", "position": 2, "name": "OPK", "item": "https://mrcap1.com/opk" },
                { "@type": "ListItem", "position": 3, "name": "Brands", "item": "https://mrcap1.com/opk/brands" }
              ]
            }
          })}
        </script>
      </Helmet>

      <OPKLayout
        title="Culture. Credibility. Forward Motion."
        subtitle=""
        tagline="Brand & Partnership OPK"
        ctaLabel="Partner With Mr. CAP"
        breadcrumb="Brands"
      >
        {/* Brand Positioning */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-6 text-center">Brand Positioning</h2>
              <div className="gsap-item bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  Mr. CAP represents authenticity, independence, and longevity. His career bridges legacy hip-hop culture with modern digital entrepreneurship—making him a strong fit for brands seeking real cultural alignment, not manufactured influence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Works */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Why It Works</h2>
              <ul className="space-y-4">
                {whyItWorks.map((item, index) => (
                  <li key={index} className="gsap-item flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Partnership Opportunities */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Partnership Opportunities</h2>
              <div style={{ height: '320px', position: 'relative' }}>
                <ChromaGrid
                  items={partnerItems}
                  columns={3}
                  radius={200}
                  renderCard={(item) => {
                    const Icon = item._icon as React.ComponentType<{ className?: string }>;
                    return (
                      <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKBrands;

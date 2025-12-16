import { Helmet } from "react-helmet-async";
import { CheckCircle, Sparkles, Megaphone, Calendar, Music, Blocks } from "lucide-react";
import EPKLayout from "@/components/EPKLayout";

const whyItWorks = [
  "Established South Park Coalition credibility",
  "Loyal, mature audience",
  "Brand-safe, professional presentation",
  "Experience across music, film, media, and blockchain",
  "Proven independence and ownership mindset",
];

const partnershipOpportunities = [
  { icon: Megaphone, title: "Sponsored Content" },
  { icon: Sparkles, title: "Brand Storytelling" },
  { icon: Calendar, title: "Event Partnerships" },
  { icon: Music, title: "Music Placement" },
  { icon: Blocks, title: "Digital & NFT-based Collaborations" },
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
        title="Culture. Credibility. Forward Motion."
        subtitle=""
        tagline="Brand & Partnership EPK"
        ctaLabel="Partner With Mr. CAP"
        breadcrumb="Brands"
      >
        {/* Brand Positioning */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6 text-center">Brand Positioning</h2>
              <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  Mr. CAP represents authenticity, independence, and longevity. His career bridges legacy hip-hop culture with modern digital entrepreneurship—making him a strong fit for brands seeking real cultural alignment, not manufactured influence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Works */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Why It Works</h2>
              <ul className="space-y-4">
                {whyItWorks.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Partnership Opportunities */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Partnership Opportunities</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {partnershipOpportunities.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card/50 border border-border/50 rounded-xl p-6 text-center"
                  >
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKBrands;

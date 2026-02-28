import { Helmet } from "react-helmet-async";
import { Download, FileText, Image, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const pressHighlights = [
  "Member of the South Park Coalition",
  "Documentary contributor (The Life: Sex Trafficking and Modern-Day Slavery)",
  "First Houston rapper to sell a hip-hop NFT (Feb 25, 2021)",
];

const mediaAssets = [
  { icon: Image, title: "Press Photos", description: "High-resolution press photos", borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, hsl(var(--background)))" },
  { icon: FileText, title: "Logos", description: "Official logos and branding", borderColor: "#10B981", gradient: "linear-gradient(210deg, #10B981, hsl(var(--background)))" },
  { icon: Download, title: "Press Kit", description: "Downloadable Press Kit (ZIP)", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, hsl(var(--background)))" },
];

const OPKPress = () => {
  const assetItems: ChromaGridItem[] = mediaAssets.map((asset) => ({
    title: asset.title,
    subtitle: asset.description,
    borderColor: asset.borderColor,
    gradient: asset.gradient,
    _icon: asset.icon,
  }));

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Press Kit – Media & Interview Requests</title>
        <meta name="description" content="Official press kit for Mr. CAP. Download bio, photos, and media assets. Request interviews and features with Houston hip-hop veteran." />
        <link rel="canonical" href="https://mrcap1.com/opk/press" />
        <meta property="og:title" content="Mr. CAP | Press Kit – Media & Interview Requests" />
        <meta property="og:description" content="Download press materials and request interviews with Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/opk/press" />
        <meta property="og:image" content="https://mrcap1.com/images/opk-download.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://mrcap1.com/images/opk-download.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mr. CAP Press Kit",
            "description": "Official press kit for Mr. CAP with bio, photos, and media assets.",
            "url": "https://mrcap1.com/opk/press",
            "mainEntity": {
              "@type": "Person",
              "@id": "https://mrcap1.com/#person",
              "name": "Mr. CAP",
              "description": "Houston-based hip-hop artist and member of the South Park Coalition.",
              "knowsAbout": ["Hip-Hop Music", "Blockchain", "NFT", "Independent Music"],
              "award": "First Houston rapper to sell a hip-hop NFT",
              "memberOf": { "@type": "MusicGroup", "name": "South Park Coalition" }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
                { "@type": "ListItem", "position": 2, "name": "OPK", "item": "https://mrcap1.com/opk" },
                { "@type": "ListItem", "position": 3, "name": "Press", "item": "https://mrcap1.com/opk/press" }
              ]
            }
          })}
        </script>
      </Helmet>

      <OPKLayout
        title="Houston Hip-Hop Legacy, Built to Last"
        subtitle=""
        tagline="Press & Media OPK"
        ctaLabel="Request an Interview"
        breadcrumb="Press"
      >
        {/* Press Bio */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-6 text-center">Press Bio</h2>
              <div className="gsap-item bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Mr. CAP is a Houston-based hip-hop artist whose career reflects the evolution of Southern rap culture. As a member of the iconic South Park Coalition, he emerged from the same creative ecosystem that helped define Houston's influence on hip-hop worldwide.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Beyond music, Mr. CAP has expanded into media, film, and digital innovation. He contributed music and perspective to the documentary The Life: Sex Trafficking and Modern-Day Slavery.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In 2021, Mr. CAP became the first Houston rapper to sell a hip-hop NFT, marking a milestone in the intersection of music and blockchain culture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Press Highlights */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Press Highlights</h2>
              <ul className="space-y-4">
                {pressHighlights.map((highlight, index) => (
                  <li key={index} className="gsap-item flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Media Assets */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Media Assets</h2>
              <div style={{ height: '220px', position: 'relative' }}>
                <ChromaGrid
                  items={assetItems}
                  columns={3}
                  radius={200}
                  renderCard={(item) => {
                    const Icon = item._icon as React.ComponentType<{ className?: string }>;
                    return (
                      <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold mb-2 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="gsap-item text-2xl font-display font-bold mb-6">Download Press Materials</h2>
            <div className="gsap-item flex flex-wrap gap-4 justify-center">
              <Button variant="flux" size="lg" asChild>
                <a href="/press-kit.pdf" download>
                  <FileText className="mr-2 h-5 w-5" />
                  Download Press Kit (PDF)
                </a>
              </Button>
              <Button variant="fluxOutline" size="lg" asChild>
                <a href="/press-photos.zip" download>
                  <Image className="mr-2 h-5 w-5" />
                  Download High-Res Photos
                </a>
              </Button>
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKPress;

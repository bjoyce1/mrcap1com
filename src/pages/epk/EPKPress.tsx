import { Helmet } from "react-helmet-async";
import { Download, FileText, Image, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";

const pressHighlights = [
  "Member of the South Park Coalition",
  "Documentary contributor (The Life: Sex Trafficking and Modern-Day Slavery)",
  "First Houston rapper to sell a hip-hop NFT (Feb 25, 2021)",
];

const EPKPress = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Press Kit – Media & Interview Requests</title>
        <meta 
          name="description" 
          content="Official press kit for Mr. CAP. Download bio, photos, and media assets. Request interviews and features with Houston hip-hop veteran." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk/press" />
        <meta property="og:title" content="Mr. CAP | Press Kit – Media & Interview Requests" />
        <meta property="og:description" content="Download press materials and request interviews with Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/epk/press" />
      </Helmet>

      <EPKLayout
        title="Houston Hip-Hop Legacy, Built to Last"
        subtitle=""
        tagline="Press & Media EPK"
        ctaLabel="Request an Interview"
        breadcrumb="Press"
      >
        {/* Press Bio */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6 text-center">Press Bio</h2>
              <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Mr. CAP is a Houston-based hip-hop artist whose career reflects the evolution of Southern rap culture. As a member of the iconic South Park Coalition, he emerged from the same creative ecosystem that helped define Houston's influence on hip-hop worldwide. While trends shifted and industry gates closed, Mr. CAP remained independent—continuing to release music and perform without compromising authenticity.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Beyond music, Mr. CAP has expanded into media, film, and digital innovation. He contributed music and perspective to the documentary The Life: Sex Trafficking and Modern-Day Slavery, lending his voice to a project addressing real-world issues through storytelling.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In 2021, Mr. CAP became the first Houston rapper to sell a hip-hop NFT, marking a milestone in the intersection of music and blockchain culture. Today, he represents a rare blend of legacy credibility and forward-thinking independence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Press Highlights */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Press Highlights</h2>
              <ul className="space-y-4">
                {pressHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Media Assets */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Media Assets</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Image className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Press Photos</h3>
                  <p className="text-sm text-muted-foreground">High-resolution press photos</p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Logos</h3>
                  <p className="text-sm text-muted-foreground">Official logos and branding</p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Download className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Press Kit</h3>
                  <p className="text-sm text-muted-foreground">Downloadable Press Kit (ZIP)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold mb-6">Download Press Materials</h2>
            <div className="flex flex-wrap gap-4 justify-center">
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
      </EPKLayout>
    </>
  );
};

export default EPKPress;

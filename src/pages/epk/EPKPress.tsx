import { Helmet } from "react-helmet-async";
import { Download, Quote, FileText, Image, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";

const pressHighlights = [
  {
    outlet: "PBS",
    title: "Featured in 'The Life' Documentary",
    type: "Documentary",
  },
  {
    outlet: "Amazon Prime Video",
    title: "'Dear Frank' Official Soundtrack",
    type: "Film Soundtrack",
  },
  {
    outlet: "Sound.xyz",
    title: "Dippin Thru the Metaverse",
    type: "Feature",
  },
  {
    outlet: "NFT Now",
    title: "First Houston Rapper to Sell Hip-Hop NFT",
    type: "Coverage",
  },
];

const pullQuotes = [
  {
    quote: "Shout-out to Mr. Cap… he a hardworking man. I sit and watch him all the time. I learn a lot from watching things.",
    source: "Sosamann, HotNewHipHop Interview (2022)",
  },
  {
    quote: "Mr. CAP represents the true essence of Houston hip-hop. His longevity and authenticity are unmatched.",
    source: "K-Rino, South Park Coalition Founder",
  },
];

const mediaBio = `Cornelius A. Pratt, known professionally as Mr. CAP, is a Houston-born rapper, writer, and creative technologist. A founding member of the legendary South Park Coalition, he has been a fixture in Texas underground hip-hop for over three decades. His discography includes "The Art of ISM" (Sony/The Orchard, 2019) and the SPC group album "The Ties That Bind Us" (2024). In 2021, he became the first Houston rapper to sell a Hip Hop NFT on the blockchain. His work spans music, film soundtracks, and blockchain innovation.`;

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
        title="Press & Media Kit"
        subtitle="Everything journalists, podcasters, and content creators need. Bio, photos, quotes, and media assets ready to download."
        tagline="Press EPK"
        ctaLabel="Request an Interview"
        breadcrumb="Press"
      >
        {/* Media-Ready Bio */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6">Media-Ready Bio</h2>
              <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-muted-foreground leading-relaxed text-lg">{mediaBio}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(mediaBio)}
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Download Press Materials</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="flux" size="lg" className="w-full" asChild>
                  <a href="/press-kit.pdf" download>
                    <FileText className="mr-2 h-5 w-5" />
                    Download Press Kit (PDF)
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" className="w-full" asChild>
                  <a href="/press-photos.zip" download>
                    <Image className="mr-2 h-5 w-5" />
                    Download High-Res Photos
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Press Highlights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8">Featured Coverage</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {pressHighlights.map((item) => (
                <div
                  key={item.title}
                  className="bg-card/50 border border-border/50 rounded-xl p-6 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">{item.outlet}</span>
                    <h3 className="font-bold mt-1">{item.title}</h3>
                    <span className="text-sm text-muted-foreground">{item.type}</span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pull Quotes */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Pull Quotes</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pullQuotes.map((item, index) => (
                <div
                  key={index}
                  className="bg-card/50 border border-border/50 rounded-xl p-6"
                >
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-foreground italic mb-4 text-lg">"{item.quote}"</p>
                  <p className="text-sm text-muted-foreground">— {item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKPress;

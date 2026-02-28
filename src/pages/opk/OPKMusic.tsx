import { Helmet } from "react-helmet-async";
import { Download, Music, Mic, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const artistSnapshot = [
  { label: "Genre", value: "Hip-Hop (Southern / Houston)", borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, hsl(var(--background)))" },
  { label: "Origin", value: "Houston, Texas", borderColor: "#10B981", gradient: "linear-gradient(210deg, #10B981, hsl(var(--background)))" },
  { label: "Affiliation", value: "South Park Coalition (SPC)", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, hsl(var(--background)))" },
  { label: "Performance Formats", value: "Full Set & Feature Appearance", borderColor: "#8B5CF6", gradient: "linear-gradient(195deg, #8B5CF6, hsl(var(--background)))" },
];

const musicHighlights = [
  "Featured Single: \"Bet'n On Me\"",
  "Discography spanning independent releases and collaborations",
  "Available on Spotify, Apple Music, and YouTube",
];

const OPKMusic = () => {
  const snapshotItems: ChromaGridItem[] = artistSnapshot.map((item) => ({
    title: item.value,
    subtitle: item.label,
    borderColor: item.borderColor,
    gradient: item.gradient,
  }));

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Booking OPK – Live Hip Hop Performer</title>
        <meta name="description" content="Book Mr. CAP, Houston hip-hop artist and South Park Coalition member, for full set or feature appearances. Download the booking OPK." />
        <link rel="canonical" href="https://mrcap1.com/opk/music" />
        <meta property="og:title" content="Mr. CAP | Booking OPK – Live Hip Hop Performer" />
        <meta property="og:description" content="Book Mr. CAP for live performances. Full sets, features, festivals." />
        <meta property="og:url" content="https://mrcap1.com/opk/music" />
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
            "name": "Mr. CAP Booking OPK",
            "description": "Book Mr. CAP for live performances, full sets, and feature appearances.",
            "url": "https://mrcap1.com/opk/music",
            "mainEntity": {
              "@type": "MusicGroup",
              "@id": "https://mrcap1.com/#musicgroup",
              "name": "Mr. CAP",
              "genre": ["Hip-Hop", "Southern Hip-Hop", "Houston Rap"],
              "foundingLocation": { "@type": "Place", "name": "Houston, Texas" },
              "member": { "@type": "Person", "@id": "https://mrcap1.com/#person", "name": "Mr. CAP" },
              "event": {
                "@type": "Event",
                "name": "Book Mr. CAP Live Performance",
                "performer": { "@type": "Person", "name": "Mr. CAP" },
                "organizer": { "@type": "Organization", "name": "South Park Coalition LLC", "email": "southparkcoalitionllc@gmail.com" }
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
                { "@type": "ListItem", "position": 2, "name": "OPK", "item": "https://mrcap1.com/opk" },
                { "@type": "ListItem", "position": 3, "name": "Music & Booking", "item": "https://mrcap1.com/opk/music" }
              ]
            }
          })}
        </script>
      </Helmet>

      <OPKLayout
        title="MR. CAP"
        subtitle="South Park Born. SPC Raised. Independent & Future-Focused."
        tagline="Music & Booking OPK"
        ctaLabel="Book Mr. CAP"
        breadcrumb="Music & Booking"
      >
        {/* Artist Snapshot */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Artist Snapshot</h2>
              <div style={{ height: '280px', position: 'relative' }}>
                <ChromaGrid
                  items={snapshotItems}
                  columns={2}
                  radius={200}
                  renderCard={(item) => (
                    <div className="p-6">
                      <span className="text-sm text-muted-foreground">{item.subtitle}</span>
                      <p className="font-bold text-foreground">{item.title}</p>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Booking Bio */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-6 text-center">Booking Bio</h2>
              <p className="gsap-item text-lg text-muted-foreground leading-relaxed text-center">
                Mr. CAP is a Houston hip-hop artist and proud member of the legendary South Park Coalition. With deep roots in the Screwed Up Click era, his career represents longevity, independence, and authenticity.
              </p>
            </div>
          </div>
        </section>

        {/* Music Highlights */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Music Highlights</h2>
              <ul className="space-y-4 mb-8">
                {musicHighlights.map((highlight, index) => (
                  <li key={index} className="gsap-item flex items-start gap-3">
                    <Music className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="gsap-item mt-8">
                <iframe
                  src="https://open.spotify.com/embed/artist/69pjfQNXA1xjusnI2wfgug?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Live Performance */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Live Performance</h2>
              <ul className="space-y-4">
                <li className="gsap-item flex items-start gap-3">
                  <Mic className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">High-energy, professional stage execution</span>
                </li>
                <li className="gsap-item flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Ideal for clubs, festivals, curated hip-hop events</span>
                </li>
                <li className="gsap-item flex items-start gap-3">
                  <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Technical rider available upon request</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="gsap-item text-2xl font-display font-bold mb-6">Download Materials</h2>
            <div className="gsap-item flex flex-wrap gap-4 justify-center">
              <Button variant="flux" size="lg" asChild>
                <a href="/booking-opk.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Booking OPK (PDF)
                </a>
              </Button>
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKMusic;

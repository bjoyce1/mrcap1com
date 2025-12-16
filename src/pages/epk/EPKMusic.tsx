import { Helmet } from "react-helmet-async";
import { Download, Music, Mic, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";

const artistSnapshot = [
  { label: "Genre", value: "Hip-Hop (Southern / Houston)" },
  { label: "Origin", value: "Houston, Texas" },
  { label: "Affiliation", value: "South Park Coalition (SPC)" },
  { label: "Performance Formats", value: "Full Set & Feature Appearance" },
];

const musicHighlights = [
  "Featured Single: \"Bet'n On Me\"",
  "Discography spanning independent releases and collaborations",
  "Available on Spotify, Apple Music, and YouTube",
];

const EPKMusic = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Booking EPK – Live Hip Hop Performer</title>
        <meta 
          name="description" 
          content="Book Mr. CAP, Houston hip-hop artist and South Park Coalition member, for full set or feature appearances. Download the booking EPK." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk/music" />
        <meta property="og:title" content="Mr. CAP | Booking EPK – Live Hip Hop Performer" />
        <meta property="og:description" content="Book Mr. CAP for live performances. Full sets, features, festivals." />
        <meta property="og:url" content="https://mrcap1.com/epk/music" />
      </Helmet>

      <EPKLayout
        title="MR. CAP"
        subtitle="South Park Born. SPC Raised. Independent & Future-Focused."
        tagline="Music & Booking EPK"
        ctaLabel="Book Mr. CAP"
        breadcrumb="Music & Booking"
      >
        {/* Artist Snapshot */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Artist Snapshot</h2>
              <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {artistSnapshot.map((item) => (
                    <div key={item.label}>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <p className="font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Bio */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6 text-center">Booking Bio</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                Mr. CAP is a Houston hip-hop artist and proud member of the legendary South Park Coalition. With deep roots in the Screwed Up Click era, his career represents longevity, independence, and authenticity. Known for commanding stage presence and polished delivery, Mr. CAP brings Southern grit with modern energy—making him a strong fit for clubs, showcases, and festivals nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* Music Highlights */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Music Highlights</h2>
              <ul className="space-y-4 mb-8">
                {musicHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              {/* Spotify Embed */}
              <div className="mt-8">
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
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Live Performance</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">High-energy, professional stage execution</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Ideal for clubs, festivals, curated hip-hop events</span>
                </li>
                <li className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Technical rider available upon request</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold mb-6">Download Materials</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="flux" size="lg" asChild>
                <a href="/booking-epk.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Booking EPK (PDF)
                </a>
              </Button>
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKMusic;

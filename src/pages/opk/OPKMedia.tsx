import { Helmet } from "react-helmet-async";
import { Mic } from "lucide-react";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const speakingTopics = [
  "Independent artistry & ownership",
  "Hip-hop culture & longevity",
  "Music and blockchain",
  "Life beyond the mainstream industry",
];

const OPKMedia = () => {
  const topicItems: ChromaGridItem[] = speakingTopics.map((topic, i) => ({
    title: topic,
    borderColor: "hsl(var(--primary))",
    gradient: `linear-gradient(${145 + i * 30}deg, hsl(var(--primary) / 0.12), hsl(var(--background)))`,
  }));

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Film & Speaking OPK – Documentary, Soundtracks, Keynotes</title>
        <meta name="description" content="Book Mr. CAP for film projects, music supervision, documentaries, and speaking engagements. PBS documentary featured. Amazon Prime soundtrack." />
        <link rel="canonical" href="https://mrcap1.com/opk/media" />
        <meta property="og:title" content="Mr. CAP | Film & Speaking OPK" />
        <meta property="og:description" content="Film credits, soundtracks, and speaking engagements with Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/opk/media" />
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
            "name": "Mr. CAP Film & Speaking OPK",
            "description": "Book Mr. CAP for film projects, documentaries, and speaking engagements.",
            "url": "https://mrcap1.com/opk/media",
            "mainEntity": {
              "@type": "Person",
              "@id": "https://mrcap1.com/#person",
              "name": "Mr. CAP",
              "description": "Houston hip-hop artist with experience in film, media, and cultural commentary.",
              "knowsAbout": ["Independent Artistry", "Hip-Hop Culture", "Music and Blockchain", "Creative Industries"],
              "hasCredential": { "@type": "EducationalOccupationalCredential", "name": "Documentary Contributor" }
            },
            "potentialAction": { "@type": "ContactAction", "target": "mailto:southparkcoalitionllc@gmail.com", "name": "Media & Speaking Inquiries" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
                { "@type": "ListItem", "position": 2, "name": "OPK", "item": "https://mrcap1.com/opk" },
                { "@type": "ListItem", "position": 3, "name": "Media", "item": "https://mrcap1.com/opk/media" }
              ]
            }
          })}
        </script>
      </Helmet>

      <OPKLayout
        title="Independent Voice in Music, Media & Culture"
        subtitle=""
        tagline="Film & Speaking OPK"
        ctaLabel="Media & Speaking Inquiries"
        breadcrumb="Media"
      >
        {/* Narrative Bio */}
        <section className="gsap-section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-6 text-center">Narrative Bio</h2>
              <div className="gsap-item bg-card/50 border border-border/50 rounded-xl p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Mr. CAP's career extends beyond music into film, media, and cultural commentary. As a contributor to The Life: Sex Trafficking and Modern-Day Slavery, he brings perspective shaped by lived experience and artistic discipline.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  As hip-hop continues to intersect with technology and entrepreneurship, Mr. CAP stands as an example of evolution without erasure—maintaining cultural roots while embracing future platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Speaking & Media Topics */}
        <section className="gsap-section py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="gsap-item text-2xl font-display font-bold mb-8 text-center">Speaking & Media Topics</h2>
              <div style={{ height: '280px', position: 'relative' }}>
                <ChromaGrid
                  items={topicItems}
                  columns={2}
                  radius={200}
                  renderCard={(item) => (
                    <div className="flex items-center gap-4 p-6">
                      <Mic className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item.title}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKMedia;

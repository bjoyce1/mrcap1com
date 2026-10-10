import { Mic } from "lucide-react";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

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
      <SEO entry={routeSeo("/opk/media")} />

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
                  As hip-hop continues to intersect with technology and entrepreneurship, Mr. CAP stands as an example of evolution without erasure, maintaining cultural roots while embracing future platforms.
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

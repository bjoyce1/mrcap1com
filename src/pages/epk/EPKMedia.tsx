import { Helmet } from "react-helmet-async";
import { Mic } from "lucide-react";
import EPKLayout from "@/components/EPKLayout";

const speakingTopics = [
  "Independent artistry & ownership",
  "Hip-hop culture & longevity",
  "Music and blockchain",
  "Life beyond the mainstream industry",
];

const EPKMedia = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Film & Speaking EPK – Documentary, Soundtracks, Keynotes</title>
        <meta 
          name="description" 
          content="Book Mr. CAP for film projects, music supervision, documentaries, and speaking engagements. PBS documentary featured. Amazon Prime soundtrack." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk/media" />
        <meta property="og:title" content="Mr. CAP | Film & Speaking EPK" />
        <meta property="og:description" content="Film credits, soundtracks, and speaking engagements with Mr. CAP." />
        <meta property="og:url" content="https://mrcap1.com/epk/media" />
      </Helmet>

      <EPKLayout
        title="Independent Voice in Music, Media & Culture"
        subtitle=""
        tagline="Film & Speaking EPK"
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
                  Mr. CAP's career extends beyond music into film, media, and cultural commentary. As a contributor to The Life: Sex Trafficking and Modern-Day Slavery, he brings perspective shaped by lived experience and artistic discipline. His independent path offers insight into ownership, longevity, and adaptation within creative industries.
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
              <div className="grid md:grid-cols-2 gap-4">
                {speakingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="gsap-item bg-card/50 border border-border/50 rounded-xl p-6 flex items-center gap-4"
                  >
                    <Mic className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{topic}</span>
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

export default EPKMedia;
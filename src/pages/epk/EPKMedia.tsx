import { Helmet } from "react-helmet-async";
import { Download, Film, Mic, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";
import dearFrankSoundtrack from "@/assets/dear-frank-soundtrack.png";
import theLifeDocumentary from "@/assets/the-life-documentary.png";

const mediaCredits = [
  {
    title: "The Life",
    type: "Documentary",
    role: "Featured Artist",
    platform: "PBS",
    image: theLifeDocumentary,
  },
  {
    title: "Dear Frank",
    type: "Feature Film",
    role: "Soundtrack: 'Get Me Right'",
    platform: "Amazon Prime Video",
    image: dearFrankSoundtrack,
  },
];

const speakingTopics = [
  {
    title: "Independent Artist Survival",
    description: "Building a 30+ year career without a major label. Distribution, revenue streams, and creative control.",
  },
  {
    title: "Hip-Hop & Blockchain",
    description: "First Houston rapper to sell an NFT. Music ownership, Web3 opportunities, and the future of digital art.",
  },
  {
    title: "Houston Hip-Hop History",
    description: "The South Park Coalition story. Building a movement from the streets of Houston to international recognition.",
  },
  {
    title: "Creative Entrepreneurship",
    description: "From artist to business owner. CAP Distributions, catalog ownership, and building lasting enterprises.",
  },
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
        title="Film & Speaking"
        subtitle="Documentary features, film soundtracks, music supervision, and keynote speaking. Real stories from 30+ years in the game."
        tagline="Media EPK"
        ctaLabel="Book for Your Project"
        breadcrumb="Media"
      >
        {/* Film Credits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Film & Documentary Credits</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mediaCredits.map((credit) => (
                <div
                  key={credit.title}
                  className="bg-card/50 border border-border/50 rounded-xl overflow-hidden"
                >
                  <img 
                    src={credit.image} 
                    alt={credit.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">{credit.platform}</span>
                    <h3 className="text-xl font-bold mt-1">{credit.title}</h3>
                    <p className="text-muted-foreground">{credit.type} • {credit.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speaking Topics */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Speaking Topics</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {speakingTopics.map((topic) => (
                <div
                  key={topic.title}
                  className="bg-card/50 border border-border/50 rounded-xl p-6"
                >
                  <Mic className="w-6 h-6 text-primary mb-3" />
                  <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                <Film className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Documentary</h3>
                <p className="text-sm text-muted-foreground">Interviews, archival content, on-camera appearances</p>
              </div>
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                <Music className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Music Supervision</h3>
                <p className="text-sm text-muted-foreground">Soundtrack curation, original compositions, sync licensing</p>
              </div>
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                <Video className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Keynotes</h3>
                <p className="text-sm text-muted-foreground">Conferences, panels, university lectures, workshops</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold mb-6">Download Media Kit</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="flux" size="lg" asChild>
                <a href="/media-kit.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Media EPK (PDF)
                </a>
              </Button>
              <Button variant="fluxOutline" size="lg" asChild>
                <a href="/speaking-one-sheet.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Speaking One-Sheet (PDF)
                </a>
              </Button>
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKMedia;

import { Helmet } from "react-helmet-async";
import { Download, Music, Users, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import EPKLayout from "@/components/EPKLayout";

const performanceTypes = [
  {
    title: "Full Set Performance",
    duration: "45-90 minutes",
    description: "Complete live show with DJ, full catalog performance, crowd engagement.",
  },
  {
    title: "Feature Appearance",
    duration: "15-30 minutes",
    description: "Guest spot at your event. High-energy set of top tracks.",
  },
  {
    title: "Festival Set",
    duration: "30-60 minutes",
    description: "Festival-optimized performance with visual elements available.",
  },
  {
    title: "Private Event",
    duration: "Custom",
    description: "Corporate events, private parties, exclusive gatherings.",
  },
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
        title="Book Mr. CAP"
        subtitle="30+ years of live performance. From Houston clubs to national stages. Available for full sets, features, and festival appearances."
        tagline="Booking EPK"
        ctaLabel="Book a Show"
        breadcrumb="Music & Booking"
      >
        {/* Performance Types */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Performance Options</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {performanceTypes.map((type) => (
                <div
                  key={type.title}
                  className="bg-card/50 border border-border/50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Music className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">{type.title}</h3>
                  </div>
                  <p className="text-sm text-primary mb-2">{type.duration}</p>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spotify Embed */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">Listen Now</h2>
            <div className="max-w-2xl mx-auto">
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
        </section>

        {/* Technical Rider Summary */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Technical Requirements</h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <span>DJ booth with 2-channel mixer minimum</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-primary mt-0.5" />
                    <span>2 wireless handheld microphones (SM58 or equivalent)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <span>Stage monitor (1 minimum, 2 preferred)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <span>Green room access 1 hour before set</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Download Materials</h2>
                <div className="space-y-4">
                  <Button variant="flux" className="w-full justify-start" asChild>
                    <a href="/booking-epk.pdf" download>
                      <Download className="mr-2 h-5 w-5" />
                      Download Booking EPK (PDF)
                    </a>
                  </Button>
                  <Button variant="fluxOutline" className="w-full justify-start" asChild>
                    <a href="/technical-rider.pdf" download>
                      <Download className="mr-2 h-5 w-5" />
                      Download Technical Rider (PDF)
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Embed */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">Live Performance</h2>
            <div className="max-w-3xl mx-auto aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/videoseries?list=PLExample"
                title="Mr. CAP Live Performances"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              />
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKMusic;

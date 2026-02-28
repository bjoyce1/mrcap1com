import { useRef, useEffect } from "react";
import { Film, Quote, Download, Award, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import dearFrankSoundtrack from "@/assets/dear-frank-soundtrack.png";
import theLifeDocumentary from "@/assets/the-life-documentary.png";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const PressSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featuredItems: ChromaGridItem[] = [
    {
      title: "Documentary Feature",
      subtitle: "The Life: Sex Trafficking and Modern-Day Slavery",
      image: theLifeDocumentary,
      borderColor: "#F59E0B",
      gradient: "linear-gradient(145deg, rgba(245,158,11,0.1), hsl(var(--background)))",
      url: "https://www.pbs.org/show/the-life/",
      _type: "documentary",
    },
    {
      title: "Movie Soundtrack",
      subtitle: "Dear Frank – Song: \"Get Me Right\"",
      image: dearFrankSoundtrack,
      borderColor: "#3B82F6",
      gradient: "linear-gradient(210deg, rgba(59,130,246,0.1), hsl(var(--background)))",
      url: "https://www.amazon.com/gp/video/detail/amzn1.dv.gti.6559a27a-3134-4308-91de-a95896312683",
      _type: "soundtrack",
    },
  ];

  const bottomItems: ChromaGridItem[] = [
    {
      title: "Press Quotes",
      borderColor: "hsl(var(--primary))",
      gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.08), hsl(var(--background)))",
      _type: "quotes",
    },
    {
      title: "Media Downloads",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(210deg, rgba(245,158,11,0.08), hsl(var(--background)))",
      _type: "downloads",
    },
  ];

  return (
    <section ref={sectionRef} id="press" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Media</span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Press & <span className="text-gradient-gold">Notable Appearances</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Mr. CAP's work crosses beyond music into film, media, and community storytelling.
          </p>
        </div>

        {/* Featured Media */}
        <div className="mb-8" style={{ height: '460px', position: 'relative' }}>
          <ChromaGrid
            items={featuredItems}
            columns={2}
            radius={300}
            renderCard={(item) => (
              <div className="p-8 flex flex-col h-full">
                {item._type === "documentary" && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cap-gold/20 border border-cap-gold/30 self-end mb-4">
                    <Award className="w-4 h-4 text-cap-gold" />
                    <span className="text-xs text-cap-gold font-medium">Emmy Winner</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item._type === "documentary" ? <Film className="w-6 h-6 text-primary" /> : <Music2 className="w-6 h-6 text-primary" />}
                  </div>
                  <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                </div>
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full rounded-lg border border-border/50 mb-4" />
                )}
                <p className="text-muted-foreground text-sm">{item.subtitle}</p>
              </div>
            )}
          />
        </div>

        {/* Bottom Cards */}
        <div style={{ height: '300px', position: 'relative' }}>
          <ChromaGrid
            items={bottomItems}
            columns={2}
            radius={250}
            renderCard={(item) => (
              <div className="p-6 h-full">
                {item._type === "quotes" ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Quote className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                    </div>
                    <div className="space-y-4">
                      <blockquote className="border-l-2 border-cap-gold pl-4 py-2">
                        <p className="text-foreground italic text-sm">"A true architect of South Park storytelling — bridging old school reality rap with forward-thinking ideas."</p>
                      </blockquote>
                      <blockquote className="border-l-2 border-primary pl-4 py-2">
                        <p className="text-foreground italic text-sm">"Mr. CAP brings the perspective of someone who's lived it, learned from it, and decided to build something greater."</p>
                      </blockquote>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-cap-gold/20 flex items-center justify-center">
                        <Download className="w-5 h-5 text-cap-gold" />
                      </div>
                      <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                    </div>
                    <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                      <li>• High-resolution press photos</li>
                      <li>• Official logo and wordmark</li>
                      <li>• Album covers and single artwork</li>
                      <li>• Artist biography (short & long form)</li>
                    </ul>
                    <Button variant="gold" className="w-full">
                      <Download className="w-4 h-4" />Download Full Press Kit (ZIP)
                    </Button>
                  </>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default PressSection;

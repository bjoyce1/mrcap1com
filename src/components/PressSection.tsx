import { useRef, useEffect, useCallback, useState } from "react";
import { Film, Quote, Download, Award, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import useEmblaCarousel from "embla-carousel-react";
import dearFrankSoundtrack from "@/assets/dear-frank-soundtrack.png";
import theLifeDocumentary from "@/assets/the-life-documentary.png";

const pressQuotes = [
  {
    text: "A true architect of South Park storytelling — bridging old school reality rap with forward-thinking ideas.",
    source: "Houston Press",
  },
  {
    text: "Mr. CAP brings the perspective of someone who's lived it, learned from it, and decided to build something greater.",
    source: "Culture Magazine",
  },
  {
    text: "One of the most quietly influential figures in Houston's underground — an artist who refuses to be boxed in.",
    source: "Third Coast Review",
  },
  {
    text: "CAP is proof that longevity in hip-hop isn't about staying the same — it's about evolving without losing your roots.",
    source: "Swishahouse Radio",
  },
];

const PressSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuredCardsRef = useRef<HTMLDivElement>(null);
  const bottomCardsRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-play
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
      if (featuredCardsRef.current) {
        gsap.fromTo(
          featuredCardsRef.current.children,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: featuredCardsRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }
      if (bottomCardsRef.current) {
        gsap.fromTo(
          bottomCardsRef.current.children,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: bottomCardsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="press" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Media</span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Press & <span className="text-gradient-gold">Notable Appearances</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Mr. CAP's work crosses beyond music into film, media, and community storytelling.
            His voice and perspective have been featured in documentaries, interviews, and regional press.
          </p>
        </div>

        {/* Press Quotes Carousel */}
        <div className="mb-12 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {pressQuotes.map((quote, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] px-3">
                  <blockquote className="border-l-2 border-cap-gold pl-6 py-6 h-full">
                    <p className="font-serif text-xl md:text-2xl italic text-foreground leading-relaxed">
                      "{quote.text}"
                    </p>
                    <cite className="block mt-4 text-sm text-muted-foreground not-italic">
                      — {quote.source}
                    </cite>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Media Grid */}
        <div ref={featuredCardsRef} className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Documentary Feature */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cap-gold/20 border border-cap-gold/30">
                <Award className="w-4 h-4 text-cap-gold" />
                <span className="text-xs text-cap-gold font-medium">Emmy Winner</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl">Documentary Feature</h3>
                <p className="text-xs text-muted-foreground">2024 Lone Star Emmy Winner</p>
              </div>
            </div>
            <h4 className="font-display text-2xl mb-4 text-foreground">
              The Life: Sex Trafficking and Modern-Day Slavery
            </h4>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mr. CAP appears in this powerful documentary, nominated for a 2024 Lone Star Emmy Award.
              In the film, he offers insight from the viewpoint of an ex-pimp, adding firsthand
              perspective to a difficult, critical conversation about human trafficking.
            </p>
            <div className="mt-6">
              <img src={theLifeDocumentary} alt="The Life Documentary Cover" className="w-full rounded-lg border border-border/50" />
            </div>
            <a href="https://www.pbs.org/show/the-life/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
              Watch on PBS →
            </a>
          </div>

          {/* Movie Soundtrack Feature */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl">Movie Soundtrack</h3>
                <p className="text-xs text-muted-foreground">Feature Film Placement</p>
              </div>
            </div>
            <div className="mb-6">
              <img src={dearFrankSoundtrack} alt="Dear Frank Movie Soundtrack" className="w-full rounded-lg border border-border/50" />
            </div>
            <h4 className="font-display text-2xl mb-2 text-foreground">Dear Frank</h4>
            <p className="text-primary mb-4">Song: "Get Me Right"</p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Mr. CAP's track "Get Me Right" is featured on the official soundtrack for the
              feature film "Dear Frank," starring Brian White, Claudia Jordan, Columbus Short,
              and Kearia Schroeder.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.amazon.com/gp/video/detail/amzn1.dv.gti.6559a27a-3134-4308-91de-a95896312683?autoplay=0&ref_=atv_cf_strg_wb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                Watch on Prime Video →
              </a>
              <a href="https://www.imdb.com/title/tt34445946/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cap-gold hover:text-cap-gold/80 transition-colors text-sm font-medium">
                View on IMDb →
              </a>
            </div>
          </div>
        </div>

        {/* Media Downloads */}
        <div ref={bottomCardsRef} className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card-gradient rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl">Featured In</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                PBS — "The Life" Documentary
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cap-gold" />
                Houston Chronicle — Musical Roots Feature
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Dear Frank — Official Soundtrack
              </li>
            </ul>
          </div>

          <div className="bg-card-gradient rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cap-gold/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-cap-gold" />
              </div>
              <h3 className="font-display text-xl">Media Downloads</h3>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li>• High-resolution press photos</li>
              <li>• Official logo and wordmark</li>
              <li>• Album covers and single artwork</li>
              <li>• Artist biography (short & long form)</li>
            </ul>
            <Button variant="gold" className="w-full">
              <Download className="w-4 h-4" />
              Download Full Press Kit (ZIP)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressSection;

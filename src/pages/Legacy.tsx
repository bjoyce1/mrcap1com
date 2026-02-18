import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CitationBlock from "@/components/CitationBlock";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Music, Award, Globe, Users, Mic2, BookOpen, Briefcase, Film } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import heroBg from "@/assets/hero-bg.jpg";

const timelineEras = [
  {
    era: "The Foundation",
    period: "1973 – 1991",
    icon: Users,
    color: "from-amber-500/20 to-transparent",
    events: [
      { year: "1973", title: "Born in Houston's Third Ward", desc: "Cornelius A. Pratt is born on April 5, 1973, in Houston, Texas — raised in the Third Ward, one of the city's most historic and culturally rich neighborhoods." },
      { year: "1980s", title: "Musical Roots", desc: "Grows up in a musical family, performing and writing from a young age. The sounds of Houston's underground scene — chopped & screwed, Southern bounce, and raw street poetry — shape his ear." },
      { year: "1991", title: "Jack Yates High School Graduate", desc: "Graduates from Jack Yates Senior High School, a pillar of Houston's Black community. Later studies Computer Network Engineering and Computer Science." },
    ],
  },
  {
    era: "South Park Coalition Era",
    period: "1992 – 2004",
    icon: Mic2,
    color: "from-red-500/20 to-transparent",
    events: [
      { year: "1992", title: "Joins South Park Coalition", desc: "Becomes an original member of the legendary South Park Coalition alongside K-Rino, Klondike Kat, Dope-E, and Point Blank. The SPC becomes one of the most prolific underground collectives in hip-hop history." },
      { year: "1990s", title: "Underground Movement", desc: "Performs across Houston's underground circuit, building a loyal following through raw lyricism, storytelling, and relentless hustle. The SPC releases dozens of albums independently." },
      { year: "Late 1990s", title: "Business Foundations", desc: "Begins learning digital distribution and web design, planting seeds for the tech-forward approach that would define his later career." },
    ],
  },
  {
    era: "Solo Career & Discography",
    period: "2005 – 2018",
    icon: Music,
    color: "from-primary/20 to-transparent",
    events: [
      { year: "2005", title: "O.N.E. on O.N.E.", desc: "Releases debut solo album, establishing a unique sound blending Houston's underground with conscious lyricism and Southern grit." },
      { year: "2006", title: "Tha Cold Ass Pimp", desc: "Drops the critically acclaimed mixtape showcasing versatility and street credibility. Houston Press and Houston Chronicle take notice." },
      { year: "2011", title: "2 Tha Grave", desc: "Third project deepens the catalog with raw storytelling and signature Southern production." },
      { year: "2014", title: "Houston Chronicle Feature", desc: "Andrew Dansby profiles Mr. CAP's return to his musical roots, cementing his status as a Houston cultural figure." },
      { year: "2015", title: "Houston Press: 'Only One Mr. CAP'", desc: "Nathan Smith writes the defining profile: 'Somebody Tell Wiz Khalifa There's Only One Mr. CAP' — a feature that clarifies identity and underscores 20+ years of independence." },
    ],
  },
  {
    era: "The Art of ISM",
    period: "2019",
    icon: BookOpen,
    color: "from-purple-500/20 to-transparent",
    events: [
      { year: "2019", title: "The Art of ISM via Sony Music / The Orchard", desc: "Releases his most ambitious album through Sony Music/The Orchard, featuring production from Zaytoven and Metro Boomin. The project blends mainstream appeal with underground authenticity." },
      { year: "2019", title: "National Distribution", desc: "For the first time, Mr. CAP's music reaches national and international audiences through major distribution channels while maintaining creative independence." },
    ],
  },
  {
    era: "Accolades & Recognition",
    period: "2014 – 2023",
    icon: Award,
    color: "from-yellow-500/20 to-transparent",
    events: [
      { year: "2014", title: "Lone Star Emmy Award Contribution", desc: "Contributes to 'The Life: Sex Trafficking and Modern-Day Slavery,' which wins a Lone Star Emmy Award — demonstrating range beyond music." },
      { year: "2019", title: "Congressional Recognition", desc: "Receives a Certificate of Congressional Recognition from Congresswoman Sheila Jackson Lee for contributions to Houston's culture and community." },
      { year: "2023", title: "50th Anniversary of Hip Hop Honor", desc: "Honored by Broadcast Houston during the 50th Anniversary of Hip Hop celebration, recognizing three decades of contribution to the genre." },
    ],
  },
  {
    era: "Web3 & NFT Pioneer",
    period: "2021 – 2023",
    icon: Globe,
    color: "from-cyan-500/20 to-transparent",
    events: [
      { year: "2021", title: "First Houston Rapper to Sell a Hip Hop NFT", desc: "Makes history by minting and selling 'Limitless' on OpenSea, becoming the first Houston rapper to enter the NFT space. The move pioneers blockchain-based music ownership for independent artists." },
      { year: "2022", title: "Sound.xyz & Collector Community", desc: "Expands into Sound.xyz, building a collector community around exclusive music drops and proving that independent artists can thrive in Web3." },
      { year: "2023", title: "Art of ISM NFT Collection", desc: "Launches a curated NFT art collection, further bridging hip-hop culture with digital art and blockchain technology." },
    ],
  },
  {
    era: "The New Chapter",
    period: "2024 – Present",
    icon: Briefcase,
    color: "from-primary/20 to-transparent",
    events: [
      { year: "2024", title: "The Ties That Bind Us", desc: "Releases the South Park Coalition group album featuring 19 tracks with the lead single 'Bet'n On Me' — a soundtrack for people betting on themselves." },
      { year: "2024", title: "CAP Distributions & Mortuary Media LLC", desc: "Formalizes independent business ventures: CAP Distributions for digital music distribution and Mortuary Media LLC for media production." },
      { year: "2025", title: "mrcap1.com Platform", desc: "Launches a fully independent digital platform featuring first-party streaming (CAP STREAM), NFT gallery, merchandise, and booking — all controlled from a single domain." },
      { year: "2025", title: "SPC Austin 2025", desc: "South Park Coalition expands beyond Houston with live events in Austin, carrying the movement into new markets." },
    ],
  },
];

const Legacy = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });

      const cards = timelineRef.current?.querySelectorAll(".era-card");
      cards?.forEach((card) => {
        gsap.from(card, {
          y: 50, opacity: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Legacy & Timeline — Mr. CAP | 30+ Years in Houston Hip-Hop",
    description: "The definitive career timeline of Mr. CAP: from Houston's Third Ward to the South Park Coalition, four studio albums, a Lone Star Emmy contribution, Congressional Recognition, and pioneering hip-hop NFTs.",
    url: "https://mrcap1.com/legacy",
    mainEntity: {
      "@type": "Person",
      name: "Mr. CAP",
      alternateName: "Cornelius A. Pratt",
      url: "https://mrcap1.com",
    },
  };

  return (
    <>
      <Helmet>
        <title>Legacy & Timeline | Mr. CAP — 30+ Years in Houston Hip-Hop</title>
        <meta name="description" content="The definitive career timeline of Mr. CAP: from Houston's Third Ward to the South Park Coalition, four studio albums, a Lone Star Emmy contribution, Congressional Recognition, and pioneering hip-hop NFTs." />
        <link rel="canonical" href="https://mrcap1.com/legacy" />
        <meta property="og:title" content="Legacy & Timeline | Mr. CAP — 30+ Years in Houston Hip-Hop" />
        <meta property="og:description" content="The definitive career timeline of Mr. CAP — every era, every milestone, every chapter." />
        <meta property="og:url" content="https://mrcap1.com/legacy" />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          {/* Hero */}
          <section className="relative min-h-[50vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            <div className="relative z-10 container mx-auto px-4 py-24" ref={heroRef}>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Legacy</span>
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                <span className="text-gradient-orange">Legacy</span> & Timeline
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                South Park Born. Class of '92. Future-Focused. — The definitive record of Mr. CAP's career, from Houston's Third Ward to the blockchain.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-20" ref={timelineRef}>
            <div className="container mx-auto px-4 max-w-4xl">
              {timelineEras.map((era, eraIndex) => (
                <div key={era.era} className="era-card mb-16 last:mb-0">
                  {/* Era Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${era.color} border border-border/50`}>
                      <era.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold">{era.era}</h2>
                      <p className="text-sm text-muted-foreground font-mono">{era.period}</p>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="relative pl-8 border-l-2 border-border/30 space-y-8">
                    {era.events.map((event, eventIndex) => (
                      <div key={`${era.era}-${eventIndex}`} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[calc(2rem+5px)] top-1 w-3 h-3 rounded-full bg-primary/60 border-2 border-primary" />
                        <div className="bg-card/40 border border-border/30 rounded-xl p-6 hover:border-primary/40 transition-colors">
                          <span className="text-primary font-mono text-sm font-medium">{event.year}</span>
                          <h3 className="text-lg font-bold mt-1">{event.title}</h3>
                          <p className="text-muted-foreground mt-2 leading-relaxed">{event.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-card/20 border-t border-border/50">
            <div className="container mx-auto px-4 text-center max-w-2xl">
              <h2 className="text-3xl font-display font-bold mb-4">The Story Continues</h2>
              <p className="text-muted-foreground mb-8">
                30+ years of music, business, and innovation — and the next chapter is just getting started.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="flux" asChild>
                  <Link to="/music">Stream the Music</Link>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <Link to="/booking">Book Mr. CAP</Link>
                </Button>
                <Button variant="fluxGhost" asChild>
                  <Link to="/press">Press & Media</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <CitationBlock />
        <Footer />
      </div>
    </>
  );
};

export default Legacy;

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CitationBlock from "@/components/CitationBlock";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Music, Mic2, Trophy, Users, Calendar, Sparkles, GraduationCap, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const timeline = [
  { year: "1990s", title: "South Park Coalition Origins", desc: "Joined the legendary South Park Coalition as an original member alongside K-Rino, Dope-E, and Klondike Kat" },
  { year: "Early Career", title: "Jack Yates High School", desc: "Graduated from Jack Yates Senior High School, later studying Computer Network Engineering and Computer Science" },
  { year: "2005", title: "O.N.E. on O.N.E.", desc: "Released debut solo album, establishing a unique sound blending Houston's underground with conscious lyricism" },
  { year: "2006", title: "Tha Cold Ass Pimp", desc: "Dropped the critically acclaimed mixtape showcasing versatility and street credibility" },
  { year: "2011", title: "2 Tha Grave", desc: "Debut album introduced his signature blend of raw lyricism, storytelling, and Southern grit" },
  { year: "2019", title: "The Art of ISM", desc: "Third studio album via Sony Music/The Orchard featuring Zaytoven, Metro Boomin production" },
  { year: "2021", title: "NFT Pioneer", desc: "Became first Houston rapper to sell a Hip Hop NFT, minting 'Limitless' on OpenSea" },
  { year: "2024", title: "The Ties That Bind Us", desc: "Latest album with lead single 'Bet'n On Me' — a soundtrack for people betting on themselves" },
];

const highlights = [
  { icon: Users, label: "South Park Coalition", desc: "Original Member" },
  { icon: MapPin, label: "Houston, Texas", desc: "Third Ward Raised" },
  { icon: GraduationCap, label: "Jack Yates High School", desc: "Graduate" },
  { icon: Trophy, label: "First Houston NFT", desc: "Hip-Hop Pioneer" },
];

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Mr. CAP",
        "alternateName": "Cornelius A. Pratt",
        "description": "Houston-born rapper, South Park Coalition original member, and creative technologist connecting hip-hop, business, and blockchain.",
        "image": "https://mrcap1.com/og-image.jpg",
        "url": "https://mrcap1.com/about",
        "sameAs": [
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.youtube.com/@mrcap1",
          "https://twitter.com/mrcap1",
          "https://instagram.com/mrcapism",
          "https://www.tiktok.com/@mrcapism",
          "https://opensea.io/mrcap"
        ],
        "jobTitle": "Rapper, Writer, Technologist",
        "memberOf": {
          "@type": "MusicGroup",
          "name": "South Park Coalition"
        },
        "alumniOf": {
          "@type": "HighSchool",
          "name": "Jack Yates Senior High School",
          "address": { "@type": "PostalAddress", "addressLocality": "Houston", "addressRegion": "TX" }
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Houston",
          "addressRegion": "TX",
          "addressCountry": "US"
        },
        "knowsAbout": ["Hip-Hop Music", "Blockchain Technology", "NFTs", "Music Production", "Entrepreneurship", "Digital Distribution", "Computer Network Engineering"]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is Mr. CAP from?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP is from Houston, Texas, specifically the Third Ward/South Park area. He graduated from Jack Yates Senior High School."
            }
          },
          {
            "@type": "Question",
            "name": "What is Mr. CAP's real name?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP's real name is Cornelius A. Pratt."
            }
          },
          {
            "@type": "Question",
            "name": "What does CAP stand for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CAP stands for Cornelius A. Pratt, his initials."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://mrcap1.com/about" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>About Mr. CAP | Houston Legacy, South Park Coalition Roots & Future Vision</title>
        <meta name="description" content="Read the story behind Mr. CAP, from Houston roots and SPC history to current work across music and technology." />
        <link rel="canonical" href="https://mrcap1.com/about" />
        
        <meta property="og:title" content="About Mr. CAP | Houston Legacy, South Park Coalition Roots & Future Vision" />
        <meta property="og:description" content="Read the story behind Mr. CAP, from Houston roots and SPC history to current work across music and technology." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrcap1.com/about" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main>
          {/* Hero */}
          <section className="relative min-h-[50vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            
            <div className="relative z-10 container mx-auto px-4 py-24">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">About</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Mr. CAP
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Houston-born rapper, writer, and creative technologist with deep roots in the South Park Coalition.
              </p>
            </div>
          </section>

          {/* Biography */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-3xl font-display font-bold">Biography</h2>
                  <div className="prose prose-lg prose-invert max-w-none space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Cornelius A. Pratt, professionally known as Mr. CAP, is a Houston-born rapper, writer, and 
                      creative technologist with deep roots in the South Park Coalition. Raised in a musical family 
                      and performing since childhood, CAP's voice carries the weight of lived experience—from street 
                      lessons and spiritual reflections to entrepreneurship and innovation.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      After graduating from Jack Yates Senior High School and studying Computer Network Engineering 
                      and Computer Science, he took his talent beyond the mic into digital distribution, web and 
                      graphic design, and blockchain-based ventures. His debut album, <em>2 Tha Grave</em>, introduced 
                      his signature blend of raw lyricism, storytelling, and Southern grit.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-6 italic text-foreground bg-card/30 py-4 pr-6 rounded-r-lg">
                      "Real hip-hop never dies. It evolves, adapts, and finds new ways to connect with people. 
                      That's what I've been doing for 30+ years."
                    </blockquote>
                    <p className="text-muted-foreground leading-relaxed">
                      Today, with his latest project <em>The Ties That Bind Us</em> and the lead single "Bet'n On Me", 
                      Mr. CAP stands at the intersection of music, media, and technology—bridging old school integrity 
                      with new school innovation while representing Houston, South Park Coalition, and independent 
                      creators worldwide.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      What separates Mr. CAP from a lot of his peers is what he did when he wasn't on stage. He 
                      studied Computer Network Engineering and Computer Science, worked in corporate environments, 
                      and later stepped into digital distribution, web design, blockchain, and AI. That means when 
                      he talks about "owning your masters" or "controlling your data," it's not just rap rhetoric—he 
                      actually understands the systems behind the music.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                    <ul className="space-y-4">
                      {highlights.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <item.icon className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="flux" className="w-full" asChild>
                    <a href="/press-kit.pdf" download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Press Kit
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-20 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-display font-bold mb-12 text-center">Career Timeline</h2>
              
              <div className="max-w-3xl mx-auto">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative pl-8 pb-12 last:pb-0">
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
                      <span className="text-primary font-mono text-sm">{item.year}</span>
                      <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SPC Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-display font-bold mb-6">South Park Coalition Legacy</h2>
                <p className="text-muted-foreground mb-4">
                  As an original member of the legendary South Park Coalition, Mr. CAP carries forward one of the 
                  most respected underground hip-hop movements in Texas. The sound, the message, and the independence 
                  that shaped a generation still live here—just with new tools and new technology.
                </p>
                <p className="text-muted-foreground mb-8">
                  <Link to="/south-park-coalition" className="text-primary hover:underline">Learn more about the South Park Coalition</Link>
                  {" · "}
                  <Link to="/houston-hip-hop-history" className="text-primary hover:underline">Explore Houston hip-hop history</Link>
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="fluxOutline" asChild>
                    <Link to="/music">Explore Music</Link>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <Link to="/blog/south-park-coalition-history-houston-hip-hop">Learn the SPC Story</Link>
                  </Button>
                </div>
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

export default About;

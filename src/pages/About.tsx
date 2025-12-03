import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Music, Mic2, Trophy, Users, Calendar, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const timeline = [
  { year: "1990s", title: "South Park Coalition Origins", desc: "Joined the legendary South Park Coalition as an original member alongside K-Rino, Dope-E, and Klondike Kat" },
  { year: "2005", title: "O.N.E. on O.N.E.", desc: "Released debut solo album, establishing a unique sound blending Houston's underground with conscious lyricism" },
  { year: "2006", title: "Tha Cold Ass Pimp", desc: "Dropped the critically acclaimed mixtape showcasing versatility and street credibility" },
  { year: "2011", title: "2 Tha Grave", desc: "Released sophomore album with deeper introspection and refined production" },
  { year: "2019", title: "The Art of ISM", desc: "Third studio album via Sony Music/The Orchard featuring Zaytoven, Metro Boomin production" },
  { year: "2021", title: "NFT Pioneer", desc: "Became first Houston rapper to sell a Hip Hop NFT, minting 'Limitless' on OpenSea" },
  { year: "2024", title: "The Ties That Bind Us", desc: "Latest album release with lead single 'Bet'n On Me' showcasing evolution of sound" },
];

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mr. CAP",
    "alternateName": "Cornelius A. Pratt",
    "description": "Houston hip-hop artist, South Park Coalition original member, entrepreneur, and blockchain pioneer. Over three decades in the music industry.",
    "image": "https://mrcapmusic.com/og-image.jpg",
    "url": "https://mrcapmusic.com/about",
    "sameAs": [
      "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
      "https://www.youtube.com/@mrcap1",
      "https://opensea.io/mrcap"
    ],
    "jobTitle": "Hip-Hop Artist",
    "memberOf": {
      "@type": "MusicGroup",
      "name": "South Park Coalition"
    },
    "knowsAbout": ["Hip-Hop Music", "Blockchain Technology", "NFTs", "Music Production", "Entrepreneurship"]
  };

  return (
    <>
      <Helmet>
        <title>About Mr. CAP — Houston Hip-Hop Pioneer | South Park Coalition Original Member</title>
        <meta name="description" content="Learn about Mr. CAP (Cornelius A. Pratt), an original member of Houston's legendary South Park Coalition. Three decades of authentic hip-hop, from underground classics to blockchain innovation." />
        <link rel="canonical" href="https://mrcapmusic.com/about" />
        
        <meta property="og:title" content="About Mr. CAP — Houston Hip-Hop Pioneer" />
        <meta property="og:description" content="Original member of South Park Coalition. Three decades of authentic Houston hip-hop." />
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
                Three decades of authentic Houston hip-hop. From South Park Coalition to blockchain pioneer.
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
                      Mr. CAP (Cornelius A. Pratt) is a Houston hip-hop artist and original member of the legendary 
                      South Park Coalition. With over three decades in the music industry, he has been instrumental 
                      in shaping the sound of Houston's underground rap scene while continuously evolving his artistry.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Born and raised in Houston's South Park neighborhood, Mr. CAP emerged from the same streets 
                      that produced some of hip-hop's most influential underground artists. As a founding member 
                      of the South Park Coalition, he helped establish a movement that prioritized lyrical excellence 
                      and authentic storytelling over commercial trends.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-6 italic text-foreground">
                      "Real hip-hop never dies. It evolves, adapts, and finds new ways to connect with people. 
                      That's what I've been doing for 30+ years."
                    </blockquote>
                    <p className="text-muted-foreground leading-relaxed">
                      Beyond music, Mr. CAP has positioned himself at the forefront of music technology innovation. 
                      In 2021, he became the first Houston rap artist to sell a Hip Hop NFT on the blockchain, 
                      minting his song "Limitless" on OpenSea. This pioneering move demonstrated his understanding 
                      of how technology can empower independent artists.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Today, Mr. CAP continues to release new music, perform across Texas and beyond, and mentor 
                      the next generation of artists. His latest album "The Ties That Bind Us" represents the 
                      culmination of his artistic journey while pointing toward the future of independent hip-hop.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">South Park Coalition</p>
                          <p className="text-sm text-muted-foreground">Original Member</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Music className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">4 Studio Albums</p>
                          <p className="text-sm text-muted-foreground">+ Numerous Singles</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Trophy className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">First Houston NFT</p>
                          <p className="text-sm text-muted-foreground">Hip Hop NFT Pioneer</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">30+ Years</p>
                          <p className="text-sm text-muted-foreground">In the Industry</p>
                        </div>
                      </li>
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
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-display font-bold mb-6">South Park Coalition</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                The South Park Coalition is one of Houston's most influential hip-hop collectives, 
                founded in the late 1980s. Mr. CAP has been an integral part of this movement, 
                helping to establish Houston's unique underground sound that influenced countless artists.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="fluxOutline" asChild>
                  <Link to="/music">Explore Music</Link>
                </Button>
                <Button variant="fluxGhost" asChild>
                  <Link to="/live">Live Shows</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;

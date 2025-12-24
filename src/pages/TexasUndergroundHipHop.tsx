import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, MapPin, ChevronRight, Calendar, Mic2, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const TexasUndergroundHipHop = () => {
  const pageTitle = "Texas Underground Hip-Hop | Mr. CAP – Houston Rap Pioneer";
  const metaDescription = "Explore Texas underground hip-hop through Mr. CAP, a Houston rap pioneer and South Park Coalition original. Stream authentic Texas rap, book shows, and discover the underground scene.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Texas Underground Hip-Hop and the Legacy of Mr. CAP",
        "author": {
          "@type": "Person",
          "name": "Mr. CAP"
        },
        "publisher": {
          "@type": "Organization",
          "name": "CAP Distributions"
        },
        "mainEntityOfPage": "https://mrcap1.com/texas-underground-hip-hop",
        "description": "An inside look at Texas underground hip-hop culture and the role Mr. CAP plays in its legacy."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Texas underground hip-hop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Texas underground hip-hop refers to the independent rap scene in Texas, particularly Houston, Dallas, and San Antonio. It includes artists who release music independently, often through their own labels, without major label support. Key figures include South Park Coalition, Swishahouse, and Screwed Up Click."
            }
          },
          {
            "@type": "Question",
            "name": "Who are the pioneers of Houston underground hip-hop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pioneers of Houston underground hip-hop include DJ Screw (chopped and screwed music), K-Rino and the South Park Coalition (independent rap collective), Scarface and the Geto Boys (bringing Houston to mainstream), and artists like Mr. CAP, Z-Ro, and Trae tha Truth who built careers independently."
            }
          },
          {
            "@type": "Question",
            "name": "How is Texas underground hip-hop different from mainstream rap?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Texas underground hip-hop is characterized by independence (artists own their masters), lyrical focus (complex wordplay and storytelling), regional pride (Houston, Dallas, San Antonio identity), and longevity (careers spanning decades vs. one-hit wonders). Artists like Mr. CAP have been active for 30+ years."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Texas Underground Hip-Hop", "item": "https://mrcap1.com/texas-underground-hip-hop" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Texas underground hip hop, Houston rap, underground rap Texas, independent hip hop, South Park Coalition, Mr CAP, Texas rapper, Houston underground, Southern rap, Texas music" />
        <link rel="canonical" href="https://mrcap1.com/texas-underground-hip-hop" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/texas-underground-hip-hop" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
            
            <div className="relative z-10 container mx-auto px-4 py-24 text-center">
              <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Texas Underground Hip-Hop</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">
                  Texas Underground
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-foreground">
                  Hip-Hop · Independent · Authentic
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover Texas underground hip-hop through Mr. CAP, a Houston pioneer and South Park 
                Coalition original member. Real music, independent spirit, 30+ years of authenticity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Stream Underground
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/cities">
                    <MapPin className="mr-2 h-5 w-5" />
                    Texas Cities
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* What is Texas Underground Section */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  What is Texas Underground Hip-Hop?
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <strong>Texas underground hip-hop</strong> refers to the independent rap scene in Texas, 
                    particularly <strong>Houston, Dallas, and San Antonio</strong>. It includes artists who 
                    release music independently, often through their own labels, without major label support.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The Texas underground scene is characterized by <strong>lyrical depth, regional pride, 
                    and business independence</strong>. Artists like Mr. CAP and the South Park Coalition 
                    have built careers spanning decades by owning their masters, controlling their distribution, 
                    and staying connected to their communities.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Unlike mainstream rap that often chases trends, Texas underground hip-hop values 
                    <strong>authenticity, storytelling, and longevity</strong>. Many underground artists 
                    have been active for 20-30+ years, building loyal fanbases through consistent quality 
                    rather than viral moments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Characteristics */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                  What Makes Texas Underground Different
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Independence</h3>
                    <p className="text-muted-foreground text-sm">
                      Artists own their masters and control their distribution. No major label middlemen.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Mic2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Lyrical Focus</h3>
                    <p className="text-muted-foreground text-sm">
                      Complex wordplay, storytelling, and substance over style. Every bar matters.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Regional Pride</h3>
                    <p className="text-muted-foreground text-sm">
                      Houston, Dallas, San Antonio identity. Rep your city, stay connected to the streets.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Longevity</h3>
                    <p className="text-muted-foreground text-sm">
                      Careers spanning 20-30+ years. Building legacy over chasing trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mr. CAP Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Mr. CAP: Texas Underground Pioneer
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <strong>Mr. CAP</strong> represents the essence of Texas underground hip-hop. As an 
                    original member of the <Link to="/south-park-coalition-houston" className="text-primary hover:underline">South Park Coalition</Link> since 
                    1992, he has spent over 30 years building his career independently.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Through his company <strong>CAP Distributions</strong>, Mr. CAP controls his entire 
                    catalog and helps other independent artists navigate the music industry. His latest 
                    album <em>The Ties That Bind Us</em> (2024) continues the Texas underground tradition 
                    of quality over quantity.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Beyond music, Mr. CAP has embraced technology to expand the underground. In 2021, he 
                    became the <strong>first Houston rapper to sell a Hip Hop NFT</strong>, bridging street 
                    authenticity with digital innovation.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="flux" asChild>
                    <Link to="/houston-rapper-mr-cap">About Mr. CAP</Link>
                  </Button>
                  <Button variant="fluxOutline" asChild>
                    <Link to="/music">Stream Music</Link>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <Link to="/live">Book a Show</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Who are the pioneers of Houston underground hip-hop?</h3>
                    <p className="text-muted-foreground">
                      Pioneers include DJ Screw (chopped and screwed music), K-Rino and the South Park 
                      Coalition (independent rap collective since 1987), Scarface and the Geto Boys 
                      (bringing Houston to mainstream), and artists like Mr. CAP, Z-Ro, and Trae tha Truth 
                      who built careers independently.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">What is chopped and screwed music?</h3>
                    <p className="text-muted-foreground">
                      Chopped and screwed is a DJ technique invented by DJ Screw in Houston in the early 
                      1990s. It involves slowing down the tempo and applying various effects. The style 
                      became synonymous with Houston hip-hop culture and influenced artists worldwide.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">How do I discover Texas underground hip-hop?</h3>
                    <p className="text-muted-foreground">
                      Start with established names like South Park Coalition, then explore their 
                      collaborators. Stream Mr. CAP's catalog on Spotify and Apple Music. Check out local 
                      Houston hip-hop blogs and attend shows in Texas cities to connect with the scene.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cities CTA */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Experience Texas Underground Live
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Mr. CAP brings Texas underground hip-hop to stages across the state. Book a show 
                in your city or explore upcoming performances.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/live">Book a Show</Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/cities">Texas Cities</Link>
                </Button>
                <Button variant="fluxGhost" size="lg" asChild>
                  <Link to="/music">Stream Music</Link>
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

export default TexasUndergroundHipHop;

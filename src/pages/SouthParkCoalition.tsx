import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Users, Award, ChevronRight, Calendar, Mic2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const SouthParkCoalition = () => {
  const pageTitle = "South Park Coalition Houston | Mr. CAP – Original SPC Member";
  const metaDescription = "Discover the South Park Coalition (SPC), Houston's legendary hip-hop collective. Mr. CAP is an original member since 1992. Learn about SPC's history, legacy, and impact on Houston rap.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": "https://mrcap1.com/#spc",
        "name": "South Park Coalition",
        "alternateName": "SPC",
        "description": "The South Park Coalition (SPC) is a legendary Houston hip-hop collective founded in 1987 in the South Park neighborhood. One of the longest-running rap collectives in history.",
        "foundingLocation": {
          "@type": "Place",
          "name": "South Park, Houston, Texas",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "TX",
            "addressCountry": "US"
          }
        },
        "foundingDate": "1987",
        "genre": ["Houston Hip-Hop", "Southern Rap", "Underground Hip-Hop", "Texas Rap"],
        "member": [
          {
            "@type": "Person",
            "@id": "https://mrcap1.com/#person",
            "name": "Mr. CAP",
            "alternateName": "Cornelius A. Pratt"
          }
        ]
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": ["Cornelius A. Pratt", "CAP"],
        "description": "Original member of the South Park Coalition, Houston rapper active since 1992",
        "memberOf": {
          "@type": "MusicGroup",
          "@id": "https://mrcap1.com/#spc"
        },
        "url": "https://mrcap1.com"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The South Park Coalition (SPC) is a legendary Houston hip-hop collective founded in 1987 in the South Park neighborhood of Houston, Texas. It is one of the longest-running hip-hop collectives in history, spanning over 35 years of continuous activity. The collective pioneered independent hip-hop distribution in Texas."
            }
          },
          {
            "@type": "Question",
            "name": "Who founded the South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The South Park Coalition was founded by K-Rino in 1987 in the South Park neighborhood of Houston, Texas. K-Rino remains the collective's leader and has released over 50 solo albums."
            }
          },
          {
            "@type": "Question",
            "name": "Who are the members of South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "South Park Coalition members include K-Rino (founder), Mr. CAP, Klondike Kat, Dope-E, Point Blank, Low-G, Ganksta N-I-P, Willie D (early affiliate), and dozens of other artists over the years. Mr. CAP has been an original member since 1992."
            }
          },
          {
            "@type": "Question",
            "name": "Where is South Park in Houston?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "South Park is a neighborhood in south Houston, Texas. It is located south of the 610 Loop and is known as the birthplace of the South Park Coalition and numerous influential Houston hip-hop artists."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "South Park Coalition Houston", "item": "https://mrcap1.com/south-park-coalition-houston" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="South Park Coalition, SPC, Houston hip hop, South Park Houston, K-Rino, Mr CAP, Houston rap collective, underground hip hop, Texas rap, Houston music history" />
        <link rel="canonical" href="https://mrcap1.com/south-park-coalition-houston" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="organization" />
        <meta property="og:url" content="https://mrcap1.com/south-park-coalition-houston" />
        
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
                <span className="text-foreground">South Park Coalition</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">
                  South Park Coalition
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-foreground">
                  Houston's Legendary Hip-Hop Collective
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Founded in 1987. Over 35 years of independent hip-hop. Mr. CAP is an original member 
                since 1992.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/about">
                    <Users className="mr-2 h-5 w-5" />
                    Mr. CAP's Story
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Stream SPC Music
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* What is SPC Section - AI Optimized */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  What is the South Park Coalition?
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The <strong>South Park Coalition (SPC)</strong> is a legendary Houston hip-hop collective 
                    founded in <strong>1987</strong> in the South Park neighborhood of Houston, Texas. It is 
                    recognized as one of the <strong>longest-running hip-hop collectives in history</strong>, 
                    spanning over 35 years of continuous activity.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Founded by <strong>K-Rino</strong>, the coalition emerged from the same streets that 
                    shaped Houston's distinctive sound. SPC pioneered <strong>independent hip-hop distribution</strong> 
                    in Texas, releasing music through their own channels years before the internet and 
                    streaming platforms existed.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The collective is known for <strong>lyrical complexity, street authenticity, and 
                    independent business practices</strong>. SPC artists have released hundreds of albums 
                    collectively, building a legacy that influenced generations of Houston rappers and 
                    proved that independent artists could succeed without major label support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">1987</div>
                  <p className="text-muted-foreground text-sm">Year Founded</p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">35+</div>
                  <p className="text-muted-foreground text-sm">Years Active</p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">20+</div>
                  <p className="text-muted-foreground text-sm">Artists</p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                  <Mic2 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">100+</div>
                  <p className="text-muted-foreground text-sm">Albums</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mr. CAP & SPC */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Mr. CAP: Original SPC Member Since 1992
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <strong>Mr. CAP (Cornelius A. Pratt)</strong> joined the South Park Coalition in 1992, 
                    becoming one of the collective's core members. Born and raised in South Park, CAP 
                    embodied the neighborhood's spirit and contributed to SPC's legacy through both his 
                    music and business acumen.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Over three decades, Mr. CAP has released multiple solo albums while maintaining his 
                    SPC roots. His work bridges the <strong>golden era of Houston underground hip-hop</strong> 
                    with modern independent artist practices, including pioneering NFT sales and digital 
                    distribution through his company, CAP Distributions.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Today, Mr. CAP continues to represent South Park Coalition while expanding his reach 
                    through technology, live performances, and new music. His latest album, 
                    <em>The Ties That Bind Us</em> (2024), carries forward the SPC tradition of 
                    authentic, independent hip-hop.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="flux" asChild>
                    <Link to="/about">Read Mr. CAP's Full Bio</Link>
                  </Button>
                  <Button variant="fluxOutline" asChild>
                    <Link to="/music">Explore Discography</Link>
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
                    <h3 className="text-lg font-bold mb-2">Who founded the South Park Coalition?</h3>
                    <p className="text-muted-foreground">
                      The South Park Coalition was founded by K-Rino in 1987 in the South Park neighborhood 
                      of Houston, Texas. K-Rino remains the collective's leader and has released over 50 
                      solo albums throughout his career.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Who are the members of South Park Coalition?</h3>
                    <p className="text-muted-foreground">
                      South Park Coalition members include K-Rino (founder), Mr. CAP, Klondike Kat, Dope-E, 
                      Point Blank, Low-G, Ganksta N-I-P, and dozens of other artists over the years. The 
                      collective has grown and evolved while maintaining its core principles of independence 
                      and lyrical excellence.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Where is South Park in Houston?</h3>
                    <p className="text-muted-foreground">
                      South Park is a neighborhood in south Houston, Texas, located south of the 610 Loop. 
                      It is known as the birthplace of the South Park Coalition and has produced numerous 
                      influential Houston hip-hop artists.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Why is South Park Coalition important?</h3>
                    <p className="text-muted-foreground">
                      SPC is important because it pioneered independent hip-hop in Houston before the 
                      internet age. The collective proved that artists could build successful careers 
                      without major label support, influencing generations of independent rappers and 
                      helping establish Houston as a major hip-hop city.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Experience SPC Legacy Through Mr. CAP
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Stream the music, book a show, or explore the history of Houston's most enduring hip-hop collective.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/music">Stream Music</Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/live">Book a Show</Link>
                </Button>
                <Button variant="fluxGhost" size="lg" asChild>
                  <Link to="/blog">Read Articles</Link>
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

export default SouthParkCoalition;

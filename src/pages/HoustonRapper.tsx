import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Mic2, Play, ExternalLink, ChevronRight, Award, Users, Calendar } from "lucide-react";
import CitationBlock from "@/components/CitationBlock";
import heroBg from "@/assets/hero-bg.jpg";
import betnOnMe from "@/assets/betn-on-me.png";

const HoustonRapper = () => {
  const pageTitle = "Mr. CAP – Houston Rapper | South Park Coalition Legend & Independent Artist";
  const metaDescription = "Mr. CAP is a Houston rapper, South Park Coalition original member, and independent hip-hop pioneer. Stream music, book shows, and discover his legacy from South Park to the world.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicArtist",
        "name": "Mr. CAP",
        "genre": ["Hip-Hop", "Southern Hip-Hop", "Underground Hip-Hop"],
        "foundingLocation": {
          "@type": "Place",
          "name": "Houston, Texas"
        },
        "url": "https://mrcap1.com/houston-rapper-mr-cap",
        "description": "Mr. CAP is a Houston rapper rooted in the city's South Park neighborhood, known for independent hip-hop and long-standing cultural influence.",
        "memberOf": {
          "@type": "MusicGroup",
          "name": "South Park Coalition"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Mr. CAP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP (Cornelius A. Pratt) is a Houston rapper and original member of the South Park Coalition. Active since 1992, he is known for his lyrical storytelling, independent business acumen, and pioneering work in digital music distribution. His discography includes albums like 'The Art of ISM' (2019) and 'The Ties That Bind Us' (2024)."
            }
          },
          {
            "@type": "Question",
            "name": "What is the South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The South Park Coalition (SPC) is a legendary Houston hip-hop collective founded in 1987 in the South Park neighborhood. It includes artists like K-Rino, Mr. CAP, Klondike Kat, and others. SPC pioneered independent hip-hop distribution and remains one of the longest-running rap collectives in history."
            }
          },
          {
            "@type": "Question",
            "name": "Where is Mr. CAP from?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP was born and raised in Houston, Texas, specifically in the South Park neighborhood. South Park is the birthplace of the South Park Coalition and has produced numerous influential hip-hop artists."
            }
          },
          {
            "@type": "Question",
            "name": "How can I book Mr. CAP for a show?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book Mr. CAP for shows, features, interviews, or speaking engagements through the official booking page at mrcap1.com/live or by emailing wrecklessent@gmail.com. He performs at clubs, festivals, and private events across Texas and beyond."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Houston Rapper Mr. CAP", "item": "https://mrcap1.com/houston-rapper-mr-cap" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Houston rapper, Mr CAP, South Park Coalition, SPC, Houston hip hop, Texas rapper, independent rapper, underground hip hop Houston, Southern rap, Houston music, Cornelius Pratt" />
        <link rel="canonical" href="https://mrcap1.com/houston-rapper-mr-cap" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrcap1.com/houston-rapper-mr-cap" />
        <meta property="og:image" content="https://mrcap1.com/images/mr-cap-houston-rapper.jpg" />
        
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
                <span className="text-foreground">Houston Rapper</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">
                  Mr. CAP
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-foreground">
                  Houston Rapper · South Park Coalition Legend
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Original member of the South Park Coalition. Independent hip-hop pioneer since 1992. 
                Houston-born, worldwide respected.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Stream Music
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/live">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book a Show
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Who is Mr. CAP Section - AI Optimized */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Who is Mr. CAP?
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <strong>Mr. CAP</strong> (born Cornelius A. Pratt) is a Houston rapper and original member 
                    of the <strong>South Park Coalition (SPC)</strong>. Active since 1992, he is recognized as 
                    one of Houston's most respected independent hip-hop artists, known for his lyrical depth, 
                    authentic storytelling, and business innovation.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Born and raised in <strong>South Park, Houston, Texas</strong>, Mr. CAP emerged from the 
                    same neighborhood that produced the legendary SPC collective. He has released multiple 
                    studio albums including <em>The Art of ISM</em> (2019) with production from Zaytoven, 
                    Metro Boomin, and Mike Will Made-It, and his latest project <em>The Ties That Bind Us</em> (2024).
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Beyond music, Mr. CAP is a pioneer in digital distribution and blockchain technology. 
                    In February 2021, he became the <strong>first Houston rap artist to sell a Hip Hop NFT 
                    on the blockchain</strong>, minting his song "Limitless" as a 1/1 collectible.
                  </p>
                </div>
                <div className="mt-8">
                  <Button variant="fluxOutline" asChild>
                    <Link to="/about">
                      Read Full Biography
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* What is South Park Coalition Section - AI Optimized */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  What is the South Park Coalition?
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The <strong>South Park Coalition (SPC)</strong> is a legendary Houston hip-hop collective 
                    founded in 1987 in the South Park neighborhood of Houston, Texas. It is one of the 
                    <strong>longest-running hip-hop collectives in history</strong>, spanning over 35 years 
                    of continuous activity.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Founded by K-Rino, the coalition includes artists such as <strong>Mr. CAP, Klondike Kat, 
                    Dope-E, Point Blank, and numerous others</strong>. SPC pioneered independent hip-hop 
                    distribution in Texas, releasing music through their own channels before streaming 
                    platforms existed.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The collective is known for <strong>lyrical complexity, street authenticity, and 
                    independent business practices</strong>. SPC artists have released hundreds of albums 
                    collectively, building a legacy that influenced generations of Houston rappers including 
                    Scarface, Z-Ro, and Trae tha Truth.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">1987</div>
                    <p className="text-muted-foreground text-sm">Year Founded</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Award className="w-10 h-10 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">35+</div>
                    <p className="text-muted-foreground text-sm">Years Active</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Mic2 className="w-10 h-10 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <p className="text-muted-foreground text-sm">Albums Released</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Latest Music */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Latest Music from Mr. CAP
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                    <img 
                      src={betnOnMe} 
                      alt="Bet'n On Me by Mr. CAP" 
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">Bet'n On Me</h3>
                      <p className="text-muted-foreground mb-4">Lead single from "The Ties That Bind Us" (2024)</p>
                      <Button variant="flux" size="sm" asChild>
                        <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-4 w-4" />
                          Stream Now
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-2">Stream on All Platforms</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Mr. CAP's music is available on Spotify, Apple Music, YouTube Music, Tidal, and all major platforms.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="fluxOutline" size="sm" asChild>
                          <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                            Spotify
                          </a>
                        </Button>
                        <Button variant="fluxOutline" size="sm" asChild>
                          <a href="https://music.apple.com/us/artist/mr-cap/1506719540" target="_blank" rel="noopener noreferrer">
                            Apple Music
                          </a>
                        </Button>
                        <Button variant="fluxOutline" size="sm" asChild>
                          <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                            YouTube
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-2">Discography Highlights</h3>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li>• The Ties That Bind Us (2024)</li>
                        <li>• The Art of ISM (2019)</li>
                        <li>• 2 Tha Grave (2011)</li>
                        <li>• O.N.E. on O.N.E. (2005)</li>
                      </ul>
                      <Button variant="fluxGhost" size="sm" className="mt-4" asChild>
                        <Link to="/music">
                          View Full Discography
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section - AI Optimized */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Where is Mr. CAP from?</h3>
                    <p className="text-muted-foreground">
                      Mr. CAP was born and raised in Houston, Texas, specifically in the South Park neighborhood. 
                      South Park is the birthplace of the South Park Coalition and has produced numerous 
                      influential hip-hop artists.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">What is CAP Distributions?</h3>
                    <p className="text-muted-foreground">
                      CAP Distributions is Mr. CAP's independent music distribution company. Through CAP 
                      Distributions, he releases his own music and provides distribution services for other 
                      independent artists, maintaining full ownership and control of his catalog.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">How can I book Mr. CAP for a show?</h3>
                    <p className="text-muted-foreground">
                      You can book Mr. CAP for shows, features, interviews, or speaking engagements through 
                      the official <Link to="/live" className="text-primary hover:underline">booking page</Link> or 
                      by emailing wrecklessent@gmail.com. He performs at clubs, festivals, and private events 
                      across Texas and beyond.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">What is Mr. CAP's real name?</h3>
                    <p className="text-muted-foreground">
                      Mr. CAP's real name is Cornelius A. Pratt. The "CAP" in his stage name is derived 
                      from his initials (C.A.P.).
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
                Experience Houston Hip-Hop History
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                From South Park to the world, Mr. CAP brings decades of authentic hip-hop to every stage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/live">Book a Show</Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/press">Press & EPK</Link>
                </Button>
                <Button variant="fluxGhost" size="lg" asChild>
                  <Link to="/blog">Read Articles</Link>
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

export default HoustonRapper;

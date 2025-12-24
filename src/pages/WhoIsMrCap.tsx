import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Mic2, Play, ExternalLink, ChevronRight, Award, Users, Calendar, Disc3, Building2, Zap, Globe } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import betnOnMe from "@/assets/betn-on-me.png";
import albumTies from "@/assets/album-ties.jpg";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import nftLimitless from "@/assets/nft-limitless.png";

const WhoIsMrCap = () => {
  const pageTitle = "Who Is Mr. CAP? | Houston Rapper, SPC Legend & Blockchain Pioneer";
  const metaDescription = "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and tech innovator. Learn about his 30+ year career, discography, NFT milestones, and how to book him.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": ["Cornelius A. Pratt", "CAP", "Mr CAP", "MrCAP"],
        "description": "Houston-born rapper, South Park Coalition original member, and creative technologist bridging hip-hop, business, and blockchain since 1992.",
        "birthPlace": {
          "@type": "Place",
          "name": "Houston, Texas",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "TX",
            "addressCountry": "US"
          }
        },
        "jobTitle": ["Hip-Hop Artist", "Entrepreneur", "Creative Technologist"],
        "genre": ["Hip-Hop", "Southern Rap", "Underground Hip-Hop", "Houston Rap"],
        "knowsAbout": ["Hip-Hop Music", "Blockchain Technology", "NFTs", "South Park Coalition", "Music Production", "Digital Distribution"],
        "memberOf": {
          "@type": "MusicGroup",
          "name": "South Park Coalition",
          "foundingLocation": "Houston, Texas",
          "foundingDate": "1987"
        },
        "award": [
          "First Houston Rapper to Sell a Hip-Hop NFT (2021)",
          "South Park Coalition Original Member",
          "Featured in 'The Life' Documentary"
        ],
        "sameAs": [
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.instagram.com/mrcapism/",
          "https://twitter.com/mrcap1",
          "https://www.youtube.com/@mrcap1",
          "https://music.apple.com/us/artist/mr-cap/1506719540",
          "https://opensea.io/mrcap"
        ],
        "url": "https://mrcap1.com"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Mr. CAP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and creative technologist. Active since 1992, he's known for his lyrical depth, independent business model, and pioneering work in music NFTs. He became the first Houston rapper to sell a Hip-Hop NFT in 2021."
            }
          },
          {
            "@type": "Question",
            "name": "What is Mr. CAP's real name?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP's real name is Cornelius A. Pratt. CAP is an acronym that represents his artistic philosophy and approach to music and business."
            }
          },
          {
            "@type": "Question",
            "name": "Is Mr. CAP part of South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Mr. CAP is an original member of the South Park Coalition (SPC), the legendary Houston hip-hop collective founded in 1987. He has collaborated with fellow SPC members including K-Rino, Klondike Kat, and Point Blank throughout his career."
            }
          },
          {
            "@type": "Question",
            "name": "What albums has Mr. CAP released?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP's discography includes 'The Ties That Bind Us' (2024, SPC group album), 'The Art of ISM' (2019, featuring production from Zaytoven and Metro Boomin), '2 Tha Grave' (2011), and 'O.N.E. on O.N.E.' (2005), along with numerous singles and collaborations."
            }
          },
          {
            "@type": "Question",
            "name": "How can I book Mr. CAP for a show?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book Mr. CAP for concerts, festivals, features, or speaking engagements through the official booking page at mrcap1.com/live or by contacting wrecklessent@gmail.com. He performs across Texas and nationally."
            }
          },
          {
            "@type": "Question",
            "name": "What was Mr. CAP's NFT milestone?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "On February 25, 2021, Mr. CAP became the first Houston rapper to sell a Hip-Hop NFT on the blockchain. He minted his song 'Limitless' featuring K-Rino as a one-of-one collectible on OpenSea, pioneering a new model for independent music ownership."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Who Is Mr. CAP", "item": "https://mrcap1.com/who-is-mr-cap" }
        ]
      }
    ]
  };

  const milestones = [
    { year: "1992", title: "Career Begins", description: "Started rapping in Houston's South Park neighborhood" },
    { year: "2005", title: "O.N.E. on O.N.E.", description: "Released debut solo album establishing his lyrical style" },
    { year: "2011", title: "2 Tha Grave", description: "Follow-up album showcasing growth and Southern grit" },
    { year: "2019", title: "The Art of ISM", description: "Major release via Sony Music / The Orchard with A-list producers" },
    { year: "2021", title: "NFT Pioneer", description: "First Houston rapper to sell a Hip-Hop NFT (Limitless)" },
    { year: "2024", title: "The Ties That Bind Us", description: "South Park Coalition group album with 19 tracks" },
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="who is mr cap, mr cap rapper, mr cap houston, cornelius pratt, south park coalition member, houston hip hop artist, mr cap music, mr cap nft, texas rapper mr cap" />
        <link rel="canonical" href="https://mrcap1.com/who-is-mr-cap" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrcap1.com/who-is-mr-cap" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg" />
        
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
          <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
            
            <div className="relative z-10 container mx-auto px-4 py-24 text-center">
              <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Who Is Mr. CAP</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                <span className="text-foreground">Who Is</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">
                  Mr. CAP?
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
                <strong>Mr. CAP</strong> (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and blockchain pioneer who has been shaping independent hip-hop for over 30 years.
              </p>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                From South Park streets to streaming platforms worldwide—he's an artist, entrepreneur, and innovator who never stopped betting on himself.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Stream His Music
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/live">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Mr. CAP
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="py-12 border-y border-border/50 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">30+</div>
                  <p className="text-sm text-muted-foreground">Years Active</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">6+</div>
                  <p className="text-sm text-muted-foreground">Albums Released</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">1st</div>
                  <p className="text-sm text-muted-foreground">Houston Hip-Hop NFT</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">SPC</div>
                  <p className="text-sm text-muted-foreground">Original Member</p>
                </div>
              </div>
            </div>
          </section>

          {/* The Answer - AI Optimized */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Mr. CAP: The Complete Story
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <strong>Mr. CAP</strong>, born <strong>Cornelius A. Pratt</strong>, is a Houston, Texas-based rapper and 
                    original member of the <strong>South Park Coalition (SPC)</strong>—one of the longest-running hip-hop 
                    collectives in history. Since 1992, he has released multiple studio albums, pioneered independent music 
                    distribution, and became a trailblazer in blockchain-based music ownership.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Growing up in Houston's <strong>South Park neighborhood</strong>, Mr. CAP developed his craft alongside 
                    legends like K-Rino, Klondike Kat, and Point Blank. His music is characterized by <strong>lyrical depth, 
                    authentic storytelling, and Southern-fried production</strong>—blending street narratives with conscious 
                    themes and business acumen.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    In 2019, he released <em>The Art of ISM</em> through <strong>Sony Music / The Orchard</strong>, featuring 
                    production from Zaytoven, Metro Boomin, and Mike Will Made-It. The album showcased his ability to work 
                    with A-list producers while maintaining his independent spirit.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    On <strong>February 25, 2021</strong>, Mr. CAP made history as the <strong>first Houston rapper to sell 
                    a Hip-Hop NFT on the blockchain</strong>. He minted his song "Limitless" featuring K-Rino as a 1/1 
                    collectible on OpenSea, pioneering a new model for artist ownership and fan engagement.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    His latest project, <em>The Ties That Bind Us</em> (2024), is a South Park Coalition group album 
                    featuring 19 tracks with the lead single "Bet'n On Me"—an anthem for hustlers betting on themselves.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Career Timeline */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                  Career Timeline
                </h2>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={index}
                      className="flex gap-6 items-start bg-card/50 border border-border/50 rounded-xl p-6"
                    >
                      <div className="flex-shrink-0 w-20 text-center">
                        <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What Makes Mr. CAP Different */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                  What Makes Mr. CAP Different
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">SPC Original</h3>
                    <p className="text-sm text-muted-foreground">
                      Original member of the South Park Coalition since the early days
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Business Mind</h3>
                    <p className="text-sm text-muted-foreground">
                      Founder of CAP Distributions & Wreckless Entertainment
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">NFT Pioneer</h3>
                    <p className="text-sm text-muted-foreground">
                      First Houston rapper to sell a Hip-Hop NFT (2021)
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Global Reach</h3>
                    <p className="text-sm text-muted-foreground">
                      Music distributed worldwide via Sony Music / The Orchard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Discography Preview */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Discography Highlights
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <div className="relative">
                      <img src={albumTies} alt="The Ties That Bind Us" className="w-full aspect-square object-cover" />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">The Ties That Bind Us</h3>
                      <p className="text-sm text-muted-foreground">2024 • SPC Album • 19 Tracks</p>
                    </div>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <img src={albumArtOfIsm} alt="The Art of ISM" className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold">The Art of ISM</h3>
                      <p className="text-sm text-muted-foreground">2019 • Sony Music • 11 Tracks</p>
                    </div>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <img src={nftLimitless} alt="Limitless NFT" className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold">Limitless (NFT)</h3>
                      <p className="text-sm text-muted-foreground">2021 • First Houston Hip-Hop NFT</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Button variant="flux" asChild>
                    <Link to="/music">
                      <Disc3 className="mr-2 h-4 w-4" />
                      View Full Discography
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2">Who is Mr. CAP?</h3>
                    <p className="text-muted-foreground">
                      Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, 
                      and creative technologist. Active since 1992, he's known for his lyrical depth, independent 
                      business model, and pioneering work in music NFTs.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2">What is Mr. CAP's real name?</h3>
                    <p className="text-muted-foreground">
                      Mr. CAP's real name is Cornelius A. Pratt. CAP represents his artistic philosophy and 
                      approach to music and business.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2">Is Mr. CAP part of South Park Coalition?</h3>
                    <p className="text-muted-foreground">
                      Yes, Mr. CAP is an original member of the South Park Coalition (SPC), the legendary Houston 
                      hip-hop collective founded in 1987. He has collaborated with fellow SPC members including 
                      K-Rino, Klondike Kat, and Point Blank.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2">What was Mr. CAP's NFT milestone?</h3>
                    <p className="text-muted-foreground">
                      On February 25, 2021, Mr. CAP became the first Houston rapper to sell a Hip-Hop NFT. He 
                      minted his song "Limitless" featuring K-Rino as a 1/1 collectible on OpenSea.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2">How can I book Mr. CAP for a show?</h3>
                    <p className="text-muted-foreground">
                      Contact <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">wrecklessent@gmail.com</a> for 
                      booking inquiries. Mr. CAP is available for concerts, festivals, speaking engagements, and 
                      special events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-b from-card/30 to-background border-t border-border/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Experience the Music?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Stream Mr. CAP's catalog, book him for your next event, or explore his NFT collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-5 w-5" />
                    Stream on Spotify
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/live">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book a Show
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/nft">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View NFT Collection
                  </Link>
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

export default WhoIsMrCap;

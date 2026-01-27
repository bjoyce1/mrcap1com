import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Play, ExternalLink, ChevronRight, Calendar, Disc3, Building2, Zap, Globe, Film, Users, Award } from "lucide-react";
import CitationBlock from "@/components/CitationBlock";
import heroBg from "@/assets/hero-bg.jpg";
import albumTies from "@/assets/album-ties.jpg";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import nftLimitless from "@/assets/nft-limitless.png";
import theLifeDocumentary from "@/assets/the-life-documentary.png";

const WhoIsMrCap = () => {
  const pageTitle = "Who Is Mr. CAP? | Houston Rapper, SPC Legend & Entrepreneur";
  const metaDescription = "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, entrepreneur, and cultural architect. Learn about his South Park Coalition legacy, music career, business ventures, and how to book him.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": "Cornelius A. Pratt",
        "url": "https://mrcap1.com/who-is-mr-cap",
        "birthPlace": {
          "@type": "Place",
          "name": "Houston, Texas, USA"
        },
        "jobTitle": ["Rapper", "Entrepreneur"],
        "description": "Mr. CAP is a Houston-based rapper and entrepreneur, and a long-time member of the South Park Coalition, known for independent hip-hop, cultural impact, and digital music innovation.",
        "affiliation": [
          {
            "@type": "MusicGroup",
            "name": "South Park Coalition"
          }
        ],
        "owns": {
          "@type": "Organization",
          "name": "CAP Distributions"
        },
        "sameAs": [
          "https://www.mrcap1.com",
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.instagram.com/mrcapism/",
          "https://twitter.com/mrcap1",
          "https://www.youtube.com/@mrcap1",
          "https://music.apple.com/us/artist/mr-cap/1506719540",
          "https://opensea.io/mrcap"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Mr. CAP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, entrepreneur, and cultural architect best known as a long-time member of the legendary South Park Coalition (SPC). With roots in Houston's South Park neighborhood and a career spanning decades, he represents the rare combination of street credibility, artistic longevity, and business innovation."
            }
          },
          {
            "@type": "Question",
            "name": "What is Mr. CAP's real name?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP's real name is Cornelius A. Pratt. He was born and raised in Houston's South Park neighborhood."
            }
          },
          {
            "@type": "Question",
            "name": "Is Mr. CAP part of South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Mr. CAP is a respected long-time member of the South Park Coalition (SPC), one of Houston's most influential independent hip-hop collectives. SPC's DIY approach set a blueprint that later generations would follow."
            }
          },
          {
            "@type": "Question",
            "name": "What is CAP Distributions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CAP Distributions is a digital distribution company founded by Mr. CAP to help independent artists release music globally without sacrificing ownership. It represents his expansion into business beyond music."
            }
          },
          {
            "@type": "Question",
            "name": "How can I book Mr. CAP for a show?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book Mr. CAP for concerts, festivals, features, or speaking engagements through the official booking page at mrcap1.com/live or by contacting wrecklessent@gmail.com."
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

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="who is mr cap, mr cap rapper, mr cap houston, cornelius pratt, south park coalition member, houston hip hop artist, mr cap music, mr cap nft, texas rapper mr cap, cap distributions" />
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
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-8">
                Who Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">Mr. CAP</span>?
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                  <strong className="text-foreground">Mr. CAP</strong> (Cornelius A. Pratt) is a Houston-born rapper, entrepreneur, 
                  and cultural architect best known as a long-time member of the legendary <strong className="text-foreground">South Park Coalition (SPC)</strong>. 
                  With roots in Houston's South Park neighborhood and a career spanning decades, Mr. CAP represents 
                  the rare combination of street credibility, artistic longevity, and business innovation.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Listen to Music
                  </Link>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/press">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Press & OPK
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

          {/* Houston Roots & Early Influence */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Houston Roots & Early Influence
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Raised in Houston's historic <strong>South Park area</strong>, Mr. CAP was immersed in music from childhood. 
                    His parents were musicians, and he began performing at a young age, opening shows and developing his craft 
                    well before most artists find their voice.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    These early experiences shaped a style grounded in <strong>realism, discipline, and authenticity</strong>. 
                    The streets of South Park provided the backdrop for narratives that would define his music—stories of 
                    struggle, survival, and the relentless pursuit of independence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* South Park Coalition Legacy */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  South Park Coalition Legacy
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Mr. CAP is a respected member of the <strong>South Park Coalition</strong>, one of Houston's most influential 
                    independent hip-hop collectives. SPC's DIY approach—selling music directly, owning masters, and bypassing 
                    industry gatekeepers—set a blueprint that later generations would follow.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    As part of SPC, Mr. CAP contributed to a movement that emphasized:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Independence Over Major Labels</h3>
                    <p className="text-sm text-muted-foreground">
                      Owning your masters and controlling your destiny
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Award className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Longevity Over Hype</h3>
                    <p className="text-sm text-muted-foreground">
                      Building a sustainable career, not chasing trends
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center">
                    <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Community Over Industry Politics</h3>
                    <p className="text-sm text-muted-foreground">
                      Supporting fellow artists and the local scene
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mt-10">
                  This legacy continues to influence underground hip-hop culture nationally. The SPC model proved that 
                  artists could build lasting careers without compromising their vision or ownership.
                </p>
                
                <div className="mt-8">
                  <Button variant="fluxOutline" asChild>
                    <Link to="/south-park-coalition-houston">
                      Learn More About SPC
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Music Career & Key Releases */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Music Career & Key Releases
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6 mb-12">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Mr. CAP released his debut album <em>2 Tha Grave</em> on April 5, 2011, featuring collaborations with 
                    notable Houston artists. His catalog blends Southern hip-hop, street narratives, and introspective commentary.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Recent work includes:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <div className="relative">
                      <img src={albumTies} alt="The Ties That Bind Us" className="w-full aspect-square object-cover" />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        2024
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">The Ties That Bind Us</h3>
                      <p className="text-sm text-muted-foreground">SPC group album featuring "Bet'n On Me"</p>
                    </div>
                  </div>
                  
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <img src={albumArtOfIsm} alt="The Art of ISM" className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold">The Art of ISM</h3>
                      <p className="text-sm text-muted-foreground">2019 • Sony Music / The Orchard</p>
                    </div>
                  </div>
                  
                  <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden group">
                    <img src={albumGrave} alt="2 Tha Grave" className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold">2 Tha Grave</h3>
                      <p className="text-sm text-muted-foreground">2011 • Debut Album</p>
                    </div>
                  </div>
                  
                  <div className="bg-card/50 border border-amber-500/50 rounded-xl overflow-hidden group">
                    <div className="relative">
                      <img src={nftLimitless} alt="Limitless NFT" className="w-full aspect-square object-cover" />
                      <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        NFT
                      </div>
                    </div>
                    <div className="p-4">
                      <a href="https://www.sound.xyz/mrcap/releases" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors">Dippin Thru the Metaverse</a>
                      <p className="text-sm text-muted-foreground">Bridging hip-hop, tech & blockchain</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-10">
                  <Button variant="flux" asChild>
                    <Link to="/mr-cap-discography">
                      <Disc3 className="mr-2 h-4 w-4" />
                      View Full Discography
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Beyond Music — Business & Innovation */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Beyond Music — Business & Innovation
                </h2>
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Mr. CAP is also the founder of <strong>CAP Distributions</strong>, a digital distribution company 
                    created to help independent artists release music globally without sacrificing ownership.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    He has expanded into:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <Globe className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Digital Distribution & Artist Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Helping artists reach global platforms while retaining ownership
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <Zap className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">NFT & Blockchain Music Projects</h3>
                    <p className="text-sm text-muted-foreground">
                      First Houston rapper to sell a Hip-Hop NFT (February 2021)
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <Film className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Media & Creative Consulting</h3>
                    <p className="text-sm text-muted-foreground">
                      Documentary work, media appearances, and cultural commentary
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mt-10">
                  This intersection of music, tech, and ownership defines the modern phase of his career—proving that 
                  artists can evolve without losing their roots.
                </p>
              </div>
            </div>
          </section>

          {/* Documentary & Cultural Impact */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                      Documentary & Cultural Impact
                    </h2>
                    <div className="prose prose-lg prose-invert max-w-none space-y-6">
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        Mr. CAP was featured in the documentary <em>The Life: Sex Trafficking and Modern-Day Slavery</em>, 
                        contributing firsthand perspective on social issues affecting communities.
                      </p>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        The film received <strong>Emmy-level recognition</strong>, further cementing his voice beyond music 
                        as a cultural commentator and advocate for change.
                      </p>
                    </div>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
                    <img 
                      src={theLifeDocumentary} 
                      alt="The Life Documentary featuring Mr. CAP" 
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">Documentary Feature</span>
                      <h3 className="font-bold mt-1">The Life: Sex Trafficking & Modern-Day Slavery</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Mr. CAP Matters */}
          <section className="py-20 bg-gradient-to-b from-card/30 to-background border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Why Mr. CAP Matters
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  Mr. CAP's story is not about overnight success — it's about <strong className="text-foreground">survival, 
                  adaptation, and ownership</strong>. He represents a generation of artists who built platforms before 
                  social media and continues to evolve in the digital era.
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                  From South Park streets to streaming platforms worldwide, from cassette tapes to NFTs — 
                  Mr. CAP proves that <strong className="text-foreground">betting on yourself</strong> is always the right move.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="flux" size="lg" asChild>
                    <Link to="/music">
                      <Play className="mr-2 h-5 w-5" />
                      Listen to Music
                    </Link>
                  </Button>
                  <Button variant="fluxOutline" size="lg" asChild>
                    <Link to="/press">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Press & OPK
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
            </div>
          </section>
        </main>
        
        <CitationBlock />
        <Footer />
      </div>
    </>
  );
};

export default WhoIsMrCap;

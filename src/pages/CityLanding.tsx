import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getCityBySlug, getCitiesByState, allCities, type CityData } from "@/data/cities";
import { MapPin, Calendar, Music, Mic2, ChevronRight, Play, ExternalLink } from "lucide-react";
import CitationBlock from "@/components/CitationBlock";
import heroBg from "@/assets/hero-bg.jpg";

const CityLanding = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = citySlug ? getCityBySlug(citySlug) : undefined;

  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const stateCities = getCitiesByState(city.state).filter(c => c.slug !== city.slug).slice(0, 6);
  
  const pageTitle = `Mr. CAP in ${city.name}, ${city.stateAbbr} | Hip-Hop Shows, Music & Booking`;
  const metaDescription = `Discover Mr. CAP in ${city.name}, ${city.stateAbbr} – South Park Coalition original member bringing Houston hip-hop energy, live performances, and independent music to ${city.name}. Book shows and stream the music.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": `Mr. CAP – Live Shows in ${city.name}, ${city.stateAbbr}`,
        "url": `https://mrcap1.com/city/${city.slug}`,
        "image": "https://mrcap1.com/images/mrcap-live.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.name,
          "addressRegion": city.stateAbbr,
          "addressCountry": "US"
        },
        "areaServed": city.name,
        "sameAs": ["https://mrcap1.com"]
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": "Cornelius A. Pratt",
        "description": "Houston hip-hop artist, South Park Coalition original member",
        "jobTitle": "Hip-Hop Artist"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://mrcap1.com/cities" },
          { "@type": "ListItem", "position": 3, "name": city.name, "item": `https://mrcap1.com/city/${city.slug}` }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${city.name} hip hop, ${city.name} rap concerts, Mr. CAP ${city.name}, South Park Coalition ${city.stateAbbr}, Houston rapper ${city.name}, book rapper ${city.name}`} />
        <link rel="canonical" href={`https://mrcap1.com/city/${city.slug}`} />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mrcap1.com/city/${city.slug}`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            
            <div className="relative z-10 container mx-auto px-4 py-24 text-center">
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/cities" className="hover:text-primary transition-colors">Cities</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{city.name}, {city.stateAbbr}</span>
              </nav>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">{city.region}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                Mr. CAP in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-flux-accent to-primary">
                  {city.name}, {city.stateAbbr}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Houston roots. {city.name} stages. South Park Coalition energy for {city.region}.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <a href="#booking">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book a Show in {city.name}
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/music">
                    <Music className="mr-2 h-5 w-5" />
                    Stream Music
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Houston Roots. {city.name} Stages.
                </h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Mr. CAP is a Houston-born rapper and original member of the South Park Coalition, now taking 
                    his sound across {city.state} with shows in {city.name} and the surrounding region. From underground 
                    classics to his latest album <em>The Ties That Bind Us</em>, CAP brings the same authenticity, 
                    storytelling, and stage energy everywhere he goes.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Whether you're a promoter, venue owner, or fan in {city.name}, this page is your hub for shows, 
                    music, and booking info in your area.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Live in City Section */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                  <Mic2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Live in {city.name}</h3>
                  <p className="text-muted-foreground mb-6">
                    Mr. CAP performs at clubs, festivals, and special events across {city.name} and nearby cities 
                    in {city.state}. Sets blend classic SPC energy with new material like "Bet'n On Me" and records 
                    from <em>The Ties That Bind Us</em>.
                  </p>
                  <Button variant="flux" asChild>
                    <a href="#booking">Request a Show Date in {city.name}</a>
                  </Button>
                </div>

                <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                  <Music className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Stream the Music</h3>
                  <p className="text-muted-foreground mb-6">
                    Fans in {city.name} can stream Mr. CAP on Spotify, Apple Music, YouTube and more. Add the records 
                    to your playlists, share with your people, and bring Houston's underground sound deeper into {city.state}.
                  </p>
                  <div className="flex flex-wrap gap-3">
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
              </div>
            </div>
          </section>

          {/* For Promoters */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto bg-card/50 border border-border/50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">For Promoters & Venues in {city.name}</h3>
                <p className="text-muted-foreground mb-6">
                  Ready to bring a South Park Coalition original to {city.name}? Mr. CAP offers club sets, festival 
                  performances, and special appearances, with a professional team and a reputation for authentic, 
                  crowd-connecting shows.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="flux" asChild>
                    <a href="#booking">Request Date & Rate</a>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <Link to="/about">Read the Full Bio</Link>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <Link to="/blog">Explore Articles</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Booking CTA */}
          <section id="booking" className="py-20 bg-gradient-to-b from-primary/10 to-background border-t border-border/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Book Mr. CAP in {city.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Ready to bring authentic Houston hip-hop to {city.name}? Contact us for booking inquiries, 
                performance deposits, and availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="flux" size="lg" asChild>
                  <a href={`mailto:wrecklessent@gmail.com?subject=Booking Inquiry - ${city.name}, ${city.stateAbbr}`}>
                    Request Booking
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/#contact">
                    Contact Info
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Performance Deposits:</strong> CashApp: $CorneliusAPratt · Zelle: 713-423-5333 (Cap Distributions)
              </p>
            </div>
          </section>

          {/* Other Cities in State */}
          {stateCities.length > 0 && (
            <section className="py-20 border-t border-border/50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
                  More {city.state} Cities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                  {stateCities.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/city/${c.slug}`}
                      className="bg-card/30 border border-border/50 rounded-lg p-4 text-center hover:border-primary/50 hover:bg-card/50 transition-all"
                    >
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.stateAbbr}</p>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="fluxGhost" asChild>
                    <Link to="/cities">
                      View All Cities
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
        </main>

        <CitationBlock />
        <Footer />
      </div>
    </>
  );
};

export default CityLanding;

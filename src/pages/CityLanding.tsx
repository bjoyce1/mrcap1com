import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getCityBySlug, getCitiesByState, allCities, type CityData } from "@/data/cities";
import { MapPin, Calendar, Music, Mic2, ChevronRight, Play, ExternalLink } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const CityLanding = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = citySlug ? getCityBySlug(citySlug) : undefined;

  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const stateCities = getCitiesByState(city.state).filter(c => c.slug !== city.slug).slice(0, 6);
  
  // Generate dynamic content based on city
  const pageTitle = `Mr. CAP in ${city.name}, ${city.stateAbbr} — Hip-Hop Music, Shows & Booking`;
  const metaDescription = `Book Mr. CAP for live performances in ${city.name}, ${city.stateAbbr}. South Park Coalition original member bringing authentic Houston hip-hop to ${city.region}. Stream music, view upcoming shows, and book now.`;

  // LocalBusiness + Person schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mrcapmusic.com/#person",
        "name": "Mr. CAP",
        "alternateName": "Cornelius A. Pratt",
        "description": "Houston hip-hop artist, South Park Coalition original member, and blockchain pioneer",
        "image": "https://mrcapmusic.com/og-image.jpg",
        "sameAs": [
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.youtube.com/@mrcap1"
        ],
        "jobTitle": "Hip-Hop Artist",
        "knowsAbout": ["Hip-Hop Music", "Blockchain", "NFTs", "South Park Coalition"]
      },
      {
        "@type": "MusicEvent",
        "name": `Mr. CAP Live in ${city.name}`,
        "description": `Experience authentic Houston hip-hop with Mr. CAP in ${city.name}, ${city.stateAbbr}`,
        "performer": {
          "@type": "Person",
          "name": "Mr. CAP"
        },
        "location": {
          "@type": "Place",
          "name": city.name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city.name,
            "addressRegion": city.stateAbbr,
            "addressCountry": "US"
          }
        },
        "offers": {
          "@type": "Offer",
          "url": "https://mrcapmusic.com/#contact"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcapmusic.com" },
          { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://mrcapmusic.com/cities" },
          { "@type": "ListItem", "position": 3, "name": city.state, "item": `https://mrcapmusic.com/cities/${city.state.toLowerCase()}` },
          { "@type": "ListItem", "position": 4, "name": city.name, "item": `https://mrcapmusic.com/city/${city.slug}` }
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
        <link rel="canonical" href={`https://mrcapmusic.com/city/${city.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mrcapmusic.com/city/${city.slug}`} />
        <meta property="og:image" content="https://mrcapmusic.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        
        {/* JSON-LD */}
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
                Experience authentic Houston hip-hop and South Park Coalition legacy in {city.name}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <a href="#booking">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book in {city.name}
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
                  Houston Hip-Hop Comes to {city.name}
                </h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Mr. CAP brings the authentic sound of Houston's underground hip-hop scene to {city.name}, {city.stateAbbr}. 
                    As an original member of the legendary South Park Coalition, Mr. CAP has been at the forefront of 
                    Houston's rap movement since the early days, collaborating with icons and pioneering new sounds 
                    that have influenced generations of artists.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Whether you're in {city.region} looking for authentic hip-hop performances or want to book a show 
                    that brings real street credibility to your venue, Mr. CAP delivers an unforgettable experience 
                    that bridges Houston's legendary past with today's innovative sound.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Live Performances Section */}
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Live Performances in {city.name}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Bringing Houston's underground sound to {city.region}. Book Mr. CAP for clubs, festivals, 
                  private events, and corporate functions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <Mic2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Club Shows</h3>
                  <p className="text-muted-foreground text-sm">
                    High-energy performances perfect for {city.name}'s nightlife scene
                  </p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Festival Appearances</h3>
                  <p className="text-muted-foreground text-sm">
                    Bringing SPC legacy to {city.stateAbbr} festivals and outdoor events
                  </p>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <Music className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Private Events</h3>
                  <p className="text-muted-foreground text-sm">
                    Exclusive performances for corporate and private functions in {city.name}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Music Streaming Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                      Stream Mr. CAP in {city.name}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      From the streets of Houston to {city.name}, experience the authentic sound of South Park Coalition. 
                      Stream the latest album "The Ties That Bind Us" featuring the hit single "Bet'n On Me" on all platforms.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="fluxOutline" size="sm" asChild>
                        <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Spotify
                        </a>
                      </Button>
                      <Button variant="fluxOutline" size="sm" asChild>
                        <a href="https://music.apple.com/us/artist/mr-cap/1506719540" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Apple Music
                        </a>
                      </Button>
                      <Button variant="fluxOutline" size="sm" asChild>
                        <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-4 w-4" />
                          YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="bg-card/30 border border-border/50 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-4">Featured Albums</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">The Ties That Bind Us</p>
                          <p className="text-sm text-muted-foreground">2024 • Latest Release</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">The Art of ISM</p>
                          <p className="text-sm text-muted-foreground">2019 • Sony Music / The Orchard</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">2 Tha Grave</p>
                          <p className="text-sm text-muted-foreground">2011 • Classic</p>
                        </div>
                      </li>
                    </ul>
                  </div>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <a href="mailto:wrecklessent@gmail.com?subject=Booking Inquiry - {city.name}">
                    Request Booking
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/#contact">
                    Contact Info
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
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

        <Footer />
      </div>
    </>
  );
};

export default CityLanding;

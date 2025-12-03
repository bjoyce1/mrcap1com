import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { texasCities, louisianaCities, getMetroCities } from "@/data/cities";
import { MapPin, ChevronRight, Star } from "lucide-react";

const Cities = () => {
  const metroCities = getMetroCities();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mr. CAP Tour Cities - Texas & Louisiana",
    "description": "Book Mr. CAP for live hip-hop performances across Texas and Louisiana",
    "numberOfItems": texasCities.length + louisianaCities.length,
    "itemListElement": [...texasCities, ...louisianaCities].map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://mrcapmusic.com/city/${city.slug}`,
      "name": `Mr. CAP in ${city.name}, ${city.stateAbbr}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Tour Cities — Mr. CAP Live in Texas & Louisiana | Book Hip-Hop Shows</title>
        <meta name="description" content="Book Mr. CAP for live hip-hop performances across Texas and Louisiana. From Houston to Dallas, Austin to New Orleans — bringing South Park Coalition to your city." />
        <link rel="canonical" href="https://mrcapmusic.com/cities" />
        
        <meta property="og:title" content="Tour Cities — Mr. CAP Live in Texas & Louisiana" />
        <meta property="og:description" content="Book Mr. CAP for live hip-hop performances across Texas and Louisiana." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4 text-center">
              <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Cities</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Tour{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Cities
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bringing authentic Houston hip-hop and South Park Coalition legacy to Texas & Louisiana
              </p>
            </div>
          </section>

          {/* Featured Metro Cities */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-8">
                <Star className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Major Markets</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {metroCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="group relative bg-card/50 border border-border/50 rounded-xl p-6 hover:border-primary/50 hover:bg-card transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {city.population}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{city.state}</p>
                    <p className="text-xs text-muted-foreground mt-1">{city.region}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Texas Cities */}
          <section className="py-16 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-8">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Texas</h2>
                <span className="text-sm text-muted-foreground">({texasCities.length} cities)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {texasCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/50 hover:bg-card transition-all text-center"
                  >
                    <p className="font-medium text-sm">{city.name}</p>
                    {city.isMetro && (
                      <Star className="w-3 h-3 text-primary mx-auto mt-1" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Louisiana Cities */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-8">
                <MapPin className="w-5 h-5 text-flux-accent" />
                <h2 className="text-2xl font-display font-bold">Louisiana</h2>
                <span className="text-sm text-muted-foreground">({louisianaCities.length} cities)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {louisianaCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-flux-accent/50 hover:bg-card transition-all text-center"
                  >
                    <p className="font-medium text-sm">{city.name}</p>
                    {city.isMetro && (
                      <Star className="w-3 h-3 text-flux-accent mx-auto mt-1" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-gradient-to-b from-primary/10 to-background border-t border-border/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Don't See Your City?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Mr. CAP performs nationwide. Contact us for booking inquiries in any location.
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact for Booking
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cities;

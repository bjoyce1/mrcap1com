import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, MapPin, Ticket, ExternalLink, Clock } from "lucide-react";
import spcPoster from "@/assets/spc-austin-2025.png";

const upcomingShows = [
  {
    title: "South Park Coalition Live in Concert",
    subtitle: "The Bet'n On Me Tour",
    date: "December 13, 2025",
    time: "Doors 7:00 PM",
    venue: "Flamingo Cantina",
    city: "Austin",
    state: "TX",
    address: "515 E 6th St, Austin, TX 78701",
    ticketUrl: "https://spcatx2025.lovable.app/",
    poster: spcPoster,
    featured: true,
  },
];

const pastShows = [
  { date: "Oct 2024", venue: "House of Blues", city: "Houston, TX" },
  { date: "Aug 2024", venue: "Warehouse Live", city: "Houston, TX" },
  { date: "Jun 2024", venue: "Trees", city: "Dallas, TX" },
  { date: "Mar 2024", venue: "Paper Tiger", city: "San Antonio, TX" },
];

const Live = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mr. CAP Live Shows",
    "itemListElement": upcomingShows.map((show, index) => ({
      "@type": "MusicEvent",
      "position": index + 1,
      "name": show.title,
      "startDate": "2025-12-13T19:00:00-06:00",
      "location": {
        "@type": "Place",
        "name": show.venue,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": show.address,
          "addressLocality": show.city,
          "addressRegion": show.state,
          "addressCountry": "US"
        }
      },
      "performer": {
        "@type": "Person",
        "name": "Mr. CAP"
      },
      "offers": {
        "@type": "Offer",
        "url": show.ticketUrl
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Live Shows — Mr. CAP Tour Dates & Concerts | Book Hip-Hop Performance</title>
        <meta name="description" content="See Mr. CAP live in concert. View upcoming tour dates across Texas and beyond. Book Mr. CAP for your venue, festival, or private event." />
        <link rel="canonical" href="https://mrcapmusic.com/live" />
        
        <meta property="og:title" content="Live Shows — Mr. CAP Tour Dates & Concerts" />
        <meta property="og:description" content="See Mr. CAP live in concert. View upcoming tour dates and booking info." />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Live</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Live{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Shows
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Experience authentic Houston hip-hop live. Tour dates, past performances, and booking information.
              </p>
            </div>
          </section>

          {/* Featured Show */}
          {upcomingShows.filter(s => s.featured).map((show) => (
            <section key={show.title} className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                      <Calendar className="w-4 h-4" />
                      UPCOMING SHOW
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                      {show.title}
                    </h2>
                    <p className="text-xl text-primary font-medium mb-6">{show.subtitle}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">{show.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>{show.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">{show.venue}</span>
                          <p className="text-sm">{show.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <Button variant="flux" size="lg" asChild>
                        <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                          <Ticket className="mr-2 h-5 w-5" />
                          Get Tickets
                        </a>
                      </Button>
                      <Button variant="fluxOutline" size="lg" asChild>
                        <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Event Details
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={show.poster}
                      alt={`${show.title} poster`}
                      className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-primary/20"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Past Shows */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8">Recent Performances</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pastShows.map((show, index) => (
                  <div
                    key={index}
                    className="bg-card/30 border border-border/50 rounded-xl p-6 hover:border-border transition-colors"
                  >
                    <span className="text-xs text-muted-foreground">{show.date}</span>
                    <h3 className="font-bold mt-1">{show.venue}</h3>
                    <p className="text-sm text-muted-foreground">{show.city}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Booking CTA */}
          <section className="py-20 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Book Mr. CAP
                </h2>
                <p className="text-muted-foreground mb-8">
                  Available for club shows, festivals, corporate events, and private functions. 
                  Bringing authentic Houston hip-hop and South Park Coalition legacy to your event.
                </p>
                
                <div className="bg-card/50 border border-border/50 rounded-xl p-8 mb-8">
                  <h3 className="font-bold mb-4">Booking Inquiries</h3>
                  <p className="text-muted-foreground mb-4">
                    Email: <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">wrecklessent@gmail.com</a>
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Performance Deposits:</strong></p>
                    <p>CashApp: $CorneliusAPratt · Zelle: 713-423-5333 (Cap Distributions)</p>
                  </div>
                </div>
                
                <Button variant="flux" size="lg" asChild>
                  <Link to="/cities">
                    <MapPin className="mr-2 h-5 w-5" />
                    View All Tour Cities
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

export default Live;

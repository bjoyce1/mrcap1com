import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, MapPin, Ticket, ExternalLink, Clock, Mic2 } from "lucide-react";
import spcPoster from "@/assets/spc-austin-2025.png";
const upcomingShows = [{
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
  featured: true
}];
const pastShows = [{
  date: "Oct 2024",
  isoDate: "2024-10-15",
  venue: "House of Blues",
  city: "Houston",
  state: "TX"
}, {
  date: "Aug 2024",
  isoDate: "2024-08-20",
  venue: "Warehouse Live",
  city: "Houston",
  state: "TX"
}, {
  date: "Jun 2024",
  isoDate: "2024-06-14",
  venue: "Trees",
  city: "Dallas",
  state: "TX"
}, {
  date: "Mar 2024",
  isoDate: "2024-03-22",
  venue: "Paper Tiger",
  city: "San Antonio",
  state: "TX"
}];
const Live = () => {
  // Generate past event schemas
  const pastEventSchemas = pastShows.map(show => ({
    "@type": "MusicEvent",
    "name": `Mr. CAP Live – ${show.venue}`,
    "startDate": show.isoDate,
    "eventStatus": "https://schema.org/EventCompleted",
    "performer": [{
      "@type": "Person",
      "name": "Mr. CAP"
    }, {
      "@type": "MusicGroup",
      "name": "South Park Coalition"
    }],
    "location": {
      "@type": "Place",
      "name": show.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": show.city,
        "addressRegion": show.state,
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Person",
      "name": "Mr. CAP"
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Upcoming show
      {
        "@type": "MusicEvent",
        "name": "South Park Coalition Live in Concert - The Bet'n On Me Tour",
        "startDate": "2025-12-13T19:00:00-06:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "MusicVenue",
          "name": "Flamingo Cantina",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "515 E 6th St",
            "addressLocality": "Austin",
            "addressRegion": "TX",
            "postalCode": "78701",
            "addressCountry": "US"
          }
        },
        "performer": [{
          "@type": "Person",
          "name": "Mr. CAP"
        }, {
          "@type": "MusicGroup",
          "name": "South Park Coalition"
        }],
        "offers": {
          "@type": "Offer",
          "url": "https://spcatx2025.lovable.app/",
          "availability": "https://schema.org/InStock"
        },
        "organizer": {
          "@type": "Person",
          "name": "Mr. CAP"
        },
        "image": "https://mrcap1.com/images/spc-austin-2025.png"
      },
      // Past events
      ...pastEventSchemas,
      // Breadcrumbs
      {
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mrcap1.com"
        }, {
          "@type": "ListItem",
          "position": 2,
          "name": "Live",
          "item": "https://mrcap1.com/live"
        }]
      }
    ]
  };
  return <>
      <Helmet>
        <title>Live Shows & Booking | Mr. CAP – Houston Hip-Hop Concerts & Events</title>
        <meta name="description" content="Book Mr. CAP for live shows across Houston, Texas, and Louisiana. View upcoming tour dates, past performances, and submit booking requests for concerts, festivals, and special events." />
        <link rel="canonical" href="https://mrcap1.com/live" />
        
        <meta property="og:title" content="Live Shows & Booking | Mr. CAP" />
        <meta property="og:description" content="Book Mr. CAP for shows across Houston, Texas, and Louisiana. View upcoming tour dates and booking info." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/live" />
        
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
                Live Shows &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Booking
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Whether it's a packed Houston club or a festival stage in another city, Mr. CAP brings a raw, 
                honest performance—built on decades of experience and a lifetime of stories.
              </p>
            </div>
          </section>

          {/* Featured Show */}
          {upcomingShows.filter(s => s.featured).map(show => <section key={show.title} className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
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
                    <img src={show.poster} alt={`${show.title} poster`} className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-primary/20" />
                  </div>
                </div>
              </div>
            </section>)}

          {/* Past Shows */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8">Recent Performances</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pastShows.map((show, index) => <div key={index} className="bg-card/30 border border-border/50 rounded-xl p-6 hover:border-border transition-colors">
                    <span className="text-xs text-muted-foreground">{show.date}</span>
                    <h3 className="font-bold mt-1">{show.venue}</h3>
                    <p className="text-sm text-muted-foreground">{show.city}, {show.state}</p>
                  </div>)}
              </div>
            </div>
          </section>

          {/* Booking CTA */}
          <section className="py-20 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <Mic2 className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Bring Mr. CAP to Your City
                </h2>
                <p className="text-muted-foreground mb-8">
                  Ready to bring a South Park Coalition original to your venue? Mr. CAP offers club sets, 
                  festival performances, and special appearances, with a professional team and a reputation 
                  for authentic, crowd-connecting shows.
                </p>
                
                <div className="bg-card/50 border border-border/50 rounded-xl p-8 mb-8 text-left">
                  <h3 className="font-bold mb-4 text-center">Booking Inquiries</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Email</p>
                      <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">southparkcoalitionllc@gmail.com</a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Performance Deposits</p>
                      <p className="text-sm">CashApp: <span className="font-mono text-foreground">$CorneliusAPratt</span></p>
                      <p className="text-sm">Zelle: <span className="font-mono text-foreground">713-423-5333</span> (Cap Distributions)</p>
                    </div>
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
    </>;
};
export default Live;
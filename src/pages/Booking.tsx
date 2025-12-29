import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { ChevronRight, Mail, Phone, MapPin, Calendar } from "lucide-react";
import CitationBlock from "@/components/CitationBlock";

const Booking = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Book Mr. CAP | Houston Hip-Hop Artist Booking",
    "description": "Book Mr. CAP for live performances, interviews, features, and speaking engagements. Houston hip-hop artist and South Park Coalition member available for shows across Texas and beyond.",
    "mainEntity": {
      "@type": "Person",
      "name": "Mr. CAP",
      "alternateName": "Cornelius A. Pratt",
      "description": "Houston hip-hop artist, South Park Coalition member, and entrepreneur",
      "sameAs": [
        "https://open.spotify.com/artist/1pSXGKxJIw95dV3xQX4TjS",
        "https://music.apple.com/us/artist/mr-cap/276295771"
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mrcap1.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Booking",
          "item": "https://mrcap1.com/booking"
        }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Mr. CAP | Houston Hip-Hop Artist Booking & Contact</title>
        <meta 
          name="description" 
          content="Book Mr. CAP for live performances, festivals, interviews, and speaking engagements. Houston hip-hop artist and South Park Coalition member. Submit booking requests or contact management directly." 
        />
        <link rel="canonical" href="https://mrcap1.com/booking" />
        
        <meta property="og:title" content="Book Mr. CAP | Houston Hip-Hop Artist" />
        <meta property="og:description" content="Book Mr. CAP for live shows, interviews, features, and speaking engagements. South Park Coalition member available for events across Texas and beyond." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/booking" />
        
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
                <span className="text-foreground">Booking</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Book{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Mr. CAP
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Ready to bring authentic Houston hip-hop to your stage? Book Mr. CAP for live performances, 
                interviews, features, or speaking engagements.
              </p>
            </div>
          </section>

          {/* Booking Form & Info */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                  <h2 className="text-2xl font-display font-bold mb-6">Submit a Booking Request</h2>
                  <div className="bg-card/30 border border-border/50 rounded-xl p-6 md:p-8">
                    <BookingForm />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-display font-bold mb-6">Direct Contact</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Email</h3>
                          <a 
                            href="mailto:southparkcoalitionllc@gmail.com" 
                            className="text-primary hover:underline"
                          >
                            southparkcoalitionllc@gmail.com
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">
                            For all booking inquiries and press requests
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Performance Deposits</h3>
                          <p className="text-sm mb-2">
                            <span className="text-muted-foreground">CashApp:</span>{" "}
                            <span className="font-mono text-foreground">$CorneliusAPratt</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Zelle:</span>{" "}
                            <span className="font-mono text-foreground">713-423-5333</span>{" "}
                            <span className="text-xs text-muted-foreground">(Cap Distributions)</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Based In</h3>
                          <p className="text-muted-foreground">Houston, Texas</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Available for shows across Texas, Louisiana, and nationwide
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Booking Types</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                            <li>• Live Performances & Concerts</li>
                            <li>• Festival Appearances</li>
                            <li>• Music Features & Collaborations</li>
                            <li>• Interviews & Press</li>
                            <li>• Speaking Engagements</li>
                            <li>• Private Events</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Live Shows CTA */}
                  <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Looking for upcoming shows?
                    </p>
                    <Link 
                      to="/live" 
                      className="text-primary font-medium hover:underline"
                    >
                      View Tour Dates & Live Shows →
                    </Link>
                  </div>
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

export default Booking;
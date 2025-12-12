import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, ExternalLink, Quote, Mail, FileText, Image } from "lucide-react";

const pressFeatures = [
  {
    outlet: "Sound.xyz",
    title: "Dippin Thru the Metaverse – A Groundbreaking Blend of Hip-Hop and Technology",
    date: "2023",
    url: "https://www.sound.xyz/mrcap/dippin-thru-the-metaverse",
  },
  {
    outlet: "Houston Chronicle",
    title: "South Park Coalition: 30 Years of Houston Underground",
    date: "2024",
    url: "#",
  },
  {
    outlet: "Complex",
    title: "The Untold Story of Houston's Most Influential Rap Collective",
    date: "2023",
    url: "#",
  },
  {
    outlet: "AllHipHop",
    title: "Mr. CAP Becomes First Houston Rapper to Sell NFT",
    date: "2021",
    url: "#",
  },
];

const quotes = [
  {
    text: "Shout-out to Mr. Cap… he a hardworking man. I sit and watch him all the time. I learn a lot from watching things.",
    source: "Sosamann, HotNewHipHop Interview (2022)",
  },
  {
    text: "Mr. CAP represents the true essence of Houston hip-hop. His longevity and authenticity are unmatched.",
    source: "K-Rino, South Park Coalition Founder",
  },
  {
    text: "One of the most consistent voices in underground hip-hop for over three decades.",
    source: "Hip Hop DX",
  },
  {
    text: "A pioneer in both music and blockchain technology, showing artists new paths to ownership.",
    source: "NFT Now",
  },
];

const mediaBio = `Cornelius A. Pratt, professionally known as Mr. CAP, is a Houston-born rapper, writer, and creative technologist with deep roots in the South Park Coalition. With over three decades in the music industry, he has released multiple albums including his latest "The Ties That Bind Us" and the hit single "Bet'n On Me." In 2021, he became the first Houston rapper to sell a Hip Hop NFT on the blockchain.`;

const Press = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Press & Media - Mr. CAP - Electronic Press Kit",
        "description": "Access official press assets, bio, photos, quotes, and media coverage for Mr. CAP. Download the EPK and request interviews or features.",
        "url": "https://mrcap1.com/press",
        "mainEntity": {
          "@type": "Person",
          "name": "Mr. CAP",
          "description": "Houston hip-hop artist and South Park Coalition member"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can I request an interview with Mr. CAP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For interview requests, contact wrecklessent@gmail.com. Please include details about your publication, audience, and preferred format. Allow 48-72 hours for response."
            }
          },
          {
            "@type": "Question",
            "name": "Where can I download press photos of Mr. CAP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "High-resolution press photos and the official press kit are available for download on the Press page at mrcap1.com/press."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Press", "item": "https://mrcap1.com/press" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Press & Media | Mr. CAP – Electronic Press Kit (EPK)</title>
        <meta name="description" content="Access official press assets, bio, high-res photos, quotes, and media coverage for Mr. CAP. Download the EPK and request interviews or features for Houston hip-hop coverage." />
        <link rel="canonical" href="https://mrcap1.com/press" />
        
        <meta property="og:title" content="Press & Media | Mr. CAP – EPK" />
        <meta property="og:description" content="Press kit and media coverage for Houston hip-hop artist Mr. CAP." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/press" />
        
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
                <span className="text-foreground">Press</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Press &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Media
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Official press assets, bio, photos, quotes, and media coverage. Download the EPK and request interviews.
              </p>
            </div>
          </section>

          {/* Media Bio */}
          <section className="py-16 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-6">Media-Ready Bio</h2>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                  <p className="text-muted-foreground leading-relaxed">{mediaBio}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(mediaBio)}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Press Kit Download */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold mb-4">Press Kit</h2>
                <p className="text-muted-foreground mb-8">
                  Download the official press kit including high-resolution photos, biography, 
                  discography, and approved media assets.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="flux" size="lg" asChild>
                    <a href="/press-kit.pdf" download>
                      <Download className="mr-2 h-5 w-5" />
                      Download Press Kit (PDF)
                    </a>
                  </Button>
                  <Button variant="fluxOutline" size="lg" asChild>
                    <a href="/photos.zip" download>
                      <Image className="mr-2 h-5 w-5" />
                      High-Res Photos
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Press Features */}
          <section className="py-20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8">Featured Coverage</h2>
              
              <div className="space-y-4 max-w-3xl">
                {pressFeatures.map((feature, index) => (
                  <a
                    key={index}
                    href={feature.url}
                    className="flex items-center justify-between bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group"
                  >
                    <div>
                      <span className="text-xs text-primary font-medium">{feature.outlet}</span>
                      <h3 className="font-bold mt-1 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">{feature.date}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Quotes */}
          <section className="py-20 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">What They're Saying</h2>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {quotes.map((quote, index) => (
                  <div
                    key={index}
                    className="bg-card/50 border border-border/50 rounded-xl p-6"
                  >
                    <Quote className="w-8 h-8 text-primary/50 mb-4" />
                    <p className="text-foreground italic mb-4">"{quote.text}"</p>
                    <p className="text-sm text-muted-foreground">— {quote.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Media Contact */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold mb-4">Media Inquiries</h2>
                <p className="text-muted-foreground mb-8">
                  For interview requests, press inquiries, and media partnerships, please contact:
                </p>
                <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                  <p className="text-lg font-medium mb-2">Press Contact</p>
                  <a 
                    href="mailto:wrecklessent@gmail.com?subject=Press Inquiry - Mr. CAP"
                    className="text-primary hover:underline text-lg"
                  >
                    wrecklessent@gmail.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-4">
                    Please allow 48-72 hours for response
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Press;

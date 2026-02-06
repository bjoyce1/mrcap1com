import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CitationBlock from "@/components/CitationBlock";
import PressTimeline from "@/components/PressTimeline";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, ExternalLink, Quote, Mail, FileText, Image, Mic, Award, Music, Users, Calendar, MapPin, Globe } from "lucide-react";
import BookingCard from "@/components/BookingCard";

// Featured press article (Houston Press)
const featuredArticle = {
  outlet: "Houston Press",
  title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
  author: "Nathan Smith",
  date: "April 20, 2015",
  dateISO: "2015-04-20",
  url: "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/",
  images: ["/images/wiz-khalifa-blog.jpg", "/images/cap-wiz-2.jpg"],
  quote: "I have nothing to do with Wiz Khalifa…I've seen his Instagram followers…even though I'm not a mainstream artist with mainstream exposure, people know who Mr. CAP is. And that's me.",
  summary: "This feature from Houston Press profiles Mr. CAP's career and clarifies a notable identity mix-up with Wiz Khalifa. It highlights his deep roots in Houston's hip-hop scene and long-standing commitment to his craft and community."
};

// Press features moved to PressTimeline component

const quotes = [{
  text: "I have nothing to do with Wiz Khalifa…I've seen his Instagram followers…even though I'm not a mainstream artist with mainstream exposure, people know who Mr. CAP is. And that's me.",
  source: "Houston Press (2015)"
}, {
  text: "Shout-out to Mr. Cap… he a hardworking man. I sit and watch him all the time. I learn a lot from watching things.",
  source: "Sosamann, HotNewHipHop Interview (2022)"
}, {
  text: "Mr. CAP represents the true essence of Houston hip-hop. His longevity and authenticity are unmatched.",
  source: "K-Rino, South Park Coalition Founder"
}, {
  text: "One of the most consistent voices in underground hip-hop for over three decades.",
  source: "Hip Hop DX"
}, {
  text: "A pioneer in both music and blockchain technology, showing artists new paths to ownership.",
  source: "NFT Now"
}];

// Short bio for quick copy
const shortBio = `Mr. CAP is a Houston-born rapper and founding member of the South Park Coalition, with 30+ years in underground hip-hop. First Houston rapper to sell a Hip Hop NFT (2021).`;

// Full media bio
const mediaBio = `Cornelius A. Pratt, professionally known as Mr. CAP (Creative Artist Promoter), is a Houston-born rapper, writer, and creative technologist. As a founding member of the legendary South Park Coalition (SPC), he has been a pivotal force in Houston's underground hip-hop scene since the late 1980s.

With over three decades in the music industry, Mr. CAP has released multiple critically acclaimed albums including "Art of Ism," "Cold Ass Pimp," "To Tha Grave," and his latest "The Ties That Bind Us." His 2024 single "Bet'n On Me" continues to showcase his lyrical prowess and cultural relevance.

In 2021, Mr. CAP made history as the first Houston rapper to sell a Hip Hop NFT on the blockchain, pioneering the intersection of Southern hip-hop and Web3 technology. His NFT collection "Limitless" on Sound.xyz represents a new frontier for independent artists seeking ownership and direct fan engagement.

Beyond music, Mr. CAP is a cultural historian, documenting Houston's rich hip-hop heritage and mentoring the next generation of artists. His work has been featured in Houston Chronicle, Complex, AllHipHop, HipHopDX, and Sound.xyz.`;

// Key facts for journalists
const keyFacts = [{
  label: "Real Name",
  value: "Cornelius A. Pratt"
}, {
  label: "Stage Name",
  value: "Mr. CAP (Creative Artist Promoter)"
}, {
  label: "Origin",
  value: "Houston, Texas (South Park)"
}, {
  label: "Active Since",
  value: "1988"
}, {
  label: "Affiliation",
  value: "South Park Coalition (SPC)"
}, {
  label: "Notable First",
  value: "First Houston Rapper to Sell a Hip Hop NFT (2021)"
}, {
  label: "Latest Release",
  value: "Bet'n On Me (2024)"
}, {
  label: "Albums",
  value: "Art of Ism, Cold Ass Pimp, To Tha Grave, The Ties That Bind Us"
}];

// Story angles for journalists
const storyAngles = [{
  title: "Houston Hip-Hop Pioneer",
  description: "30+ years documenting and shaping the South Park Coalition legacy alongside K-Rino",
  icon: Music
}, {
  title: "Web3 & NFT Innovation",
  description: "First Houston rapper to sell a Hip Hop NFT, bridging underground hip-hop with blockchain technology",
  icon: Globe
}, {
  title: "Cultural Preservation",
  description: "Actively documenting Houston's hip-hop history and mentoring emerging artists",
  icon: Award
}, {
  title: "Independent Artist Blueprint",
  description: "Three decades of sustainable independence in the music industry",
  icon: Users
}];

// Interview topics
const interviewTopics = ["The history and legacy of Houston's South Park Coalition", "Web3, NFTs, and the future of music ownership for independent artists", "30+ years of navigating the music industry as an independent artist", "Houston's influence on Southern hip-hop and national trends", "The evolution of underground hip-hop from 1988 to present", "Preserving hip-hop culture and mentoring the next generation"];
// Featured Article Slideshow Component
const FeaturedArticleSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredArticle.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image Slideshow */}
        <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
          {featuredArticle.images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Mr. CAP vs Wiz Khalifa - Mainstream vs Indie Underground ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/80" />
          
          {/* Slideshow Indicators */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {featuredArticle.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-primary w-6" 
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            {featuredArticle.outlet}
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight">
            "{featuredArticle.title}"
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Published: {featuredArticle.date} | Author: {featuredArticle.author}
          </p>
          
          <blockquote className="border-l-4 border-primary pl-4 my-6">
            <p className="text-foreground/90 italic leading-relaxed">
              "{featuredArticle.quote}"
            </p>
            <cite className="text-sm text-muted-foreground mt-2 block not-italic">
              — {featuredArticle.outlet}
            </cite>
          </blockquote>
          
          <p className="text-muted-foreground mb-6">
            {featuredArticle.summary}
          </p>
          
          <Button variant="flux" asChild className="w-fit">
            <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer">
              Read Original Article
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Press = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "WebPage",
      "@id": "https://mrcap1.com/press#webpage",
      "name": "Press & Media Kit - Mr. CAP | Houston Hip-Hop Artist OPK",
      "description": "Official online press kit for Mr. CAP, Houston rapper and South Park Coalition member. Download press assets, bio, high-res photos, and request interviews.",
      "url": "https://mrcap1.com/press",
      "isPartOf": {
        "@id": "https://mrcap1.com/#website"
      },
      "about": {
        "@id": "https://mrcap1.com/#person"
      },
      "datePublished": "2024-01-01",
      "dateModified": "2024-12-01"
    }, {
      "@type": "Person",
      "@id": "https://mrcap1.com/#person",
      "name": "Mr. CAP",
      "alternateName": ["Cornelius A. Pratt", "Creative Artist Promoter", "Mr CAP"],
      "description": "Houston-born rapper, South Park Coalition founding member, and first Houston rapper to sell a Hip Hop NFT. Over 30 years in underground hip-hop.",
      "url": "https://mrcap1.com",
      "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg",
      "sameAs": [
        "https://www.instagram.com/mrcapism/",
        "https://x.com/mrcap1",
        "https://www.facebook.com/mrcap11",
        "https://www.youtube.com/@mrcap1",
        "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
        "https://www.tiktok.com/@mrcapism"
      ],
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
      "nationality": {
        "@type": "Country",
        "name": "United States"
      },
      "jobTitle": ["Rapper", "Recording Artist", "Creative Technologist", "Cultural Historian"],
      "affiliation": {
        "@type": "MusicGroup",
        "name": "South Park Coalition",
        "foundingDate": "1987",
        "foundingLocation": {
          "@type": "Place",
          "name": "Houston, Texas"
        }
      },
      "award": ["First Houston Rapper to Sell a Hip Hop NFT (2021)"],
      "knowsAbout": ["Hip-Hop Music", "Houston Hip-Hop", "South Park Coalition", "NFT Music", "Web3", "Underground Hip-Hop", "Southern Rap"],
      "genre": ["Hip-Hop", "Southern Rap", "Underground Hip-Hop", "Houston Rap"],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Recording Artist",
        "occupationalCategory": "27-2042.00"
      }
    }, {
      "@type": "MusicGroup",
      "@id": "https://mrcap1.com/#spc",
      "name": "South Park Coalition",
      "alternateName": "SPC",
      "description": "Legendary Houston hip-hop collective founded in 1987, one of the most influential underground rap groups in Southern hip-hop history.",
      "foundingDate": "1987",
      "foundingLocation": {
        "@type": "Place",
        "name": "South Park, Houston, Texas"
      },
      "genre": ["Hip-Hop", "Southern Rap", "Underground Hip-Hop"],
      "member": [{
        "@type": "Person",
        "name": "Mr. CAP",
        "@id": "https://mrcap1.com/#person"
      }, {
        "@type": "Person",
        "name": "K-Rino"
      }, {
        "@type": "Person",
        "name": "Klondike Kat"
      }, {
        "@type": "Person",
        "name": "Dope-E"
      }]
    }, {
      "@type": "FAQPage",
      "@id": "https://mrcap1.com/press#faq",
      "mainEntity": [{
        "@type": "Question",
        "name": "Who is Mr. CAP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper and founding member of the South Park Coalition, with over 30 years in underground hip-hop. In 2021, he became the first Houston rapper to sell a Hip Hop NFT on the blockchain."
        }
      }, {
        "@type": "Question",
        "name": "What is the South Park Coalition?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The South Park Coalition (SPC) is a legendary Houston hip-hop collective founded in 1987 in the South Park neighborhood. It includes artists like K-Rino, Mr. CAP, Klondike Kat, and Dope-E, and is considered one of the most influential underground rap groups in Southern hip-hop history."
        }
      }, {
        "@type": "Question",
        "name": "How can I request an interview with Mr. CAP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For interview requests, contact wrecklessent@gmail.com. Please include your publication name, audience size, topic focus, and preferred format (video, audio, or written). Allow 48-72 hours for response."
        }
      }, {
        "@type": "Question",
        "name": "What makes Mr. CAP a pioneer in NFT music?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In 2021, Mr. CAP became the first Houston rapper to sell a Hip Hop NFT on the blockchain, pioneering the intersection of Southern hip-hop and Web3 technology. His NFT collection 'Limitless' on Sound.xyz demonstrates new pathways for independent artist ownership."
        }
      }, {
        "@type": "Question",
        "name": "Where can I download press photos of Mr. CAP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "High-resolution press photos and the official press kit are available for download on the Press page at mrcap1.com/press."
        }
      }]
    }, {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mrcap1.com"
      }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Press & Media Kit",
        "item": "https://mrcap1.com/press"
      }]
    }, {
      "@type": "ContactPage",
      "name": "Media Contact - Mr. CAP",
      "description": "Contact information for press inquiries, interview requests, and media partnerships with Mr. CAP.",
      "url": "https://mrcap1.com/press",
      "contactType": "Press/Media Inquiries",
      "email": "wrecklessent@gmail.com"
    }, {
      "@type": "NewsArticle",
      "headline": "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
      "datePublished": "2015-04-20",
      "author": {
        "@type": "Person",
        "name": "Nathan Smith"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Houston Press",
        "url": "https://www.houstonpress.com"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/"
      },
      "url": "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/",
      "about": {
        "@id": "https://mrcap1.com/#person"
      }
    }, {
      "@type": "ItemList",
      "name": "Press Mentions of Mr. CAP",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "NewsArticle",
          "headline": "Mr. CAP Returns to His Musical Roots",
          "datePublished": "2014-04-08",
          "author": {
            "@type": "Person",
            "name": "Andrew Dansby"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Houston Chronicle"
          }
        }
      }, {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "NewsArticle",
          "headline": "Point Blank at Numbers, 11/22/2014",
          "datePublished": "2014-11-22",
          "author": {
            "@type": "Person",
            "name": "Nathan Smith"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Houston Press"
          },
          "url": "https://www.houstonpress.com/music/point-blank-at-numbers-11-22-2014-6760363/"
        }
      }, {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "NewsArticle",
          "headline": "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
          "datePublished": "2015-04-20",
          "author": {
            "@type": "Person",
            "name": "Nathan Smith"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Houston Press"
          },
          "url": "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/"
        }
      }, {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "NewsArticle",
          "headline": "K-Rino, Point Blank & the SPC Might Still Be Rapping at Warehouse Live Right Now",
          "datePublished": "2016-10-17",
          "author": {
            "@type": "Person",
            "name": "Nathan Smith"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Houston Press"
          },
          "url": "https://www.houstonpress.com/music/k-rino-point-blank-and-the-spc-might-still-be-rapping-at-warehouse-live-right-now-7756589/"
        }
      }]
    }]
  };
  return <>
      <Helmet>
        <title>Press & Media Kit | Mr. CAP – Houston Hip-Hop Artist OPK</title>
        <meta name="description" content="Official online press kit for Mr. CAP, Houston rapper and South Park Coalition founding member. Download press assets, bio, high-res photos, and request interviews." />
        <link rel="canonical" href="https://mrcap1.com/press" />
        
        <meta property="og:title" content="Press & Media Kit | Mr. CAP – Houston Hip-Hop Artist" />
        <meta property="og:description" content="Official OPK for Mr. CAP. 30+ years in Houston hip-hop, South Park Coalition member, first Houston rapper to sell an NFT." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/press" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content="Press & Media Kit | Mr. CAP" />
        <meta name="twitter:description" content="Official OPK for Houston hip-hop artist Mr. CAP. 30+ years in the game." />
        
        <meta name="keywords" content="Mr. CAP press kit, Houston rapper OPK, South Park Coalition press, Houston hip-hop media, underground hip-hop press, Texas rapper interview, NFT rapper press kit" />
        
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
                <span className="text-foreground">Press & Media Kit</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Press &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Media Kit
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Official electronic press kit for journalists, bloggers, podcasters, and media professionals. 
                Download assets, copy-ready bios, and request interviews.
              </p>
            </div>
          </section>

          {/* Featured Article - Houston Press */}
          <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Featured Article
                  </span>
                </div>
                
                <FeaturedArticleSlideshow />
              </div>
            </div>
          </section>

          {/* Quick Facts for Journalists */}
          <section className="py-16 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  Quick Facts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {keyFacts.map((fact, index) => <div key={index} className="bg-card/50 border border-border/50 rounded-lg p-4 flex justify-between items-start">
                      <span className="text-muted-foreground font-medium">{fact.label}</span>
                      <span className="text-foreground text-right max-w-[60%]">{fact.value}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </section>

          {/* Story Angles */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                  <Mic className="w-6 h-6 text-primary" />
                  Story Angles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {storyAngles.map((angle, index) => <div key={index} className="bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
                      <angle.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-bold text-lg mb-2">{angle.title}</h3>
                      <p className="text-muted-foreground">{angle.description}</p>
                    </div>)}
                </div>
              </div>
            </div>
          </section>

          {/* Media Bios */}
          <section className="py-16 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8">Media-Ready Bios</h2>
                
                {/* Short Bio */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Short Bio (1 sentence)</h3>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <p className="text-muted-foreground leading-relaxed">{shortBio}</p>
                    <button onClick={() => navigator.clipboard.writeText(shortBio)} className="mt-4 text-sm text-primary hover:underline flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Copy to clipboard
                    </button>
                  </div>
                </div>

                {/* Full Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary">Full Bio (Feature-length)</h3>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{mediaBio}</div>
                    <button onClick={() => navigator.clipboard.writeText(mediaBio)} className="mt-4 text-sm text-primary hover:underline flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Copy to clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interview Topics */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                  <Mic className="w-6 h-6 text-primary" />
                  Interview Topics
                </h2>
                <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                  <p className="text-muted-foreground mb-6">Mr. CAP is available to discuss the following topics for podcasts, articles, and video features:</p>
                  <ul className="space-y-3">
                    {interviewTopics.map((topic, index) => <li key={index} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{topic}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Press Kit Download */}
          <section className="py-16 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <Download className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold mb-4">Download Press Assets</h2>
                <p className="text-muted-foreground mb-8">
                  Download the official press kit including high-resolution photos, biography, 
                  discography, logos, and approved media assets.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="flux" size="lg" asChild>
                    <a href="/press-kit.pdf" download>
                      <Download className="mr-2 h-5 w-5" />
                      Press Kit (PDF)
                    </a>
                  </Button>
                  <Button variant="fluxOutline" size="lg" asChild>
                    <a href="/photos.zip" download>
                      <Image className="mr-2 h-5 w-5" />
                      High-Res Photos (ZIP)
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Press Timeline */}
          <PressTimeline />

          {/* Quotes / Testimonials */}
          <section className="py-20 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">What They're Saying</h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {quotes.map((quote, index) => <div key={index} className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <Quote className="w-8 h-8 text-primary/50 mb-4" />
                    <p className="text-foreground italic mb-4">"{quote.text}"</p>
                    <p className="text-sm text-muted-foreground">— {quote.source}</p>
                  </div>)}
              </div>
            </div>
          </section>

          {/* Official Links */}
          <section className="py-20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-6 text-center">Official Links</h2>
                <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                  <div className="grid gap-3 text-center md:text-left">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Website:</span>{" "}
                      <a href="https://mrcap1.com" className="text-primary hover:underline font-medium">mrcap1.com</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Instagram:</span>{" "}
                      <a href="https://www.instagram.com/mrcapism/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@mrcapism</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">X:</span>{" "}
                      <a href="https://x.com/mrcap1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@mrcap1</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Facebook:</span>{" "}
                      <a href="https://www.facebook.com/mrcap11" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">facebook.com/mrcap11</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">YouTube:</span>{" "}
                      <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@mrcap1</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Spotify:</span>{" "}
                      <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Artist Profile</a>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">TikTok:</span>{" "}
                      <a href="https://www.tiktok.com/@mrcapism" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@mrcapism</a>
                    </p>
                  </div>
                </div>
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
                  For interview requests, press inquiries, podcast appearances, and media partnerships:
                </p>
                <div className="bg-card/50 border border-border/50 rounded-xl p-8">
                  <p className="text-lg font-medium mb-2">Press Contact</p>
                  <a href="mailto:wrecklessent@gmail.com?subject=Press Inquiry - Mr. CAP" className="text-primary hover:underline text-xl font-semibold">
                    wrecklessent@gmail.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-4">
                    Please include: Publication name, audience size, topic focus, preferred format
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Response time: 48-72 hours
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Suggested Citation */}
          <section className="py-16 bg-card/20 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-xl font-display font-bold mb-4">Suggested Citation</h2>
                <p className="text-muted-foreground mb-4">When referencing Mr. CAP in articles or academic work:</p>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                  <code className="text-sm text-foreground">
                    Mr. CAP (Cornelius A. Pratt). South Park Coalition. Houston, Texas. https://mrcap1.com
                  </code>
                  <button onClick={() => navigator.clipboard.writeText("Mr. CAP (Cornelius A. Pratt). South Park Coalition. Houston, Texas. https://mrcap1.com")} className="mt-4 text-sm text-primary hover:underline block mx-auto">
                    Copy citation
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Card */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <BookingCard variant="compact" />
            </div>
          </section>
        </main>

        <CitationBlock />
        <Footer />
      </div>
    </>;
};
export default Press;
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AnnouncementStrip from "@/components/home/AnnouncementStrip";
import ReleaseSpotlight from "@/components/home/ReleaseSpotlight";
import ProofStrip from "@/components/home/ProofStrip";
import BookingCTABand from "@/components/home/BookingCTABand";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/home/SectionDivider";
import ScrollProgressBar from "@/components/home/ScrollProgressBar";
import SpotifyLiveSection from "@/components/home/SpotifyLiveSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import LegacyStats from "@/components/home/LegacyStats";
import LegacyTimeline from "@/components/home/LegacyTimeline";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mrcap1.com/#website",
        "url": "https://mrcap1.com",
        "name": "Mr. CAP - Official Website",
        "description": "Official website of Houston hip-hop artist Mr. CAP",
        "publisher": { "@id": "https://mrcap1.com/#person" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://mrcap1.com/blog?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": ["Cornelius A. Pratt", "Mr CAP", "MrCAP"],
        "jobTitle": "Rapper, Writer, Technologist",
        "description": "Houston-born rapper, South Park Coalition original member, and creative technologist bridging hip-hop, business, and blockchain.",
        "url": "https://mrcap1.com",
        "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg",
        "sameAs": [
          "https://www.instagram.com/mrcapism/",
          "https://x.com/mrcap1",
          "https://www.facebook.com/mrcap11",
          "https://www.youtube.com/@mrcap1",
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.tiktok.com/@mrcapism",
          "https://www.wikidata.org/wiki/Q139960172"
        ],
        "knowsAbout": ["Hip-Hop Music", "Blockchain Technology", "NFTs", "South Park Coalition", "Music Production", "Digital Distribution"],
        "memberOf": {
          "@type": "MusicGroup",
          "name": "South Park Coalition",
          "foundingLocation": { "@type": "Place", "name": "Houston, Texas" }
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Houston",
          "addressRegion": "TX",
          "addressCountry": "US"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://mrcap1.com/#organization",
        "name": "CAP Distributions",
        "alternateName": "Wreckless Entertainment",
        "description": "Independent music label and distribution company founded by Mr. CAP.",
        "url": "https://mrcap1.com",
        "logo": "https://mrcap1.com/favicon.ico",
        "founder": { "@id": "https://mrcap1.com/#person" },
        "foundingLocation": { "@type": "Place", "name": "Houston, Texas" },
        "areaServed": "US",
        "sameAs": [
          "https://www.instagram.com/mrcapism/",
          "https://x.com/mrcap1",
          "https://www.facebook.com/mrcap11",
          "https://www.youtube.com/@mrcap1",
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.tiktok.com/@mrcapism",
          "https://www.wikidata.org/wiki/Q139960172"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "url": "https://mrcap1.com/booking",
          "contactType": "booking"
        }
      },
      {
        "@type": "MusicGroup",
        "@id": "https://mrcap1.com/#artist",
        "name": "Mr. CAP",
        "genre": ["Hip-Hop", "Rap", "Underground Hip-Hop", "Houston Rap", "Southern Rap"],
        "foundingLocation": { "@type": "Place", "name": "Houston, Texas" },
        "album": [
          {
            "@type": "MusicAlbum",
            "name": "The Ties That Bind Us",
            "datePublished": "2024-10-18",
            "byArtist": { "@type": "MusicGroup", "name": "South Park Coalition" },
            "numTracks": 19,
            "track": { "@type": "MusicRecording", "name": "Bet'n On Me" }
          },
          { "@type": "MusicAlbum", "name": "The Art of ISM", "datePublished": "2019", "recordLabel": "Sony Music / The Orchard", "numTracks": 11 },
          { "@type": "MusicAlbum", "name": "2 Tha Grave", "datePublished": "2011" },
          { "@type": "MusicAlbum", "name": "O.N.E. on O.N.E.", "datePublished": "2005" }
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
              "text": "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and creative technologist. He's been making music for over 30 years and became the first Houston rapper to sell a Hip Hop NFT in 2021."
            }
          },
          {
            "@type": "Question",
            "name": "What is South Park Coalition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "South Park Coalition (SPC) is a legendary hip-hop collective founded in Houston, Texas. Mr. CAP is an original member alongside artists like K-Rino, Klondike Kat, and Point Blank."
            }
          },
          {
            "@type": "Question",
            "name": "How can I book Mr. CAP for a show?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Submit a booking request through the official form at mrcap1.com/booking. Mr. CAP is available for concerts, festivals, speaking engagements, and special events across Texas and beyond."
            }
          },
          {
            "@type": "Question",
            "name": "What is Mr. CAP's latest album?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr. CAP's latest project is 'The Ties That Bind Us' (2024), a South Park Coalition group album featuring 19 tracks with the lead single 'Bet'n On Me'."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Houston Rapper & SPC Original Member</title>
        <meta name="description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <link rel="canonical" href="https://mrcap1.com" />
        <meta property="og:title" content="Mr. CAP | Houston Rapper & SPC Original Member" />
        <meta property="og:description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <meta property="og:url" content="https://mrcap1.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <meta property="og:site_name" content="Mr. CAP Legacy" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content="Mr. CAP | Houston Rapper & SPC Original Member" />
        <meta name="twitter:description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <meta name="twitter:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        {/* Preload above-the-fold visuals */}
        <link rel="preload" as="image" href="/images/mrcap-hero-bg.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <ScrollProgressBar />

      <div className="min-h-screen bg-background text-foreground">
        <AnnouncementStrip />
        <Navigation />
        <main>
          <HeroSection />
          <MarqueeStrip />
          <LegacyStats />
          <SectionDivider />
          <LegacyTimeline />
          <SectionDivider />
          <ProofStrip />
          <SectionDivider />
          <ReleaseSpotlight />
          <SectionDivider />
          <SpotifyLiveSection />
          <SectionDivider />
          <BookingCTABand />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import CitationBlock from "@/components/CitationBlock";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/home/ScrollProgressBar";

// V2 — Cinematic Editorial
import CinematicHero from "@/components/v2/CinematicHero";
import EditorialBlock from "@/components/v2/EditorialBlock";
import MagneticButton from "@/components/v2/MagneticButton";
import Marquee from "@/components/v2/Marquee";
import ReleasesRail from "@/components/v2/home/ReleasesRail";
import NewsTriptych from "@/components/v2/home/NewsTriptych";
import BookingBand from "@/components/v2/home/BookingBand";

import heroPortrait from "@/assets/cap-hero-portrait.png";
import artOfIsmHero from "@/assets/art-of-ism-hero.png";

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
          "https://www.tiktok.com/@mrcapism"
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
          "https://www.tiktok.com/@mrcapism"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "southparkcoalitionllc@gmail.com",
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
          { "@type": "MusicAlbum", "name": "The Ties That Bind Us", "datePublished": "2024-10-18", "byArtist": { "@type": "MusicGroup", "name": "South Park Coalition" }, "numTracks": 19, "track": { "@type": "MusicRecording", "name": "Bet'n On Me" } },
          { "@type": "MusicAlbum", "name": "The Art of ISM", "datePublished": "2019", "recordLabel": "Sony Music / The Orchard", "numTracks": 11 },
          { "@type": "MusicAlbum", "name": "2 Tha Grave", "datePublished": "2011" },
          { "@type": "MusicAlbum", "name": "O.N.E. on O.N.E.", "datePublished": "2005" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Who is Mr. CAP?", "acceptedAnswer": { "@type": "Answer", "text": "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, and creative technologist. He's been making music for over 30 years and became the first Houston rapper to sell a Hip Hop NFT in 2021." } },
          { "@type": "Question", "name": "What is South Park Coalition?", "acceptedAnswer": { "@type": "Answer", "text": "South Park Coalition (SPC) is a legendary hip-hop collective founded in Houston, Texas. Mr. CAP is an original member alongside artists like K-Rino, Klondike Kat, and Point Blank." } },
          { "@type": "Question", "name": "How can I book Mr. CAP for a show?", "acceptedAnswer": { "@type": "Answer", "text": "Contact southparkcoalitionllc@gmail.com for booking inquiries. Mr. CAP is available for concerts, festivals, speaking engagements, and special events across Texas and beyond." } },
          { "@type": "Question", "name": "What is Mr. CAP's latest album?", "acceptedAnswer": { "@type": "Answer", "text": "Mr. CAP's latest project is 'The Ties That Bind Us' (2024), a South Park Coalition group album featuring 19 tracks with the lead single 'Bet'n On Me'." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" }]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Houston Hip-Hop Artist, SPC Original Member & Creative Technologist</title>
        <meta name="description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <link rel="canonical" href="https://mrcap1.com" />
        <meta property="og:title" content="Mr. CAP | Houston Hip-Hop Artist, SPC Original Member & Creative Technologist" />
        <meta property="og:description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <meta property="og:url" content="https://mrcap1.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <meta property="og:site_name" content="Mr. CAP Legacy" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content="Mr. CAP | Houston Hip-Hop Artist, SPC Original Member & Creative Technologist" />
        <meta name="twitter:description" content="Official site for Mr. CAP: new music, legacy catalog, live booking, press assets, and digital-art updates." />
        <meta name="twitter:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <link rel="preload" as="image" href={heroPortrait} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <ScrollProgressBar />

      <div className="v2-surface min-h-screen font-v2sans">
        <Navigation />

        <main>
          {/* 01 — Cinematic Hero */}
          <CinematicHero
            image={heroPortrait}
            eyebrow="Mr. CAP — Houston · Since 1994"
            title={
              <>
                Three decades.<br />
                One <em className="v2-display-italic">legacy</em>.
              </>
            }
            subtitle="South Park Coalition original member. The first Houston rapper to sell a Hip-Hop NFT. Still building."
            actions={
              <>
                <MagneticButton variant="primary" href="/discography">Hear the catalog</MagneticButton>
                <MagneticButton variant="outline" href="/biography">Read the story</MagneticButton>
              </>
            }
            overlay={0.5}
          />

          {/* 02 — Marquee identity */}
          <section className="py-12 v2-surface-1 v2-hairline-b">
            <Marquee speed={50}>
              {["South Park Coalition", "Houston, TX", "Since 1994", "First Houston Hip-Hop NFT", "CAPISM Publishing", "Wreckless Entertainment"].map((t) => (
                <span key={t} className="v2-display text-v2-ink/30 text-4xl md:text-6xl tracking-tight">
                  {t} <span className="text-v2-accent">·</span>
                </span>
              ))}
            </Marquee>
          </section>

          {/* 03 — Latest releases rail */}
          <ReleasesRail />

          {/* 04 — Editorial: biography */}
          <EditorialBlock
            eyebrow="The Story"
            title={
              <>
                From the <em className="v2-display-italic">South Park</em> blocks to the blockchain.
              </>
            }
            body={
              <>
                <p>
                  Cornelius A. Pratt — known to the world as Mr. CAP — has spent over thirty years
                  shaping Houston hip-hop. As an original member of K-Rino's South Park Coalition,
                  he helped define a sound that's still being borrowed today.
                </p>
                <p>
                  In 2021 he became the first Houston rapper to sell a Hip-Hop NFT, bridging the
                  underground he came up in with the technology rewriting how artists own their
                  work.
                </p>
              </>
            }
            actions={
              <>
                <MagneticButton variant="primary" href="/biography">Full biography</MagneticButton>
                <MagneticButton variant="ghost" href="/legacy">Legacy timeline →</MagneticButton>
              </>
            }
          />

          {/* 05 — The Art of ISM feature */}
          <EditorialBlock
            className="v2-surface-1 v2-hairline-t v2-hairline-b"
            eyebrow="Featured Project"
            side="left"
            image={artOfIsmHero}
            imageAlt="The Art of ISM"
            title={
              <>
                The Art of <em className="v2-display-italic">ISM</em>.
              </>
            }
            body={
              <>
                <p>
                  An album, a book, and an NFT collection — three forms of one philosophy. Released
                  in partnership with Sony Music / The Orchard.
                </p>
              </>
            }
            actions={
              <>
                <MagneticButton variant="primary" href="/art-of-ism">Enter the world</MagneticButton>
                <MagneticButton variant="ghost" href="/nft">View NFTs →</MagneticButton>
              </>
            }
          />

          {/* 06 — News / Press / Visuals */}
          <NewsTriptych />

          {/* 07 — Booking conversion band */}
          <BookingBand />

          {/* 08 — Fan capture */}
          <section className="v2-surface px-6 md:px-12 lg:px-20 py-24 md:py-32 v2-hairline-t" id="fan-capture">
            <div className="max-w-3xl mx-auto">
              <FanCaptureBanner
                sourcePage="homepage"
                headline="Join Mr. CAP Legacy"
                subheadline="Be the first to hear new music, see new visuals, and get show alerts."
              />
            </div>
          </section>
        </main>

        <CitationBlock />
        <Footer />
      </div>
    </>
  );
};

export default Index;

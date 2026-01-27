import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Music, Newspaper, Briefcase, Film, ArrowRight } from "lucide-react";
import OPKLayout from "@/components/OPKLayout";

const opkPages = [
  {
    title: "Music & Booking OPK",
    description: "Full set, feature appearances, festivals. Book Mr. CAP for your next event.",
    icon: Music,
    href: "/opk/music",
    cta: "View Music & Booking OPK",
  },
  {
    title: "Press & Media OPK",
    description: "Media coverage, interview requests, publication features.",
    icon: Newspaper,
    href: "/opk/press",
    cta: "View Press & Media OPK",
  },
  {
    title: "Brand & Partnership OPK",
    description: "Endorsements, campaigns, product collaborations, and licensing.",
    icon: Briefcase,
    href: "/opk/brands",
    cta: "View Brand & Partnership OPK",
  },
  {
    title: "Film & Speaking OPK",
    description: "Documentary features, music supervision, speaking engagements.",
    icon: Film,
    href: "/opk/media",
    cta: "View Film & Speaking OPK",
  },
];

const OPKHub = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Official Online Press Kit (OPK) – Houston Hip-Hop Artist</title>
        <meta 
          name="description" 
          content="Official Online Press Kit for Mr. CAP, Houston hip-hop artist and South Park Coalition member. Access booking, press, brand, and media resources." 
        />
        <link rel="canonical" href="https://mrcap1.com/opk" />
        <meta property="og:title" content="Mr. CAP | Official OPK" />
        <meta property="og:description" content="Official OPK for Houston hip-hop artist Mr. CAP. Booking, press, brands, and media resources." />
        <meta property="og:url" content="https://mrcap1.com/opk" />
        <meta property="og:image" content="https://mrcap1.com/images/opk-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://mrcap1.com/images/opk-og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mr. CAP Official Online Press Kit",
            "description": "Official Online Press Kit for Mr. CAP, Houston hip-hop artist and South Park Coalition member.",
            "url": "https://mrcap1.com/opk",
            "mainEntity": {
              "@type": "Person",
              "@id": "https://mrcap1.com/#person",
              "name": "Mr. CAP",
              "alternateName": "MrCap",
              "description": "Houston hip-hop artist and member of the South Park Coalition",
              "genre": ["Hip-Hop", "Southern Hip-Hop", "Houston Rap"],
              "homeLocation": {
                "@type": "Place",
                "name": "Houston, Texas"
              },
              "memberOf": {
                "@type": "MusicGroup",
                "name": "South Park Coalition"
              },
              "sameAs": [
                "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
                "https://www.instagram.com/mrcapism",
                "https://www.youtube.com/@mrcap1",
                "https://twitter.com/mrcap1"
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
                { "@type": "ListItem", "position": 2, "name": "OPK", "item": "https://mrcap1.com/opk" }
              ]
            }
          })}
        </script>
      </Helmet>

      <OPKLayout
        title="MR. CAP — OFFICIAL OPK"
        subtitle="South Park Born. SPC Raised. Independent & Future-Focused."
        tagline="Online Press Kit"
        ctaLabel="General Inquiries"
        breadcrumb="OPK"
      >
        {/* Intro */}
        <section className="gsap-section py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="gsap-item text-lg text-muted-foreground leading-relaxed">
                Welcome to the official Online Press Kit for Mr. CAP, Houston hip-hop artist and proud member of the legendary South Park Coalition.
                <br /><br />
                Select the OPK that fits your purpose below.
              </p>
            </div>
          </div>
        </section>

        {/* OPK Navigation Grid */}
        <section className="gsap-section py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {opkPages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="gsap-item group bg-card/50 border border-border/50 rounded-2xl p-8 hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
                >
                  <page.icon className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    {page.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{page.description}</p>
                  <span className="inline-flex items-center text-primary font-medium">
                    {page.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKHub;
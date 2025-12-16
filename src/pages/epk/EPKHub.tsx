import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Music, Newspaper, Briefcase, Film, ArrowRight } from "lucide-react";
import EPKLayout from "@/components/EPKLayout";

const epkPages = [
  {
    title: "Music & Booking EPK",
    description: "Full set, feature appearances, festivals. Book Mr. CAP for your next event.",
    icon: Music,
    href: "/epk/music",
    cta: "View Music & Booking EPK",
  },
  {
    title: "Press & Media EPK",
    description: "Media coverage, interview requests, publication features.",
    icon: Newspaper,
    href: "/epk/press",
    cta: "View Press & Media EPK",
  },
  {
    title: "Brand & Partnership EPK",
    description: "Endorsements, campaigns, product collaborations, and licensing.",
    icon: Briefcase,
    href: "/epk/brands",
    cta: "View Brand & Partnership EPK",
  },
  {
    title: "Film & Speaking EPK",
    description: "Documentary features, music supervision, speaking engagements.",
    icon: Film,
    href: "/epk/media",
    cta: "View Film & Speaking EPK",
  },
];

const EPKHub = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Official Electronic Press Kit (EPK) – Houston Hip-Hop Artist</title>
        <meta 
          name="description" 
          content="Official Electronic Press Kit for Mr. CAP, Houston hip-hop artist and South Park Coalition member. Access booking, press, brand, and media resources." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk" />
        <meta property="og:title" content="Mr. CAP | Official EPK" />
        <meta property="og:description" content="Official EPK for Houston hip-hop artist Mr. CAP. Booking, press, brands, and media resources." />
        <meta property="og:url" content="https://mrcap1.com/epk" />
      </Helmet>

      <EPKLayout
        title="MR. CAP — OFFICIAL EPK"
        subtitle="South Park Born. SPC Raised. Independent & Future-Focused."
        tagline="Electronic Press Kit"
        ctaLabel="General Inquiries"
        breadcrumb="EPK"
      >
        {/* Intro */}
        <section className="gsap-section py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="gsap-item text-lg text-muted-foreground leading-relaxed">
                Welcome to the official Electronic Press Kit for Mr. CAP, Houston hip-hop artist and proud member of the legendary South Park Coalition.
                <br /><br />
                Select the EPK that fits your purpose below.
              </p>
            </div>
          </div>
        </section>

        {/* EPK Navigation Grid */}
        <section className="gsap-section py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {epkPages.map((page) => (
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
      </EPKLayout>
    </>
  );
};

export default EPKHub;
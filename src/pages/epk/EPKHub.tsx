import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Music, Newspaper, Briefcase, Film, ArrowRight } from "lucide-react";
import EPKLayout from "@/components/EPKLayout";

const epkPages = [
  {
    title: "Music & Booking",
    description: "Full set, feature appearances, festivals. Book Mr. CAP for your next event.",
    icon: Music,
    href: "/epk/music",
    cta: "View Booking EPK",
  },
  {
    title: "Press & Interviews",
    description: "Media coverage, interview requests, publication features.",
    icon: Newspaper,
    href: "/epk/press",
    cta: "View Press EPK",
  },
  {
    title: "Brand Partnerships",
    description: "Endorsements, campaigns, product collaborations, and licensing.",
    icon: Briefcase,
    href: "/epk/brands",
    cta: "View Brand EPK",
  },
  {
    title: "Film & Speaking",
    description: "Documentary features, music supervision, speaking engagements.",
    icon: Film,
    href: "/epk/media",
    cta: "View Media EPK",
  },
];

const EPKHub = () => {
  return (
    <>
      <Helmet>
        <title>Mr. CAP | Electronic Press Kit (EPK) – Houston Hip-Hop Artist</title>
        <meta 
          name="description" 
          content="Official Electronic Press Kit for Mr. CAP, Houston hip-hop artist and South Park Coalition member. Access booking, press, brand, and media resources." 
        />
        <link rel="canonical" href="https://mrcap1.com/epk" />
        <meta property="og:title" content="Mr. CAP | Electronic Press Kit (EPK)" />
        <meta property="og:description" content="Official EPK for Houston hip-hop artist Mr. CAP. Booking, press, brands, and media resources." />
        <meta property="og:url" content="https://mrcap1.com/epk" />
      </Helmet>

      <EPKLayout
        title="Electronic Press Kit"
        subtitle="South Park Born. Class of '92. Future-Focused. Access everything you need to book, feature, or partner with Mr. CAP."
        tagline="Official EPK"
        ctaLabel="General Inquiries"
        breadcrumb="EPK"
      >
        {/* EPK Navigation Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {epkPages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="group bg-card/50 border border-border/50 rounded-2xl p-8 hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
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

        {/* Quick Stats */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-display font-bold text-primary">30+</div>
                <div className="text-sm text-muted-foreground mt-1">Years in Music</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground mt-1">Studio Albums</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-primary">1st</div>
                <div className="text-sm text-muted-foreground mt-1">Houston Rap NFT</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-primary">SPC</div>
                <div className="text-sm text-muted-foreground mt-1">Original Member</div>
              </div>
            </div>
          </div>
        </section>
      </EPKLayout>
    </>
  );
};

export default EPKHub;

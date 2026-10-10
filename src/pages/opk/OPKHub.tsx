import { Link } from "react-router-dom";
import { Music, Newspaper, Briefcase, Film, ArrowRight } from "lucide-react";
import OPKLayout from "@/components/OPKLayout";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

const opkPages = [
  {
    title: "Music & Booking OPK",
    description: "Full set, feature appearances, festivals. Book Mr. CAP for your next event.",
    icon: Music,
    href: "/opk/music",
    cta: "View Music & Booking OPK",
    borderColor: "hsl(var(--primary))",
    gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.15), hsl(var(--background)))",
  },
  {
    title: "Press & Media OPK",
    description: "Media coverage, interview requests, publication features.",
    icon: Newspaper,
    href: "/opk/press",
    cta: "View Press & Media OPK",
    borderColor: "#10B981",
    gradient: "linear-gradient(210deg, #10B981, hsl(var(--background)))",
  },
  {
    title: "Brand & Partnership OPK",
    description: "Endorsements, campaigns, product collaborations, and licensing.",
    icon: Briefcase,
    href: "/opk/brands",
    cta: "View Brand & Partnership OPK",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg, #F59E0B, hsl(var(--background)))",
  },
  {
    title: "Film & Speaking OPK",
    description: "Documentary features, music supervision, speaking engagements.",
    icon: Film,
    href: "/opk/media",
    cta: "View Film & Speaking OPK",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(195deg, #8B5CF6, hsl(var(--background)))",
  },
];

const OPKHub = () => {
  const chromaItems: ChromaGridItem[] = opkPages.map((page) => ({
    title: page.title,
    subtitle: page.description,
    borderColor: page.borderColor,
    gradient: page.gradient,
    url: page.href,
    _icon: page.icon,
    _cta: page.cta,
    _href: page.href,
  }));

  return (
    <>
      <SEO entry={routeSeo("/opk")} />

      <OPKLayout
        title="MR. CAP: OFFICIAL OPK"
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
                Welcome to the official Online Press Kit for Mr. CAP, Houston hip-hop artist and proud Original Member of the South Park Coalition.
                <br /><br />
                Select the OPK that fits your purpose below.
              </p>
            </div>
          </div>
        </section>

        {/* OPK Navigation Grid */}
        <section className="gsap-section py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto" style={{ height: '500px', position: 'relative' }}>
              <ChromaGrid
                items={chromaItems}
                columns={2}
                radius={250}
                renderCard={(item) => {
                  const Icon = item._icon as React.ComponentType<{ className?: string }>;
                  return (
                    <Link
                      to={item._href as string}
                      className="flex flex-col p-8 h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon className="w-10 h-10 text-primary mb-4" />
                      <h2 className="text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors text-foreground">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">{item.subtitle}</p>
                      <span className="inline-flex items-center text-primary font-medium mt-auto">
                        {item._cta as string}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </span>
                    </Link>
                  );
                }}
              />
            </div>
          </div>
        </section>
      </OPKLayout>
    </>
  );
};

export default OPKHub;

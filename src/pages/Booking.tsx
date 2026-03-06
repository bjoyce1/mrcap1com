import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/blocks/PageHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import InfoStrip from "@/components/blocks/InfoStrip";
import CitationBlock from "@/components/blocks/CitationBlock";
import OfficialLinksBlock from "@/components/blocks/OfficialLinksBlock";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import BookingOptionsGrid from "@/components/booking/BookingOptionsGrid";
import WhyBookStrip from "@/components/booking/WhyBookStrip";
import InquiryForm from "@/components/booking/InquiryForm";
import { bookingPageData as data } from "@/content/booking";

const Booking = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "Book Mr. CAP",
      url: "https://mrcap1.com/booking",
      mainEntity: {
        "@type": "Person",
        name: "Mr. CAP",
        alternateName: "Cornelius A. Pratt",
        description: "Houston hip-hop artist, South Park Coalition member, and entrepreneur",
        sameAs: [
          "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
          "https://www.instagram.com/mrcapism/",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Booking", item: "https://mrcap1.com/booking" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Book Mr. CAP | Shows, Features, Interviews & Speaking Engagements"
        description="Book Mr. CAP for live shows, features, interviews, and speaking engagements. Based in Houston, TX and available worldwide."
        canonical="https://mrcap1.com/booking"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker={data.hero.kicker}
          title={data.hero.title}
          description={data.hero.description}
          ctas={data.hero.ctas}
        />

        <SectionIntro body={data.intro} />

        <BookingOptionsGrid items={data.options} />

        <WhyBookStrip body={data.whyBook} />

        <InfoStrip
          label={data.infoStrip.label}
          body={data.infoStrip.body}
          ctas={data.infoStrip.ctas}
        />

        <section id="inquiry-form" className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
              Submit an Inquiry
            </span>
            <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
              <InquiryForm />
            </div>
          </div>
        </section>

        <OfficialLinksBlock />

        <FAQAccordion items={data.faq} />

        <CitationBlock
          canonicalUrl={data.citation.canonicalUrl}
          description={data.citation.description}
          links={data.citation.links}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Booking;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BookingCinematicHero from "@/components/booking/BookingCinematicHero";
import SectionIntro from "@/components/blocks/SectionIntro";
import InfoStrip from "@/components/blocks/InfoStrip";
import CitationBlock from "@/components/blocks/CitationBlock";
import OfficialLinksBlock from "@/components/blocks/OfficialLinksBlock";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import BookingOptionsGrid from "@/components/booking/BookingOptionsGrid";
import WhyBookStrip from "@/components/booking/WhyBookStrip";
import InquiryForm from "@/components/booking/InquiryForm";
import CredentialsBand from "@/components/booking/CredentialsBand";
import { bookingPageData as data } from "@/content/booking";
import { routeSeo } from "@/seo/routes";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO entry={routeSeo("/booking")} />
      <Navigation />

      <main>
        <BookingCinematicHero />

        <CredentialsBand />

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
            <div className="mt-6 text-center space-y-1">
              <p className="text-sm text-muted-foreground">{data.trust.responseTime}</p>
              <p className="text-sm text-muted-foreground">
                Prefer email? Reach the team directly at{" "}
                <a href="mailto:wrecklessent@gmail.com" className="text-primary hover:underline">
                  wrecklessent@gmail.com
                </a>
              </p>
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

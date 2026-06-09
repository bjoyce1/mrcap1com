import { Helmet } from "react-helmet-async";
import { PrintfulProductGrid } from "@/components/merch/PrintfulProductGrid";
import { MerchQualitySection } from "@/components/merch/MerchQualitySection";
import { MerchNewsletterSection } from "@/components/merch/MerchNewsletterSection";
import { MerchFooter } from "@/components/merch/MerchFooter";
import Navigation from "@/components/Navigation";
import BrandStrip from "@/components/merch/BrandStrip";
import trapUniversityLogo from "@/assets/trap-university-logo.webp";

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Mr. CAP Official Store",
  url: "https://mrcap1.com/merch",
  brand: [{ "@type": "Brand", name: "Trap University" }],
  parentOrganization: {
    "@type": "Person",
    name: "Mr. CAP",
    url: "https://mrcap1.com",
  },
};

const Merch = () => {
  return (
    <>
      <Helmet>
        <title>Official Store | Mr. CAP - Trap University & More</title>
        <meta name="description" content="Shop the official Mr. CAP store. Home of Trap University streetwear: limited edition apparel, accessories, and collectibles from Houston hip-hop culture." />
        <meta property="og:title" content="Official Store | Mr. CAP" />
        <meta property="og:description" content="Shop the official Mr. CAP store. Home of Trap University streetwear and more brands from the house of CAP." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://mrcap1.com/merch" />
        <script type="application/ld+json">{JSON.stringify(storeJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
              The Official Store
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Mr. CAP <span className="text-primary">Store</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Limited drops from the house of CAP. Home of Trap University, with more brands on the way.
            </p>
          </div>
        </section>

        <BrandStrip />

        <main id="products">
          <section id="trap-university" className="pt-16">
            <div className="container mx-auto px-4 mb-10">
              <div className="flex items-center justify-center gap-4 mb-3">
                <img
                  src={trapUniversityLogo}
                  alt="Trap University"
                  className="h-14 md:h-20 w-auto invert"
                />
              </div>
              <p className="text-center text-red-200/80 tracking-[0.2em] uppercase text-sm">
                Exclusive streetwear designed for the culture. Limited drops, unlimited drip.
              </p>
            </div>

            <PrintfulProductGrid />
          </section>

          <MerchQualitySection />
          <MerchNewsletterSection />
        </main>

        <MerchFooter />
      </div>
    </>
  );
};

export default Merch;

import { Helmet } from "react-helmet-async";
import { PrintfulProductGrid } from "@/components/merch/PrintfulProductGrid";
import { MerchQualitySection } from "@/components/merch/MerchQualitySection";
import { MerchNewsletterSection } from "@/components/merch/MerchNewsletterSection";
import { MerchFooter } from "@/components/merch/MerchFooter";
import Navigation from "@/components/Navigation";
import BrandStrip from "@/components/merch/BrandStrip";
import trapUniversityLogo from "@/assets/trap-university-logo.webp";
import { motion } from "framer-motion";
import whiteHoodie from "@/assets/trap-university/white-hoodie.webp";
import leatherJacket from "@/assets/trap-university/leather-jacket.webp";
import backpack from "@/assets/trap-university/backpack.webp";

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

        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Floating product shots — desktop atmosphere */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
            <motion.img
              src={whiteHoodie}
              alt=""
              className="absolute left-[6%] top-28 w-44 rounded-2xl border border-border/60 shadow-2xl -rotate-6 animate-float"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            />
            <motion.img
              src={leatherJacket}
              alt=""
              className="absolute right-[7%] top-24 w-48 rounded-2xl border border-border/60 shadow-2xl rotate-6 animate-float"
              style={{ animationDelay: "1.2s" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
            />
            <motion.img
              src={backpack}
              alt=""
              className="absolute right-[20%] bottom-2 w-32 rounded-2xl border border-border/60 shadow-2xl -rotate-3 animate-float"
              style={{ animationDelay: "2.1s" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            />
          </div>
          {/* Candy glow behind title */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.10),transparent_70%)]"
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.span
              className="catalog-stamp mb-4 block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The Official Store · Wreckless Entertainment
            </motion.span>
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-5 leading-[1.05]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Wear the ISM.
              </motion.span>
              <motion.span
                className="block text-gradient-gold"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
              >
                Rep the Legacy.
              </motion.span>
            </h1>
            <motion.p
              className="text-muted-foreground max-w-xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Limited drops from the house of CAP. Home of Trap University, with more brands on the way.
            </motion.p>
          </div>
        </section>

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
          <BrandStrip />
          <MerchNewsletterSection />
        </main>

        <MerchFooter />
      </div>
    </>
  );
};

export default Merch;

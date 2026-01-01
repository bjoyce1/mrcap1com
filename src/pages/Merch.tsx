import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MerchHero } from "@/components/merch/MerchHero";
import { ProductGrid } from "@/components/merch/ProductGrid";
import { CartDrawer } from "@/components/merch/CartDrawer";

const Merch = () => {
  return (
    <>
      <Helmet>
        <title>Official Merch | Mr. CAP - Houston Hip-Hop Artist</title>
        <meta 
          name="description" 
          content="Shop exclusive Mr. CAP merchandise. Limited edition apparel, accessories, and collectibles from Houston's innovative hip-hop artist." 
        />
        <meta property="og:title" content="Official Merch | Mr. CAP" />
        <meta property="og:description" content="Shop exclusive Mr. CAP merchandise. Limited edition apparel, accessories, and collectibles." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://mrcap.com/merch" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        {/* Fixed cart button */}
        <div className="fixed top-24 right-6 z-50">
          <CartDrawer />
        </div>

        <main className="pt-20">
          <MerchHero />
          <ProductGrid />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Merch;

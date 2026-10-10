import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AnnouncementStrip from "@/components/home/AnnouncementStrip";
import ReleaseSpotlight from "@/components/home/ReleaseSpotlight";
import ProofStrip from "@/components/home/ProofStrip";
import BookingCTABand from "@/components/home/BookingCTABand";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/home/SectionDivider";
import ScrollProgressBar from "@/components/home/ScrollProgressBar";
import SpotifyLiveSection from "@/components/home/SpotifyLiveSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import LegacyStats from "@/components/home/LegacyStats";
import LegacyTimeline from "@/components/home/LegacyTimeline";
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

const Index = () => {
  return (
    <>
      <SEO entry={routeSeo("/")} />

      <ScrollProgressBar />

      <div className="min-h-screen bg-background text-foreground">
        <AnnouncementStrip />
        <Navigation />
        <main>
          <HeroSection />
          <MarqueeStrip />
          <LegacyStats />
          <SectionDivider />
          <LegacyTimeline />
          <SectionDivider />
          <ProofStrip />
          <SectionDivider />
          <ReleaseSpotlight />
          <SectionDivider />
          <SpotifyLiveSection />
          <SectionDivider />
          <BookingCTABand />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

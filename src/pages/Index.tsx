import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MusicSection from "@/components/MusicSection";
import SpotifySection from "@/components/SpotifySection";
import LiveSection from "@/components/LiveSection";
import PressSection from "@/components/PressSection";
import BrandSection from "@/components/BrandSection";
import VideoSection from "@/components/VideoSection";
import VenturesSection from "@/components/VenturesSection";
import NftMilestoneSection from "@/components/NftMilestoneSection";
import NftPreviewSection from "@/components/NftPreviewSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <MusicSection />
        <SpotifySection />
        <LiveSection />
        <PressSection />
        <BrandSection />
        <VideoSection />
        <VenturesSection />
        <NftMilestoneSection />
        <NftPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

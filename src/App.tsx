import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageTransition from "@/components/PageTransition";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import Index from "./pages/Index";
import About from "./pages/About";
import Music from "./pages/Music";
import Live from "./pages/Live";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Cities from "./pages/Cities";
import CityLanding from "./pages/CityLanding";
import NFTGallery from "./pages/NFTGallery";
import ArtGallery from "./pages/ArtGallery";
import Innovation from "./pages/Innovation";
import HoustonRapper from "./pages/HoustonRapper";
import SouthParkCoalition from "./pages/SouthParkCoalition";
import TexasUndergroundHipHop from "./pages/TexasUndergroundHipHop";
import WhoIsMrCap from "./pages/WhoIsMrCap";
import Discography from "./pages/Discography";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

import Booking from "./pages/Booking";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

// OPK Pages
import OPKHub from "./pages/opk/OPKHub";
import OPKMusic from "./pages/opk/OPKMusic";
import OPKPress from "./pages/opk/OPKPress";
import OPKBrands from "./pages/opk/OPKBrands";
import OPKMedia from "./pages/opk/OPKMedia";

// Self Love Installation Pages
import SelfLoveInstallation from "./pages/SelfLoveInstallation";
import SelfLoveRoom2024 from "./pages/SelfLoveRoom2024";
import SelfLoveStory from "./pages/SelfLoveStory";
import SelfLoveStoryModal from "./components/SelfLoveStoryModal";

// Merch Pages
import Merch from "./pages/Merch";

// Streaming Pages
import AlbumPage from "./pages/AlbumPage";
import TrackPage from "./pages/TrackPage";
import StickyPlayer from "./components/player/StickyPlayer";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingMascot from "./components/FloatingMascot";
import AdminLibrary from "./pages/AdminLibrary";
import AdminRoadmap from "./pages/AdminRoadmap";
import Legacy from "./pages/Legacy";
import PantiesOnMyPiano from "./pages/PantiesOnMyPiano";
import Privacy from "./pages/Privacy";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-PBL8BBQMK4";

const queryClient = new QueryClient();

const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => { window.location.href = url; }, [url]);
  return null;
};

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <>
      <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
      <ExitIntentPopup />
      <ScrollToTop />
      
      {/* Main routes - render background location if modal is open */}
      <AnimatePresence mode="wait">
        <Routes location={state?.backgroundLocation || location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/music" element={<PageTransition><Music /></PageTransition>} />
          <Route path="/live" element={<PageTransition><Live /></PageTransition>} />
          <Route path="/press" element={<PageTransition><Press /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/cities" element={<PageTransition><Cities /></PageTransition>} />
          <Route path="/city/:citySlug" element={<PageTransition><CityLanding /></PageTransition>} />
          <Route path="/nft" element={<PageTransition><NFTGallery /></PageTransition>} />
          <Route path="/art" element={<PageTransition><ArtGallery /></PageTransition>} />
          <Route path="/innovation" element={<PageTransition><Innovation /></PageTransition>} />
          <Route path="/houston-rapper-mr-cap" element={<PageTransition><HoustonRapper /></PageTransition>} />
          <Route path="/south-park-coalition-houston" element={<PageTransition><SouthParkCoalition /></PageTransition>} />
          <Route path="/texas-underground-hip-hop" element={<PageTransition><TexasUndergroundHipHop /></PageTransition>} />
          <Route path="/who-is-mr-cap" element={<PageTransition><WhoIsMrCap /></PageTransition>} />
          <Route path="/mr-cap-discography" element={<PageTransition><Discography /></PageTransition>} />
          <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
          <Route path="/links" element={<PageTransition><Links /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/admin/library" element={<PageTransition><AdminLibrary /></PageTransition>} />
          <Route path="/admin/roadmap" element={<PageTransition><AdminRoadmap /></PageTransition>} />
          <Route path="/legacy" element={<PageTransition><Legacy /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          {/* PRD Redirects: /epk → /press, /digital-art → /nft */}
          <Route path="/epk" element={<Navigate to="/press" replace />} />
          <Route path="/digital-art" element={<Navigate to="/nft" replace />} />
          {/* Release Pages */}
          <Route path="/panties-on-my-piano" element={<PageTransition><PantiesOnMyPiano /></PageTransition>} />
          {/* OPK Routes */}
          <Route path="/opk" element={<PageTransition><OPKHub /></PageTransition>} />
          <Route path="/opk/music" element={<PageTransition><OPKMusic /></PageTransition>} />
          <Route path="/opk/press" element={<PageTransition><OPKPress /></PageTransition>} />
          <Route path="/opk/brands" element={<PageTransition><OPKBrands /></PageTransition>} />
          <Route path="/opk/media" element={<PageTransition><OPKMedia /></PageTransition>} />
          {/* Legacy EPK Redirects */}
          <Route path="/epk" element={<Navigate to="/opk" replace />} />
          <Route path="/epk/music" element={<Navigate to="/opk/music" replace />} />
          <Route path="/epk/press" element={<Navigate to="/opk/press" replace />} />
          <Route path="/epk/brands" element={<Navigate to="/opk/brands" replace />} />
          <Route path="/epk/media" element={<Navigate to="/opk/media" replace />} />
          {/* Self Love Installation Routes */}
          <Route path="/self-love" element={<PageTransition><SelfLoveInstallation /></PageTransition>} />
          <Route path="/self-love/2024" element={<PageTransition><SelfLoveRoom2024 /></PageTransition>} />
          {/* Fallback for direct links to story (no modal background) */}
          <Route path="/self-love/2024/:slug" element={<PageTransition><SelfLoveStory /></PageTransition>} />
          <Route path="/self-love/2025" element={<PageTransition><div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2025 — Coming Soon</p></div></PageTransition>} />
          <Route path="/self-love/2026" element={<PageTransition><div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2026 — Coming Soon</p></div></PageTransition>} />
          {/* Merch Routes */}
          <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
          {/* Streaming Routes */}
          <Route path="/listen" element={<Navigate to="/music" replace />} />
          <Route path="/album/:albumSlug" element={<PageTransition><AlbumPage /></PageTransition>} />
          <Route path="/track/:trackSlug" element={<PageTransition><TrackPage /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {/* Modal routes - only render when there's a background location */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/self-love/2024/:slug" element={<SelfLoveStoryModal />} />
        </Routes>
      )}

      {/* Global Sticky Player */}
      <StickyPlayer />
      <MobileBottomNav />
      <FloatingMascot />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

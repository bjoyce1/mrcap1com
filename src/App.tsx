import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
import Listen from "./pages/Listen";
import AlbumPage from "./pages/AlbumPage";
import TrackPage from "./pages/TrackPage";
import StickyPlayer from "./components/player/StickyPlayer";
import AdminLibrary from "./pages/AdminLibrary";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-PBL8BBQMK4";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <>
      <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
      <ExitIntentPopup />
      <ScrollToTop />
      
      {/* Main routes - render background location if modal is open */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/music" element={<Music />} />
        <Route path="/live" element={<Live />} />
        <Route path="/press" element={<Press />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/city/:citySlug" element={<CityLanding />} />
        <Route path="/nft" element={<NFTGallery />} />
        <Route path="/art" element={<ArtGallery />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/houston-rapper-mr-cap" element={<HoustonRapper />} />
        <Route path="/south-park-coalition-houston" element={<SouthParkCoalition />} />
        <Route path="/texas-underground-hip-hop" element={<TexasUndergroundHipHop />} />
        <Route path="/who-is-mr-cap" element={<WhoIsMrCap />} />
        <Route path="/mr-cap-discography" element={<Discography />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/links" element={<Links />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/library" element={<AdminLibrary />} />
        {/* OPK Routes */}
        <Route path="/opk" element={<OPKHub />} />
        <Route path="/opk/music" element={<OPKMusic />} />
        <Route path="/opk/press" element={<OPKPress />} />
        <Route path="/opk/brands" element={<OPKBrands />} />
        <Route path="/opk/media" element={<OPKMedia />} />
        {/* Legacy EPK Redirects */}
        <Route path="/epk" element={<Navigate to="/opk" replace />} />
        <Route path="/epk/music" element={<Navigate to="/opk/music" replace />} />
        <Route path="/epk/press" element={<Navigate to="/opk/press" replace />} />
        <Route path="/epk/brands" element={<Navigate to="/opk/brands" replace />} />
        <Route path="/epk/media" element={<Navigate to="/opk/media" replace />} />
        {/* Self Love Installation Routes */}
        <Route path="/self-love" element={<SelfLoveInstallation />} />
        <Route path="/self-love/2024" element={<SelfLoveRoom2024 />} />
        {/* Fallback for direct links to story (no modal background) */}
        <Route path="/self-love/2024/:slug" element={<SelfLoveStory />} />
        <Route path="/self-love/2025" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2025 — Coming Soon</p></div>} />
        <Route path="/self-love/2026" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2026 — Coming Soon</p></div>} />
        {/* Merch Routes */}
        <Route path="/merch" element={<Merch />} />
        {/* Streaming Routes */}
        <Route path="/listen" element={<Listen />} />
        <Route path="/album/:albumSlug" element={<AlbumPage />} />
        <Route path="/track/:trackSlug" element={<TrackPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal routes - only render when there's a background location */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/self-love/2024/:slug" element={<SelfLoveStoryModal />} />
        </Routes>
      )}

      {/* Global Sticky Player */}
      <StickyPlayer />
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

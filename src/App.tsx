// ============================================================
// App.tsx — CODE-SPLIT VERSION
// Replace your current App.tsx with this file.
// Every page is lazy-loaded so only the current route's JS ships.
// ============================================================

import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";

// ── Keep these synchronous (they appear on every page) ──────
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageTransition from "@/components/PageTransition";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ScrollToTop from "@/components/ScrollToTop";
import StickyPlayer from "@/components/player/StickyPlayer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMascot from "@/components/FloatingMascot";

// ── Lazy-loaded pages ───────────────────────────────────────
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Music = lazy(() => import("./pages/Music"));
const Live = lazy(() => import("./pages/Live"));
const Press = lazy(() => import("./pages/Press"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Cities = lazy(() => import("./pages/Cities"));
const CityLanding = lazy(() => import("./pages/CityLanding"));
const NFTGallery = lazy(() => import("./pages/NFTGallery"));
const ArtGallery = lazy(() => import("./pages/ArtGallery"));
const Innovation = lazy(() => import("./pages/Innovation"));
const HoustonRapper = lazy(() => import("./pages/HoustonRapper"));
const SouthParkCoalition = lazy(() => import("./pages/SouthParkCoalition"));
const TexasUndergroundHipHop = lazy(() => import("./pages/TexasUndergroundHipHop"));
const WhoIsMrCap = lazy(() => import("./pages/WhoIsMrCap"));
const Discography = lazy(() => import("./pages/Discography"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const ForMedia = lazy(() => import("./pages/ForMedia"));
const Booking = lazy(() => import("./pages/Booking"));
const Links = lazy(() => import("./pages/Links"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OPKHub = lazy(() => import("./pages/opk/OPKHub"));
const OPKMusic = lazy(() => import("./pages/opk/OPKMusic"));
const OPKPress = lazy(() => import("./pages/opk/OPKPress"));
const OPKBrands = lazy(() => import("./pages/opk/OPKBrands"));
const OPKMedia = lazy(() => import("./pages/opk/OPKMedia"));
const SelfLoveInstallation = lazy(() => import("./pages/SelfLoveInstallation"));
const SelfLoveRoom2024 = lazy(() => import("./pages/SelfLoveRoom2024"));
const SelfLoveStory = lazy(() => import("./pages/SelfLoveStory"));
const SelfLoveStoryModal = lazy(() => import("./components/SelfLoveStoryModal"));
const Merch = lazy(() => import("./pages/Merch"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const TrackPage = lazy(() => import("./pages/TrackPage"));
const AdminLibrary = lazy(() => import("./pages/AdminLibrary"));
const AdminRoadmap = lazy(() => import("./pages/AdminRoadmap"));
const Legacy = lazy(() => import("./pages/Legacy"));
const NewReleases = lazy(() => import("./pages/NewReleases"));
const PantiesOnMyPiano = lazy(() => import("./pages/PantiesOnMyPiano"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Videos = lazy(() => import("./pages/Videos"));
const PressPost = lazy(() => import("./pages/PressPost"));
const Biography = lazy(() => import("./pages/Biography"));
const PressKit = lazy(() => import("./pages/PressKit"));
const BetOnHer = lazy(() => import("./pages/BetOnHer"));
const HoustonHipHopHistory = lazy(() => import("./pages/HoustonHipHopHistory"));
const ArtOfIsm = lazy(() => import("./pages/ArtOfIsm"));

// ── Loading fallback (matches site theme) ───────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground tracking-widest uppercase">Loading</span>
    </div>
  </div>
);

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
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={state?.backgroundLocation || location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/music" element={<PageTransition><Music /></PageTransition>} />
            <Route path="/live" element={<PageTransition><Live /></PageTransition>} />
            <Route path="/press" element={<PageTransition><Press /></PageTransition>} />
            <Route path="/press/:pressSlug" element={<PageTransition><PressPost /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
            <Route path="/cities" element={<PageTransition><Cities /></PageTransition>} />
            <Route path="/city/:citySlug" element={<PageTransition><CityLanding /></PageTransition>} />
            <Route path="/nft" element={<PageTransition><NFTGallery /></PageTransition>} />
            <Route path="/art" element={<PageTransition><ArtGallery /></PageTransition>} />
            <Route path="/innovation" element={<PageTransition><Innovation /></PageTransition>} />
            <Route path="/houston-rapper-mr-cap" element={<PageTransition><HoustonRapper /></PageTransition>} />
            <Route path="/south-park-coalition-houston" element={<Navigate to="/south-park-coalition" replace />} />
            <Route path="/south-park-coalition" element={<PageTransition><SouthParkCoalition /></PageTransition>} />
            <Route path="/texas-underground-hip-hop" element={<PageTransition><TexasUndergroundHipHop /></PageTransition>} />
            <Route path="/houston-hip-hop-history" element={<PageTransition><HoustonHipHopHistory /></PageTransition>} />
            <Route path="/who-is-mr-cap" element={<PageTransition><WhoIsMrCap /></PageTransition>} />
            <Route path="/mr-cap-discography" element={<PageTransition><Discography /></PageTransition>} />
            <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
            <Route path="/links" element={<PageTransition><Links /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
            <Route path="/admin/library" element={<PageTransition><AdminLibrary /></PageTransition>} />
            <Route path="/admin/roadmap" element={<PageTransition><AdminRoadmap /></PageTransition>} />
            <Route path="/legacy" element={<PageTransition><Legacy /></PageTransition>} />
            <Route path="/biography" element={<PageTransition><Biography /></PageTransition>} />
            <Route path="/press-kit" element={<PageTransition><PressKit /></PageTransition>} />
            <Route path="/new-releases" element={<PageTransition><NewReleases /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
            <Route path="/epk" element={<Navigate to="/press" replace />} />
            <Route path="/digital-art" element={<Navigate to="/nft" replace />} />
            <Route path="/videos" element={<PageTransition><Videos /></PageTransition>} />
            <Route path="/tour" element={<Navigate to="/live" replace />} />
            <Route path="/panties-on-my-piano" element={<PageTransition><PantiesOnMyPiano /></PageTransition>} />
            <Route path="/bet-on-her" element={<PageTransition><BetOnHer /></PageTransition>} />
            <Route path="/art-of-ism" element={<PageTransition><ArtOfIsm /></PageTransition>} />
            <Route path="/opk" element={<PageTransition><OPKHub /></PageTransition>} />
            <Route path="/opk/music" element={<PageTransition><OPKMusic /></PageTransition>} />
            <Route path="/opk/press" element={<PageTransition><OPKPress /></PageTransition>} />
            <Route path="/opk/brands" element={<PageTransition><OPKBrands /></PageTransition>} />
            <Route path="/opk/media" element={<PageTransition><OPKMedia /></PageTransition>} />
            {/* Legacy EPK Redirects */}
            <Route path="/epk/music" element={<Navigate to="/opk/music" replace />} />
            <Route path="/epk/press" element={<Navigate to="/opk/press" replace />} />
            <Route path="/epk/brands" element={<Navigate to="/opk/brands" replace />} />
            <Route path="/epk/media" element={<Navigate to="/opk/media" replace />} />
            {/* Self Love Installation Routes */}
            <Route path="/self-love" element={<PageTransition><SelfLoveInstallation /></PageTransition>} />
            <Route path="/self-love/2024" element={<PageTransition><SelfLoveRoom2024 /></PageTransition>} />
            <Route path="/self-love/2024/:slug" element={<PageTransition><SelfLoveStory /></PageTransition>} />
            <Route path="/self-love/2025" element={<PageTransition><div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2025 — Coming Soon</p></div></PageTransition>} />
            <Route path="/self-love/2026" element={<PageTransition><div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2026 — Coming Soon</p></div></PageTransition>} />
            {/* Merch & Streaming */}
            <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
            <Route path="/listen" element={<Navigate to="/music" replace />} />
            <Route path="/music/:trackSlug" element={<PageTransition><TrackPage /></PageTransition>} />
            <Route path="/albums/:albumSlug" element={<PageTransition><AlbumPage /></PageTransition>} />
            <Route path="/album/:albumSlug" element={<PageTransition><AlbumPage /></PageTransition>} />
            <Route path="/track/:trackSlug" element={<PageTransition><TrackPage /></PageTransition>} />
            <Route path="/for-media" element={<PageTransition><ForMedia /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {state?.backgroundLocation && (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/self-love/2024/:slug" element={<SelfLoveStoryModal />} />
          </Routes>
        </Suspense>
      )}

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

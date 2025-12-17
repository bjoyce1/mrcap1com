import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

// EPK Pages
import EPKHub from "./pages/epk/EPKHub";
import EPKMusic from "./pages/epk/EPKMusic";
import EPKPress from "./pages/epk/EPKPress";
import EPKBrands from "./pages/epk/EPKBrands";
import EPKMedia from "./pages/epk/EPKMedia";

// Self Love Installation Pages
import SelfLoveInstallation from "./pages/SelfLoveInstallation";
import SelfLoveRoom2024 from "./pages/SelfLoveRoom2024";
import SelfLoveStory from "./pages/SelfLoveStory";

// Google Analytics Measurement ID - Replace with actual ID when available
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
            <ScrollToTop />
            <Routes>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              {/* EPK Routes */}
              <Route path="/epk" element={<EPKHub />} />
              <Route path="/epk/music" element={<EPKMusic />} />
              <Route path="/epk/press" element={<EPKPress />} />
              <Route path="/epk/brands" element={<EPKBrands />} />
              <Route path="/epk/media" element={<EPKMedia />} />
              {/* Self Love Installation Routes */}
              <Route path="/self-love" element={<SelfLoveInstallation />} />
              <Route path="/self-love/2024" element={<SelfLoveRoom2024 />} />
              <Route path="/self-love/2024/:slug" element={<SelfLoveStory />} />
              <Route path="/self-love/2025" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2025 — Coming Soon</p></div>} />
              <Route path="/self-love/2026" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-xl">2026 — Coming Soon</p></div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

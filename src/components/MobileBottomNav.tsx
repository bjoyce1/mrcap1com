import { Link, useLocation } from "react-router-dom";
import { Home, Music, Radio, ShoppingBag, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const primaryTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/music", label: "Music", icon: Music },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/merch", label: "Merch", icon: ShoppingBag },
];

const moreLinks = [
  { to: "/who-is-mr-cap", label: "Who Is Mr. CAP?" },
  { to: "/music", label: "Catalog" },
  { to: "/mr-cap-discography", label: "Discography" },
  { to: "/legacy", label: "Legacy" },
  { to: "/press", label: "Press" },
  { to: "/blog", label: "Blog" },
  { to: "/nft", label: "NFT Gallery" },
  { to: "/innovation", label: "Tech" },
  { to: "/opk", label: "Online Press Kit" },
  { to: "/booking", label: "Booking" },
  { to: "/links", label: "Links" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { isPlayerVisible, currentTrack } = usePlayerStore();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const playerVisible = isPlayerVisible && !!currentTrack;

  const moreItems: ChromaGridItem[] = moreLinks.map((link, i) => ({
    title: link.label,
    borderColor: isActive(link.to) ? "hsl(var(--primary))" : "transparent",
    gradient: isActive(link.to)
      ? "linear-gradient(145deg, hsl(var(--primary) / 0.15), hsl(var(--card)))"
      : `linear-gradient(${145 + i * 15}deg, hsl(var(--card)), hsl(var(--background)))`,
    _to: link.to,
  }));

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 bg-card border-t border-border/50 rounded-t-2xl max-h-[60vh] overflow-y-auto overscroll-contain">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 sticky top-0 bg-card z-10">
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">More</span>
              <button onClick={() => setMoreOpen(false)} className="p-1 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div style={{ height: '340px', position: 'relative' }} className="p-3">
              <ChromaGrid
                items={moreItems}
                columns={2}
                radius={150}
                fadeOut={0}
                renderCard={(item) => (
                  <Link
                    to={item._to as string}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-colors w-full h-full",
                      isActive(item._to as string) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[65] lg:hidden",
          "bg-card/95 backdrop-blur-xl border-t border-border/50",
          "pb-[env(safe-area-inset-bottom)]",
          playerVisible && "bottom-16"
        )}
      >
        <div className="flex items-center justify-around h-16">
          {primaryTabs.map((tab) => {
            const active = isActive(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                  active ? "text-primary" : "text-muted-foreground active:text-foreground"
                )}
              >
                <tab.icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_hsl(27,96%,61%/0.5)]")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
              moreOpen ? "text-primary" : "text-muted-foreground active:text-foreground"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Clock, Circle } from "lucide-react";

type Status = "planned" | "in_progress" | "complete";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  link?: string;
  items: string[];
}

const initialRoadmap: RoadmapItem[] = [
  {
    id: "homepage-cta",
    title: "Homepage Focus & Primary CTA",
    description: "Single above-the-fold primary CTA, rotating featured module, reduced competing CTAs.",
    status: "planned",
    link: "/",
    items: [
      "Add single above-the-fold primary CTA (Listen / Watch / Book)",
      "Rotate a featured module (new drop, top track, press quote)",
      "Reduce competing CTAs above the fold",
    ],
  },
  {
    id: "listen-destination",
    title: "Turn /listen Into a Destination",
    description: "Make the listen page feel like a platform with curated playlists and social proof.",
    status: "planned",
    link: "/listen",
    items: [
      'Add "Start Here" playlist (Top 5)',
      'Add "Most Played on mrcap1.com"',
      'Add "Collector Exclusives" locked preview cards',
      "Highlight DSP support toggle",
    ],
  },
  {
    id: "contextual-copy",
    title: "Contextual Storytelling",
    description: "Short context blocks on track, album, and NFT pages to increase engagement.",
    status: "planned",
    items: [
      "Add 1–2 lines of context on track pages",
      "Add era/intent notes on album pages",
      "Add mission copy on NFT drops",
    ],
  },
  {
    id: "booking-funnel",
    title: "Booking Funnel Optimization",
    description: "Surface booking as a primary conversion path on Homepage and Press pages.",
    status: "planned",
    link: "/booking",
    items: [
      "Add Booking Card to Homepage",
      "Add Booking Card to Press Page",
      "Clarify booking types (Live / Speaking / Media)",
      'Add "Recent Performances / Credits" above booking form',
    ],
  },
  {
    id: "email-capture",
    title: "Lightweight Email Capture",
    description: "Low-friction email capture with value-driven promise.",
    status: "complete",
    items: [
      "Simple email form (no long copy)",
      "Promise early access, exclusives, or announcements",
      "Limit sends to 1–2/month",
    ],
  },
  {
    id: "internal-linking",
    title: "Internal Linking & Page Hubs",
    description: "Every major page links to /listen, /press, /booking, /nft with related links at page bottoms.",
    status: "planned",
    items: [
      "Ensure every major page links to /listen, /press, /booking, /nft",
      'Add "Related Links" blocks at page bottoms',
    ],
  },
  {
    id: "legacy-timeline",
    title: "Legacy / Timeline Page",
    description: "Definitive, authoritative career timeline surpassing Wikipedia in depth.",
    status: "complete",
    link: "/legacy",
    items: [
      "Early years & Houston roots",
      "South Park Coalition era",
      "Album releases",
      "Business ventures",
      "Documentary work",
      "Web3 / NFT phase",
    ],
  },
  {
    id: "mobile-ux",
    title: "Mobile-First Listening UX",
    description: "Optimize thumb reach, sticky player, queue drawer, and vertical clutter on mobile.",
    status: "planned",
    items: [
      "Improve thumb reach for play buttons",
      "Ensure sticky player doesn't block content",
      "Test queue drawer usability on mobile",
      "Reduce vertical clutter on track pages",
    ],
  },
  {
    id: "social-proof",
    title: "Contextual Social Proof",
    description: "Editorial-style social proof placed where it reinforces credibility naturally.",
    status: "planned",
    items: [
      "Chronicle quote near bio",
      "Houston Press quote near music",
      "Fan reaction near /listen",
    ],
  },
  {
    id: "scale-prep",
    title: "Scale Preparation (Future-Proofing)",
    description: "Architecture support for user accounts, playlists, collector tiers, paid drops, private events.",
    status: "planned",
    items: [
      "User accounts",
      "Saved playlists",
      "Collector tiers",
      "Paid drops",
      "Private events",
    ],
  },
];

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  planned: { label: "Planned", icon: Circle, className: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", icon: Clock, className: "bg-primary/20 text-primary border-primary/50" },
  complete: { label: "Complete", icon: CheckCircle2, className: "bg-green-500/20 text-green-400 border-green-500/50" },
};

const AdminRoadmap = () => {
  const [items] = useState<RoadmapItem[]>(initialRoadmap);
  const [filter, setFilter] = useState<Status | "all">("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = {
    planned: items.filter((i) => i.status === "planned").length,
    in_progress: items.filter((i) => i.status === "in_progress").length,
    complete: items.filter((i) => i.status === "complete").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Roadmap</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Platform <span className="text-gradient-orange">Roadmap</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Highest-impact improvements to mrcap1.com — listener engagement, conversion, authority, and growth.
          </p>

          {/* Status Summary */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${filter === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
              All ({items.length})
            </button>
            {(Object.keys(statusConfig) as Status[]).map((s) => {
              const config = statusConfig[s];
              return (
                <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${filter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {config.label} ({counts[s]})
                </button>
              );
            })}
          </div>

          {/* Items */}
          <div className="space-y-4">
            {filtered.map((item) => {
              const config = statusConfig[item.status];
              const StatusIcon = config.icon;
              return (
                <div key={item.id} className="bg-card/50 border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="w-5 h-5 text-primary shrink-0" />
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <Badge className={config.className}>{config.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 pl-8">{item.description}</p>
                  <ul className="pl-8 space-y-1">
                    {item.items.map((sub, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {sub}
                      </li>
                    ))}
                  </ul>
                  {item.link && (
                    <div className="pl-8 mt-4">
                      <Button variant="fluxGhost" size="sm" asChild>
                        <Link to={item.link}>Go to Page →</Link>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-12">
            This roadmap should be revisited monthly and updated as features ship.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminRoadmap;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import PageHero from "@/components/blocks/PageHero";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  category: "official" | "lyric" | "promo" | "interview" | "behind-the-scenes";
  youtubeId: string;
  thumbnail?: string;
  year?: number;
  description?: string;
  relatedRelease?: string;
}

const VIDEOS: Video[] = [
  { id: "1", title: "Limitless (Official Music Video)", category: "official", youtubeId: "limitless-music-video", year: 2024, description: "The official visual for Limitless." },
  { id: "2", title: "Dippin' Thru the Metaverse (Official Visual)", category: "official", youtubeId: "dippin-thru-metaverse", year: 2023, description: "Official visual for Dippin' Thru the Metaverse — Houston meets the digital frontier.", relatedRelease: "/music/dippin-thru-the-metaverse" },
  { id: "3", title: "Bet'n On Me (Promo Visual)", category: "promo", youtubeId: "fight-minnies-promo", year: 2024, description: "Promotional visual for the lead single from The Ties That Bind Us.", relatedRelease: "/music/betn-on-me" },
  { id: "4", title: "H-Town Fight Minnies (Promo)", category: "promo", youtubeId: "htown-fight-minnies", year: 2024 },
  { id: "5", title: "Art of ISM (NFT Promo)", category: "promo", youtubeId: "limitless-nft", year: 2024 },
];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "official", label: "Official Videos" },
  { value: "lyric", label: "Lyric Videos" },
  { value: "promo", label: "Promos" },
  { value: "interview", label: "Interviews" },
  { value: "behind-the-scenes", label: "Behind the Scenes" },
] as const;

const Videos = () => {
  const [filter, setFilter] = useState("all");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const filtered = filter === "all" ? VIDEOS : VIDEOS.filter((v) => v.category === filter);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mr. CAP Videos",
    url: "https://mrcap1.com/videos",
    itemListElement: VIDEOS.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "VideoObject", name: v.title, description: v.description || v.title },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Videos | Mr. CAP Official Music Videos, Promos & Interviews"
        description="Watch official music videos, lyric videos, promos, interviews, and behind-the-scenes content from Mr. CAP."
        canonical="https://mrcap1.com/videos"
        jsonLd={jsonLd}
      />
      <Navigation />

      <main>
        <PageHero
          kicker="Visual"
          title="Videos"
          description="Official music videos, promos, interviews, and behind-the-scenes clips."
        />

        {/* Active Video Player */}
        {activeVideo && (
          <section className="max-w-5xl mx-auto px-6 mb-8">
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border/30">
              <video
                src={`/video/${activeVideo.youtubeId}.mp4`}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-display text-foreground mt-4">{activeVideo.title}</h2>
            {activeVideo.description && (
              <p className="text-sm text-muted-foreground mt-1">{activeVideo.description}</p>
            )}
            {activeVideo.relatedRelease && (
              <Link to={activeVideo.relatedRelease} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                <Play className="w-3.5 h-3.5" /> View Release Page →
              </Link>
            )}
          </section>
        )}

        {/* Category Filter */}
        <section className="max-w-5xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  filter === c.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* Video Grid */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVideo(v)}
                className="group text-left"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-border/20 group-hover:border-primary/40 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary text-primary-foreground p-3 rounded-full">
                      <Play className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mt-2 group-hover:text-primary transition-colors">{v.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{v.category.replace("-", " ")}{v.year ? ` · ${v.year}` : ""}</p>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No videos in this category yet.</p>
          )}
        </section>

        <FanCaptureBanner
          sourcePage="videos"
          headline="Get New Visuals First"
          subheadline="Join CAP Legacy for exclusive video drops, new releases, and show alerts."
          className="mx-6 md:mx-auto max-w-5xl mb-16"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Videos;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import PageHero from "@/components/blocks/PageHero";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Loader2, Clock, Eye, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.functions.invoke('youtube-videos');
      if (error) throw error;
      if (data?.videos) setVideos(data.videos);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mr. CAP Videos",
    url: "https://mrcap1.com/videos",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "VideoObject", name: v.title, description: v.description || v.title, thumbnailUrl: v.thumbnail },
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

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Close ✕
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        )}

        <section className="max-w-6xl mx-auto px-6 pb-16">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading videos...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={fetchVideos} className="rounded-full">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="space-y-8">
              {/* Featured Video */}
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedVideo(videos[0].id)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={videos[0].thumbnail}
                    alt={videos[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
                    <h3 className="font-editorial text-2xl md:text-3xl text-foreground mb-1 line-clamp-1">
                      {videos[0].title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatViewCount(videos[0].viewCount)}</span>
                      <span>·</span>
                      <span>{formatDate(videos[0].publishedAt)}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-card/80 text-xs font-medium flex items-center gap-1 text-foreground">
                    <Clock className="w-3 h-3" />
                    {videos[0].duration}
                  </div>
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice(1).map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border/20 group-hover:border-primary/40 transition-colors">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-card/80 text-xs font-medium flex items-center gap-1 text-foreground">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViewCount(video.viewCount)}</span>
                      <span>·</span>
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No videos found.</p>
          )}

          <div className="mt-16 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border/30"
              onClick={() => window.open('https://www.youtube.com/@mrcap1', '_blank')}
            >
              <Youtube className="w-5 h-5" />
              Subscribe on YouTube
            </Button>
          </div>
        </section>

        <FanCaptureBanner
          sourcePage="videos"
          headline="Get New Visuals First"
          subheadline="Join Mr. CAP Legacy for exclusive video drops, new releases, and show alerts."
          className="mx-6 md:mx-auto max-w-5xl mb-16"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Videos;

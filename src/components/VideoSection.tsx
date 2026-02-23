import { useState, useEffect } from "react";
import { Play, Youtube, Film, Loader2, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

const VideoSection = () => {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section id="video" className="section-spacing relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <ScrollReveal width="100%">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-primary" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                Visual Content
              </span>
            </div>
            <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Video <span className="text-gradient-gold">Gallery</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-2xl text-balance">
              See Mr. CAP in motion — from official music videos to live performance clips
              and documentary appearances.
            </p>
          </div>
        </ScrollReveal>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
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
          <div className="space-y-6">
            {/* Featured video */}
            <ScrollReveal width="100%">
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer glass-hover"
                onClick={() => setSelectedVideo(videos[0].id)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={videos[0].thumbnail}
                    alt={videos[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Enhanced hover overlay with info */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass w-20 h-20 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 text-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Info overlay on hover */}
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
                  <div className="absolute top-4 right-4 px-2 py-1 rounded glass text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {videos[0].duration}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Smaller grid with enhanced hover */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.slice(1, 7).map((video, index) => (
                <ScrollReveal key={video.id} width="100%" delay={0.1 * index}>
                  <div
                    className="group relative rounded-xl overflow-hidden cursor-pointer glass-hover"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay with play button + info */}
                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors duration-300" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="glass w-14 h-14 rounded-full flex items-center justify-center mb-2">
                          <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
                        </div>
                        <span className="text-xs text-foreground/80 font-medium">Watch Now</span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded glass text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors text-sm">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViewCount(video.viewCount)}</span>
                        <span>·</span>
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}

        <ScrollReveal width="100%">
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="hero"
              size="lg"
              className="rounded-full px-8"
              onClick={() => window.open('https://www.youtube.com/@mrcap1', '_blank')}
            >
              <Youtube className="w-5 h-5" />
              Subscribe on YouTube
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-white/10">
              <Film className="w-5 h-5" />
              Request B-Roll / Clean Footage
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VideoSection;

import { useState, useEffect } from "react";
import { Play, Youtube, Film, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
      
      if (data?.videos) {
        setVideos(data.videos);
      }
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
    <section id="video" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Visual Content
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Video <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            See Mr. CAP in motion — from official music videos to live performance clips 
            and documentary appearances.
          </p>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 z-50 glass flex items-center justify-center p-4"
            style={{ background: 'hsl(0 0% 0% / 0.85)', backdropFilter: 'blur(24px)' }}
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl aspect-video glass rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_hsl(43,91%,61%,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                Close ✕
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading videos...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchVideos}>
              Try Again
            </Button>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                className="group relative rounded-2xl overflow-hidden bg-card cursor-pointer glass border border-white/5 hover:border-primary/30 hover:shadow-[0_0_40px_hsl(43,91%,61%,0.1)] transition-all duration-300"
                onClick={() => setSelectedVideo(video.id)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/90 text-xs font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatViewCount(video.viewCount)}</span>
                    <span>•</span>
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}

        {/* YouTube CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => window.open('https://www.youtube.com/@mrcap1', '_blank')}
          >
            <Youtube className="w-5 h-5" />
            Subscribe on YouTube
          </Button>
          <Button variant="outline" size="lg">
            <Film className="w-5 h-5" />
            Request B-Roll / Clean Footage
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

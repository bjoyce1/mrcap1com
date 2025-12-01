import { Play, Youtube, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoSection = () => {
  const videos = [
    { title: '"Bet\'n On Me" Official Video', type: "Music Video", duration: "4:32" },
    { title: "Live at SPC Anniversary Show", type: "Performance", duration: "12:45" },
    { title: "Behind The Scenes: Studio Session", type: "BTS", duration: "8:20" },
  ];

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

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative aspect-video rounded-2xl border border-border overflow-hidden bg-card cursor-pointer hover:border-primary/50 transition-all"
            >
              {/* Placeholder Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-cap-gray" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:bg-primary/40 group-hover:scale-110 transition-all">
                  <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                <p className="font-display text-lg text-foreground">{video.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{video.type}</span>
                  <span>•</span>
                  <span>{video.duration}</span>
                </div>
              </div>

              {/* Corner Badge */}
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
                  <Film className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg">
            <Youtube className="w-5 h-5" />
            Watch Full Playlist on YouTube
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

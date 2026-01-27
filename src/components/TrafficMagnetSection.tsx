import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, FileText, Video, BookOpen, Volume2, VolumeX } from "lucide-react";
import betnOnMe from "@/assets/betn-on-me.png";

const TrafficMagnetSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-20 border-t border-border/50 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.25em] uppercase text-primary mb-4">
            Exclusive Access
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Get Closer to the Music
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Free track previews, exclusive content, and behind-the-scenes access
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Free Track Player */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all group">
            <div className="relative mb-4">
              <img
                src={betnOnMe}
                alt="Bet'n On Me - Exclusive Preview"
                className="w-full aspect-square object-cover rounded-xl"
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  )}
                </div>
              </button>
              {/* Progress bar */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                🎧 Free Preview
              </span>
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            
            <h3 className="font-display font-bold text-lg mb-1">Bet'n On Me</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Lead single from "The Ties That Bind Us"
            </p>
            
            <Button
              variant="flux"
              size="sm"
              className="w-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Playing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Preview
                </>
              )}
            </Button>
            
            <audio ref={audioRef} src="/audio/betn-on-me.mp3" preload="metadata" />
          </div>

          {/* OPK Download */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
              <div className="text-center">
                <FileText className="w-16 h-16 text-primary mx-auto mb-3" />
                <span className="text-sm font-medium text-muted-foreground">Online Press Kit</span>
              </div>
            </div>
            
            <span className="inline-block text-xs text-primary font-medium uppercase tracking-wider mb-2">
              📄 For Media & Promoters
            </span>
            
            <h3 className="font-display font-bold text-lg mb-1">Download OPK</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bio, photos, tech rider & booking info
            </p>
            
            <Button variant="fluxOutline" size="sm" className="w-full" asChild>
              <Link to="/press">
                <Download className="w-4 h-4 mr-2" />
                Get Press Kit
              </Link>
            </Button>
          </div>

          {/* Exclusive Video */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-flux-accent/20 to-flux-accent/5 flex items-center justify-center mb-4 overflow-hidden relative">
              <video
                src="/video/limitless-nft.mp4"
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Video className="w-12 h-12 text-white/80" />
              </div>
            </div>
            
            <span className="inline-block text-xs text-flux-accent font-medium uppercase tracking-wider mb-2">
              🎥 NFT Art Video
            </span>
            
            <h3 className="font-display font-bold text-lg mb-1">Limitless NFT</h3>
            <p className="text-sm text-muted-foreground mb-4">
              First Houston Hip-Hop NFT ever sold
            </p>
            
            <Button variant="fluxOutline" size="sm" className="w-full" asChild>
              <Link to="/nft">
                <Play className="w-4 h-4 mr-2" />
                Watch Full Video
              </Link>
            </Button>
          </div>

          {/* Bet'n On Me Story */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
              <img
                src="/images/musical-roots-blog.jpg"
                alt="Mr. CAP Returns to His Musical Roots - Houston Chronicle"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            <span className="inline-block text-xs text-amber-400 font-medium uppercase tracking-wider mb-2">
              ✍️ Liner Notes
            </span>
            
            <h3 className="font-display font-bold text-lg mb-1">Mr. CAP Returns to His Musical Roots</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Houston Chronicle on Mr. CAP's legacy
            </p>
            
            <Button variant="fluxOutline" size="sm" className="w-full" asChild>
              <Link to="/blog/mr-cap-returns-to-his-musical-roots">
                <BookOpen className="w-4 h-4 mr-2" />
                Read the Story
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficMagnetSection;

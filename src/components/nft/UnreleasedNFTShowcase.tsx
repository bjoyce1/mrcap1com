import { useRef, useState } from "react";
import { Play, Pause, Sparkles, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UnreleasedNFTShowcase = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden border-b border-white/5">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-widest text-[10px] px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Coming Soon
            </Badge>
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 uppercase tracking-widest text-[10px] px-3 py-1">
              Un-Minted
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
            H-Town Fight Minnies
          </h2>
          <p className="text-muted-foreground max-w-xl font-light leading-relaxed">
            An unreleased NFT featuring Mr. CAP's character for the upcoming
            <span className="text-primary font-medium"> H-Town Fight Minnies </span>
            video game — where Houston culture meets the blockchain.
          </p>
        </div>

        {/* Video card */}
        <div className="max-w-3xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 
                        shadow-[0_0_60px_hsl(var(--primary)/0.08)] group cursor-pointer"
            onClick={togglePlay}
          >
            {/* Aspect wrapper */}
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                src="/video/htown-fight-minnies.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}

              {/* Pause indicator */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Pause className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Info bar */}
            <div className="p-4 md:p-5 bg-[hsl(220_14%_8%)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Mr. CAP Fight Minnie</p>
                  <p className="text-xs text-muted-foreground">Video Game Character NFT · Unreleased</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-white/10 bg-white/[0.03]">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Awaiting Mint
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnreleasedNFTShowcase;

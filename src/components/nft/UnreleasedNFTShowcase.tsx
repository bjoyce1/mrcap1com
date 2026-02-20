import { useRef, useState, useEffect } from "react";
import { Play, Pause, Sparkles, Gamepad2, Clock, Swords, Zap, Shield, Wind, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MINT_DATE = new Date("2025-09-15T18:00:00Z");

const CHARACTER_STATS = [
  { label: "Power", value: 88, icon: Flame, color: "bg-destructive" },
  { label: "Speed", value: 75, icon: Wind, color: "bg-accent" },
  { label: "Defense", value: 70, icon: Shield, color: "bg-primary" },
  { label: "Combo", value: 92, icon: Zap, color: "bg-yellow-500" },
  { label: "Finisher", value: 95, icon: Swords, color: "bg-destructive" },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

const UnreleasedNFTShowcase = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const countdown = useCountdown(MINT_DATE);

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
    <section className="py-16 md:py-24 relative overflow-hidden border-b border-white/5 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Background promo video */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          src="/video/fight-minnies-promo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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

        {/* Countdown Timer */}
        <div className="max-w-md mx-auto mb-10">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                {countdown.expired ? "Mint Window Open" : "Estimated Mint Date"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              September 15, 2025 · 6:00 PM UTC
            </p>
            {!countdown.expired ? (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: countdown.days, label: "Days" },
                  { val: countdown.hours, label: "Hrs" },
                  { val: countdown.minutes, label: "Min" },
                  { val: countdown.seconds, label: "Sec" },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-display font-bold text-foreground tabular-nums">
                      {String(unit.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg font-semibold text-accent">Minting Now 🔥</p>
            )}
          </div>
        </div>

        {/* Two-column: Lore + Stats (left) | Video (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left — Character Lore + Stats */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 text-left">
            <h3 className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">Character Lore</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
              Born in the trenches of Houston's Southside, <span className="text-foreground font-medium">Mr. CAP</span> rose from the underground rap scene to become an unstoppable force. Known for his razor-sharp wit and cold-blooded bars, he channels that same energy into the ring.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
              In <span className="text-primary font-medium">H-Town Fight Minnies</span>, Mr. CAP fights with the spirit of Houston — screwed-up combos, chopped-up counters, and a flow that keeps opponents guessing. His signature move, <span className="text-accent font-medium italic">"The Cap Check"</span>, is a devastating finisher that leaves no room for pretenders.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full ring-1 ring-primary/20 bg-primary/5 text-primary">Southside Houston</span>
              <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full ring-1 ring-accent/20 bg-accent/5 text-accent">Street Fighter</span>
              <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full ring-1 ring-destructive/20 bg-destructive/5 text-destructive">No Cap Zone</span>
            </div>

            {/* Fighter Stats */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">Fighter Stats</h4>
              <div className="space-y-3">
                {CHARACTER_STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-8 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-left font-medium">{stat.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stat.color} transition-all duration-1000`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-foreground font-semibold w-8 text-right">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Video card */}
          <div
            className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 
                        shadow-[0_0_60px_hsl(var(--primary)/0.08)] group cursor-pointer self-stretch flex flex-col"
            onClick={togglePlay}
          >
            {/* Aspect wrapper */}
            <div className="relative flex-1 min-h-[300px] bg-black">
              <video
                ref={videoRef}
                src="/video/htown-fight-minnies.mp4"
                className="w-full h-full object-cover absolute inset-0"
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
            <div className="p-4 md:p-5 bg-[hsl(220,14%,8%)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

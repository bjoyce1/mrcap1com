import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Video, BookOpen, Volume2, VolumeX, ShoppingBag } from "lucide-react";
import betnOnMe from "@/assets/betn-on-me.png";
import opkCover from "@/assets/opk-cover.png";

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
    if (isPlaying) { audio.pause(); } else { audio.play().catch(() => setIsPlaying(false)); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="section-spacing relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.25em] uppercase text-primary mb-4">
            Exclusive Access
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl mb-4">
            Get Closer to the Music
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-balance">
            Free track previews, exclusive content, and behind-the-scenes access
          </p>
        </div>

        {/* 2-column editorial layout: Featured + Sidebar */}
        <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {/* Featured — Free Track Player (larger) */}
          <div className="lg:col-span-3 glass-hover rounded-2xl p-6 md:p-8 group">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="relative">
                <img
                  src={betnOnMe}
                  alt="Bet'n On Me - Exclusive Preview"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-primary-foreground" />
                    ) : (
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    )}
                  </div>
                </button>
                {/* Progress bar */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    🎧 Free Preview
                  </span>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                
                <h3 className="font-editorial text-2xl md:text-3xl mb-2">Bet'n On Me</h3>
                <p className="text-sm text-muted-foreground mb-6 text-balance">
                  Lead single from "The Ties That Bind Us" — a grown-man anthem about self-belief, 
                  resilience, and staying the course.
                </p>
                
                <Button variant="flux" className="w-full" onClick={togglePlay}>
                  {isPlaying ? (
                    <><Pause className="w-4 h-4 mr-2" /> Playing...</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" /> Play Preview</>
                  )}
                </Button>
              </div>
            </div>
            <audio ref={audioRef} src="/audio/betn-on-me.mp3" preload="metadata" />
          </div>

          {/* Sidebar — Stacked smaller cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* OPK Download */}
            <div className="glass-hover rounded-2xl p-5 flex-1">
              <div className="flex gap-4 items-center">
                <img src={opkCover} alt="Mr. CAP Online Press Kit" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                    📄 For Media
                  </span>
                  <h3 className="font-editorial text-lg mt-1">Download OPK</h3>
                  <p className="text-xs text-muted-foreground mt-1">Bio, photos & booking info</p>
                </div>
              </div>
              <Button variant="fluxOutline" size="sm" className="w-full mt-4" asChild>
                <Link to="/press"><Download className="w-4 h-4 mr-2" /> Get Press Kit</Link>
              </Button>
            </div>

            {/* Exclusive Video */}
            <div className="glass-hover rounded-2xl p-5 flex-1">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                  <video src="/video/limitless-nft.mp4" className="w-full h-full object-cover" muted loop playsInline autoPlay />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white/80" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-cap-gold font-medium uppercase tracking-wider">
                    🎥 NFT Art
                  </span>
                  <h3 className="font-editorial text-lg mt-1">Limitless NFT</h3>
                  <p className="text-xs text-muted-foreground mt-1">First Houston Hip-Hop NFT</p>
                </div>
              </div>
              <Button variant="fluxOutline" size="sm" className="w-full mt-4" asChild>
                <a href="https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353" target="_blank" rel="noopener noreferrer"><ShoppingBag className="w-4 h-4 mr-2" /> Buy NFT on OpenSea</a>
              </Button>
            </div>

            {/* Blog Story */}
            <div className="glass-hover rounded-2xl p-5 flex-1">
              <div className="flex gap-4 items-center">
                <img
                  src="/images/musical-roots-blog.jpg"
                  alt="Mr. CAP Returns to His Musical Roots"
                  className="w-20 h-20 rounded-xl object-cover object-top shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                    ✍️ Press
                  </span>
                  <h3 className="font-editorial text-lg mt-1 line-clamp-1">Musical Roots</h3>
                  <p className="text-xs text-muted-foreground mt-1">Houston Chronicle feature</p>
                </div>
              </div>
              <Button variant="fluxOutline" size="sm" className="w-full mt-4" asChild>
                <Link to="/blog/mr-cap-returns-to-his-musical-roots"><BookOpen className="w-4 h-4 mr-2" /> Read Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficMagnetSection;
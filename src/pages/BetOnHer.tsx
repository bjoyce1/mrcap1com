import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Diamond, Mail, Download, Share2, ExternalLink, Instagram, Twitter, Youtube, Music, ChevronDown } from "lucide-react";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shareMusic } from "@/lib/shareTrack";
import ShareButtons from "@/components/music/ShareButtons";

const COVER_ART_URL = "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/bet-on-her/Bet%20On%20Her%20(cover%20art).png";
const AUDIO_URL = `https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/bet-on-her/Bet%20On%20Her%20(Master).wav`;
const NFT_URL = "https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812144842719625316";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.197C19.1.076 18.48.042 17.87.015c-.072-.003-.144-.009-.216-.014H6.35c-.036.003-.072.006-.108.008C5.6.03 4.96.065 4.33.197c-.9.19-1.68.6-2.32 1.234-.49.49-.85 1.07-1.08 1.73A7.948 7.948 0 00.56 5.04C.53 5.56.506 6.08.5 6.6v10.8c.006.52.03 1.04.06 1.56.039.66.139 1.3.38 1.92.3.77.76 1.41 1.38 1.93.62.52 1.33.86 2.12 1.03.5.11 1.01.17 1.53.2.62.03 1.24.06 1.86.06h10.14c.62 0 1.24-.03 1.86-.06.52-.03 1.03-.09 1.53-.2.79-.17 1.5-.51 2.12-1.03.62-.52 1.08-1.16 1.38-1.93.24-.62.34-1.26.38-1.92.03-.52.054-1.04.06-1.56V6.6c-.006-.16-.012-.32-.016-.476zM17.47 12.17l-5.58 2.41c-.16.07-.35.1-.53.1-.18 0-.35-.04-.5-.12a1 1 0 01-.55-.91V7.78c0-.35.2-.67.5-.85.33-.18.72-.18 1.04 0l5.58 2.41c.36.15.58.5.58.88 0 .4-.22.74-.54.95z"/></svg>
);

export default function BetOnHer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setCurrentTime(ct);
    setDuration(dur);
    setProgress((ct / dur) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const scrollToPlayer = () => {
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = () => {
    document.getElementById("share-release")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const socialLinks = [
    { icon: <SpotifyIcon />, label: "Spotify", href: "https://open.spotify.com/artist/5dHSbFkFHOhpGwBcKyKdz9" },
    { icon: <AppleMusicIcon />, label: "Apple Music", href: "https://music.apple.com/us/artist/mr-cap/299322917" },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "https://www.youtube.com/@mrcap1" },
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "https://instagram.com/mrcap1" },
    { icon: <Twitter className="w-6 h-6" />, label: "X / Twitter", href: "https://x.com/mrcap1" },
  ];

  return (
    <>
      <SEO
        title="Bet On Her – Mr. CAP ft. Billy Cook | Official Release"
        description="Stream Bet On Her by Mr. CAP ft. Billy Cook. Includes exclusive NFT drop and official release content."
        canonical="https://mrcap1.com/bet-on-her"
        ogImage={COVER_ART_URL}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: "Bet On Her",
          byArtist: { "@type": "MusicGroup", name: "Mr. CAP" },
          featuredArtist: { "@type": "MusicGroup", name: "Billy Cook" },
          datePublished: "2026-03-17",
          genre: ["Hip-Hop", "Rap"],
          description: "Bet On Her is a high-stakes hip-hop anthem by Mr. CAP featuring Billy Cook, blending luxury Vegas vibes with themes of loyalty and value.",
          image: COVER_ART_URL,
          url: "https://mrcap1.com/bet-on-her",
          publisher: { "@type": "Organization", name: "Ciddy Boi Music" },
          offers: {
            "@type": "Offer",
            url: "https://mrcap1.com/bet-on-her",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <Navigation />
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src={COVER_ART_URL}
            alt="Bet On Her cover art"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </motion.div>

        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-xs md:text-sm tracking-[0.35em] uppercase text-amber-400/80 mb-4 font-medium"
          >
            New Single
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-[Playfair_Display] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 leading-[0.9]"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(255,215,0,0.3))",
            }}
          >
            Bet On Her
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-white/70 mb-10 tracking-wide"
          >
            Mr. CAP ft. Billy Cook
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={scrollToPlayer}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3.5 rounded-full font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              <Play className="w-4 h-4" /> Play Now
            </button>
            <a
              href={NFT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 border border-amber-500/40 text-amber-400 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-amber-500/10 transition-all"
            >
              <Diamond className="w-4 h-4" /> View NFT
            </a>
            <button
              onClick={() => document.getElementById("fan-capture")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2.5 border border-white/20 text-white/80 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white/5 transition-all"
            >
              <Mail className="w-4 h-4" /> Join the Legacy
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-6 h-6 text-amber-400/50 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════ PLAYER ═══════════════ */}
      <section ref={playerRef} className="relative py-24 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-amber-950/5 to-black pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <img
                src={COVER_ART_URL}
                alt="Bet On Her"
                className="w-28 h-28 rounded-xl object-cover shadow-xl shadow-amber-500/10 border border-white/10"
                loading="lazy"
              />
              <div className="text-center sm:text-left">
                <h2 className="font-[Playfair_Display] text-2xl md:text-3xl text-white font-semibold">Bet On Her</h2>
                <p className="text-white/50 text-sm mt-1">Mr. CAP ft. Billy Cook</p>
                <p className="text-amber-500/70 text-xs mt-2 tracking-wide">
                  Produced by C.U.S.H (Cap's Underground Smash Hits)
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div
                className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-amber-500/50" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/30">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-black flex items-center justify-center hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <a
                href={AUDIO_URL}
                download="Bet-On-Her-MrCAP.wav"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-[Playfair_Display] text-4xl md:text-5xl font-bold text-white mb-8">
              The Story
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              "Bet On Her" is a high-stakes anthem about recognizing real value in a world full of illusions. Inspired by the energy of Las Vegas, Mr. CAP flips the concept of gambling into a metaphor for relationships, loyalty, and choosing right. With silky vocals from Houston legend Billy Cook, the record blends cinematic production with street-level storytelling — a sonic bet that pays out every time.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              "Bet On Her" explores themes of loyalty, discernment, and recognizing real value in a world driven by illusion. With polished production by Ciddy Boi Music, the track stands as both a musical statement and a mindset — encouraging listeners to invest in what truly matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PRESS RELEASE ═══════════════ */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 md:p-12"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-amber-500/50 mb-2 font-medium">For Immediate Release</p>
            <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              Mr. CAP Releases "Bet On Her" Featuring Billy Cook — A High-Stakes Anthem Blending Houston Hip-Hop with Luxury Casino Energy
            </h2>
            <p className="text-amber-500/60 text-xs mb-8 tracking-wide">Houston, TX — March 17, 2026</p>

            <div className="space-y-5 text-white/55 text-[15px] leading-relaxed">
              <p>
                Houston hip-hop veteran Mr. CAP returns with a powerful new single, "Bet On Her," featuring acclaimed vocalist Billy Cook. The release delivers a cinematic experience inspired by the high-stakes world of Las Vegas, combining smooth melodies with street-level authenticity.
              </p>
              <p>
                Accompanying the release is an exclusive NFT collaboration with digital artist Ali Sabet, marking another step in Mr. CAP's continued innovation at the intersection of music and blockchain technology. The NFT collection provides fans with a unique opportunity to own a piece of the release while engaging with the evolving digital art landscape.
              </p>
              <p>
                With over three decades in the game and a legacy rooted in the South Park Coalition, Mr. CAP continues to push boundaries, bridging traditional hip-hop culture with forward-thinking digital strategy.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 space-y-3 text-xs text-white/30">
              <p>
                <span className="text-white/50">Press & Booking:</span>{" "}
                <a href="https://bookspc.com/artists/mr-cap" target="_blank" rel="noopener noreferrer" className="text-amber-500/60 hover:text-amber-400 transition-colors">
                  bookspc.com/artists/mr-cap
                </a>
              </p>
              <p>
                <span className="text-white/50">Follow:</span>{" "}
                <a href="https://instagram.com/mrcapism" target="_blank" rel="noopener noreferrer" className="text-amber-500/60 hover:text-amber-400 transition-colors">@mrcapism</a>
                {" · "}
                <a href="https://x.com/mrcap1" target="_blank" rel="noopener noreferrer" className="text-amber-500/60 hover:text-amber-400 transition-colors">@mrcap1</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ NFT DROP ═══════════════ */}
      <section className="relative py-24 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="font-[Playfair_Display] text-4xl md:text-5xl font-bold text-white mb-4">
              Own The Moment
            </h2>
            <p className="text-white/50 text-lg">Exclusive NFT collaboration with Ali Sabet</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-rose-500/5 transition-all duration-700 pointer-events-none" />
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-square">
                <img
                  src={COVER_ART_URL}
                  alt="Bet On Her NFT"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 hidden md:block" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-xs tracking-[0.3em] uppercase text-amber-400/70 mb-3">Limited Edition</p>
                <h3 className="font-[Playfair_Display] text-2xl md:text-3xl text-white font-semibold mb-4">
                  Bet On Her — Digital Collectible
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  Own a piece of the legacy. This exclusive NFT pairs Mr. CAP's music with original visual art by Ali Sabet, merging hip-hop culture with the digital art movement.
                </p>
                <a
                  href={NFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3 rounded-full font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all w-fit shadow-lg shadow-amber-500/20"
                >
                  <Diamond className="w-4 h-4" /> View Collection
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ LYRICS PREVIEW ═══════════════ */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-amber-950/20 to-amber-900/10 border border-amber-500/15 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Subtle paper texture effect */}
              <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
              />
              <Music className="w-5 h-5 text-amber-500/40 mb-6" />
              <blockquote className="font-[Playfair_Display] text-xl md:text-2xl text-white/80 italic leading-relaxed space-y-3">
                <p>"Ok baby body's insane she dape like that cocaine</p>
                <p>Million dollar campaign toast that with that champagne..."</p>
              </blockquote>
              <p className="text-amber-500/50 text-xs mt-8 tracking-wider uppercase">— Bet On Her, Verse 1</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CREDITS ═══════════════ */}
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-[Playfair_Display] text-3xl font-bold text-white mb-8">Credits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12">
              {[
                { role: "Artist", name: "Mr. CAP" },
                { role: "Featuring", name: "Billy Cook" },
                { role: "Production", name: "C.U.S.H" },
                { role: "Label", name: "Ciddy Boi Music" },
              ].map((c) => (
                <div key={c.role} className="flex items-baseline gap-3">
                  <span className="text-[11px] text-amber-500/50 uppercase tracking-widest min-w-[90px]">{c.role}</span>
                  <span className="text-white/80 text-sm">{c.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SHARE ═══════════════ */}
      <section className="relative py-16 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h3 className="text-xs tracking-[0.3em] uppercase text-amber-500/50 mb-4 text-center">Share This Release</h3>
            <div className="flex justify-center">
              <ShareButtons title="Bet On Her" artist="Mr. CAP ft. Billy Cook" slug="bet-on-her" type="track" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FAN CAPTURE ═══════════════ */}
      <section id="fan-capture" className="relative py-24 bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <FanCaptureBanner
            sourcePage="bet-on-her"
            headline="Join The Legacy"
            subheadline="Be first to access music, NFTs, and unreleased content."
          />
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF / LINKS ═══════════════ */}
      <section className="relative py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-8">Listen & Follow</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-amber-400 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

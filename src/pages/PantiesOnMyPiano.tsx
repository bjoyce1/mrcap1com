import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Play, Pause, Lock, Wallet, Mail, Send, MessageCircle,
  Share2, Copy, ExternalLink, ChevronRight, Music, Sparkles,
  Timer, Diamond, Crown, Star, X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerStore } from "@/stores/playerStore";
import { useAudioAnalyzerStore } from "@/stores/audioAnalyzerStore";

import coverStandard from "@/assets/pomp-standard.png";
import coverStudio from "@/assets/pomp-studio.png";
import coverDeluxe from "@/assets/pomp-deluxe.png";

/* ─── Constants ─── */
const COVERS = [
  { src: coverStandard, label: "Standard", sub: "Minimal White Luxury" },
  { src: coverStudio, label: "Studio", sub: "Grungy Modern Studio" },
  { src: coverDeluxe, label: "Deluxe", sub: "Black & Red Inverted" },
];

const MINT_DATE = new Date("2025-08-15T18:00:00Z");
const MORPH_INTERVAL = 6000;

const NFT_TIERS = [
  {
    name: "Standard Edition",
    supply: 500,
    icon: Star,
    color: "from-zinc-400 to-zinc-600",
    border: "border-zinc-500/30",
    features: ["WAV Download", "Standard Cover NFT", "Early Access to Future Drops"],
    coverIdx: 0,
  },
  {
    name: "Deluxe Edition",
    supply: 100,
    icon: Diamond,
    color: "from-red-500 to-rose-700",
    border: "border-red-500/30",
    features: ["Alternate Cover NFT", "\"After Dark\" Version Audio", "Behind-the-Scenes Commentary"],
    coverIdx: 2,
  },
  {
    name: "Studio Session",
    supply: 25,
    icon: Crown,
    color: "from-amber-400 to-yellow-600",
    border: "border-amber-500/30",
    features: ["Full Stems Pack", "Private Listening Session", "Signed Digital Artwork"],
    coverIdx: 1,
  },
];

/* ─── Countdown Hook ─── */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: diff <= 0,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ─── Audio-Reactive Waveform Visualizer ─── */
const ReactiveWaveform = ({ barCount = 16, className = "", barClassName = "" }: { barCount?: number; className?: string; barClassName?: string }) => {
  const frequencyData = useAudioAnalyzerStore((s) => s.frequencyData);

  // Sample `barCount` bars evenly from the frequency data
  const bars = useMemo(() => {
    if (!frequencyData.length) return Array(barCount).fill(0);
    const step = Math.max(1, Math.floor(frequencyData.length / barCount));
    return Array.from({ length: barCount }, (_, i) => {
      const idx = Math.min(i * step, frequencyData.length - 1);
      return frequencyData[idx] ?? 0;
    });
  }, [frequencyData, barCount]);

  return (
    <div className={`flex items-end justify-center gap-[3px] ${className}`}>
      {bars.map((v, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-red-500 transition-[height] duration-75 ${barClassName}`}
          style={{ height: `${Math.max(4, v * 100)}%` }}
        />
      ))}
    </div>
  );
};

/* ─── Particle Background ─── */
const DustParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[2px] h-[2px] rounded-full bg-white/20"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
      />
    ))}
  </div>
);

/* ─── AI Studio Chat ─── */
const AI_PRELOADED = [
  { q: "What inspired this song?", a: "Man, this one came from a real late-night session. Piano playing, vibes on ten, and the concept just hit — luxury, intimacy, and that raw Houston energy all mixed together." },
  { q: "What does the piano symbolize?", a: "The piano represents elegance meeting the streets. It's that contrast — something classical and refined in a trap setting. That's my whole brand." },
  { q: "What was the recording session like?", a: "We had the whole studio set up with mood lighting, a real grand piano sample pack, and Ciddi Boy P came through with that energy. It was one take magic on the hook." },
  { q: "Hidden meanings in the lyrics?", a: "There's layers to it. On the surface it's playful, but underneath it's about seduction as power — controlling the narrative, setting the tone. The piano is the throne." },
];

const AiStudioSection = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Welcome to the studio. Ask me anything about \"Panties on My Piano\" — the inspiration, the session, the hidden meanings. I'm here. 🎹" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsTyping(true);

    // Check preloaded answers first
    const preloaded = AI_PRELOADED.find(p => msg.toLowerCase().includes(p.q.toLowerCase().slice(0, 10)));
    
    if (preloaded) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: preloaded.a }]);
        setIsTyping(false);
      }, 1200);
    } else {
      // Call AI edge function
      try {
        const { data, error } = await supabase.functions.invoke("pomp-chat", {
          body: { message: msg },
        });
        if (error) throw error;
        setMessages(prev => [...prev, { role: "assistant", content: data?.reply || "That's a great question. Let me think on that one..." }]);
      } catch {
        setMessages(prev => [...prev, { role: "assistant", content: "Real talk — that's a deep question. Hit me with another one. 🎹" }]);
      } finally {
        setIsTyping(false);
      }
    }
  }, [input]);

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-widest mb-4">
            <MessageCircle className="w-3 h-3" /> AI-Powered
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Enter the Studio</h2>
          <p className="mt-3 text-muted-foreground">Ask anything about the song, the session, or the vision.</p>
        </motion.div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {AI_PRELOADED.map(p => (
            <button
              key={p.q}
              onClick={() => handleSend(p.q)}
              className="px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-xs text-muted-foreground hover:text-foreground hover:border-red-500/30 transition-colors"
            >
              {p.q}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="rounded-2xl border border-border/30 bg-secondary/20 backdrop-blur-sm overflow-hidden">
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-red-500/20 text-foreground rounded-br-md"
                    : "bg-secondary/60 text-foreground/90 rounded-bl-md"
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary/60 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-border/20 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask about the song..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Share Section ─── */
const ShareSection = () => {
  const shareUrl = "https://mrcap1.com/panties-on-my-piano";
  const shareText = "Just discovered Panties on My Piano by MR. CAP ft. Ciddi Boy P 🔥🎹";

  const shareLinks = [
    { name: "X (Twitter)", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: "Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
  ];

  const copyCaption = () => {
    navigator.clipboard.writeText(`Just secured my Panties on My Piano NFT 🔥🎹 ${shareUrl}`);
    toast.success("Caption copied!");
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Share2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Spread the Word</h2>
          <p className="text-muted-foreground mb-8">Share with your network and let them know.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {shareLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-secondary/50 border border-border/30 text-sm text-foreground hover:border-red-500/30 hover:bg-red-500/10 transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button onClick={copyCaption} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/20 transition-colors">
          <Copy className="w-3.5 h-3.5" /> Copy Share Caption
        </button>
      </div>
    </section>
  );
};

/* ─── Email Capture ─── */
const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email, source: "pomp_release" });
      if (error?.code === "23505") {
        toast.info("You're already on the list!");
      } else if (error) {
        throw error;
      } else {
        toast.success("You're in! We'll notify you on drop day.");
        setEmail("");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.03] to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-xl mx-auto text-center"
      >
        <Mail className="w-8 h-8 text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Get Early Access</h2>
        <p className="text-muted-foreground mb-8">Join the waitlist for mint day priority + exclusive updates.</p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-full bg-secondary/50 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-red-500/40 transition-colors"
          />
          <Button type="submit" disabled={loading} className="rounded-full bg-red-600 hover:bg-red-700 text-white px-6">
            {loading ? "..." : "Join"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
};

/* ─── Behind the Song ─── */
const BehindTheSong = () => (
  <section className="py-24 px-4">
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Behind the Song</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="prose prose-invert prose-lg mx-auto"
      >
        <p className="text-foreground/80 leading-relaxed text-lg">
          "Panties on My Piano" was born in a late-night studio session where luxury met raw Houston energy.
          MR. CAP paired a grand piano melody with Ciddi Boy P's signature vocal style to create something
          that blurs the line between elegance and trap.
        </p>
        <p className="text-foreground/60 leading-relaxed mt-6">
          The concept is layered — on the surface, it's provocative and playful. But underneath, it's a
          statement about controlling the narrative, setting the mood, and owning the room. The piano
          isn't just an instrument — it's a symbol of power, refinement, and the unexpected.
        </p>
        <p className="text-foreground/60 leading-relaxed mt-6">
          This Web3 release transforms a single into a full digital experience — interactive AI, limited NFTs,
          and token-gated exclusives. Not just music. A case study in artist-led innovation.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ─── Main Page ─── */
const POMP_TRACK = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  title: "Panties on My Piano",
  slug: "panties-on-my-piano",
  artist: "MR. CAP",
  album_id: null,
  track_number: 1,
  duration: 210,
  audio_url: "/audio/panties-on-my-piano.mp3",
  cover_art_url: null as string | null,
  explicit: true,
  release_year: 2025,
  credits: "Produced by MR. CAP",
  featured_artists: "Ciddi Boy P",
  is_public: true,
  play_count: 0,
  requires_nft: false,
  spotify_url: null,
};

const PantiesOnMyPiano = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const countdown = useCountdown(MINT_DATE);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();

  // Set cover_art_url from the active cover (resolved import)
  const pompTrack = { ...POMP_TRACK, cover_art_url: COVERS[0].src };

  const handlePlay = () => {
    if (currentTrack?.id === POMP_TRACK.id) {
      togglePlay();
    } else {
      playTrack(pompTrack);
    }
  };
  const isPompPlaying = currentTrack?.id === POMP_TRACK.id && isPlaying;

  // Auto-morph covers
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActiveIdx(prev => (prev + 1) % COVERS.length), MORPH_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicRecording",
        name: "Panties on My Piano",
        byArtist: { "@type": "MusicGroup", name: "Mr. CAP" },
        duration: "PT3M30S",
        url: "https://mrcap1.com/panties-on-my-piano",
        image: "https://mrcap1.com/images/covers/pomp-standard.png",
      },
      {
        "@type": "Offer",
        name: "Standard Edition NFT",
        priceCurrency: "ETH",
        availability: "https://schema.org/PreOrder",
        itemOffered: {
          "@type": "CreativeWork",
          name: "Panties on My Piano — Standard Edition NFT",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Panties on My Piano – MR. CAP ft. Ciddi Boy P | Official NFT Release</title>
        <meta name="description" content="Official Web3 release of Panties on My Piano by MR. CAP featuring Ciddi Boy P. Interactive AI studio experience. Limited NFT editions available." />
        <link rel="canonical" href="https://mrcap1.com/panties-on-my-piano" />
        <meta property="og:title" content="Panties on My Piano – MR. CAP ft. Ciddi Boy P | Official NFT Release" />
        <meta property="og:description" content="Official Web3 release of Panties on My Piano by MR. CAP featuring Ciddi Boy P. Interactive AI studio experience. Limited NFT editions available." />
        <meta property="og:type" content="music.song" />
        <meta property="og:url" content="https://mrcap1.com/panties-on-my-piano" />
        <meta property="og:image" content="https://mrcap1.com/images/covers/pomp-standard.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Panties on My Piano cover art" />
        <meta property="og:site_name" content="Mr. CAP Music" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Panties on My Piano – MR. CAP ft. Ciddi Boy P" />
        <meta name="twitter:description" content="Official Web3 release. Interactive AI studio. Limited NFT editions." />
        <meta name="twitter:image" content="https://mrcap1.com/images/covers/pomp-standard.png" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* ═══ HERO — MORPHING COVER ═══ */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <DustParticles />
          {/* Dark radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(0_70%_8%/0.4),hsl(var(--background))_70%)]" />

          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto w-full">
            {/* Cover Art with morph */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] mb-10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  src={COVERS[activeIdx].src}
                  alt={`${COVERS[activeIdx].label} cover`}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl shadow-red-900/30 cursor-pointer"
                  onClick={() => setPaused(!paused)}
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  whileHover={{ scale: 1.03 }}
                />
              </AnimatePresence>

              {/* Waveform overlay on artwork — visible when playing */}
              <AnimatePresence>
                {isPompPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
                  >
                    {/* Dark scrim */}
                    <div className="absolute inset-0 bg-black/30" />
                    {/* Bottom waveform bars */}
                    <ReactiveWaveform
                      barCount={24}
                      className="absolute bottom-0 left-0 right-0 h-1/3 px-4 pb-4"
                      barClassName="bg-red-500/70"
                    />
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-red-500/40"
                      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow behind cover */}
              <div className="absolute -inset-8 bg-red-500/10 rounded-3xl blur-3xl -z-10" />
            </div>

            {/* Cover selector dots */}
            <div className="flex gap-3 mb-8">
              {COVERS.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => { setActiveIdx(i); setPaused(true); }}
                  className={`flex flex-col items-center gap-1.5 group`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx ? "bg-red-500 scale-125" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"}`} />
                  <span className={`text-[10px] uppercase tracking-wider transition-colors ${i === activeIdx ? "text-red-400" : "text-muted-foreground/50"}`}>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-red-400/80 mb-2">MR. CAP ft. Ciddi Boy P</p>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-none">
                <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                  Panties on My
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                  Piano
                </span>
              </h1>
              <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                A Web3 music release experience. Limited NFT editions. Interactive AI studio.
              </p>
              <div className="relative mt-6 inline-flex flex-col items-center">
                {/* Waveform behind play button */}
                <AnimatePresence>
                  {isPompPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -inset-4 -z-10"
                    >
                      <ReactiveWaveform barCount={9} className="h-full" barClassName="bg-red-500/30" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={handlePlay}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-red-900/40"
                >
                  {isPompPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPompPlaying ? "Pause" : "Play Now"}
                </motion.button>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 flex flex-col items-center gap-2"
            >
              <div className="w-px h-12 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </section>

        {/* ═══ COUNTDOWN ═══ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-widest">
                <Timer className="w-3 h-3" /> {countdown.expired ? "Minting Now" : "Drop Countdown"}
              </span>
            </motion.div>
            {!countdown.expired && (
              <div className="flex justify-center gap-4 md:gap-8">
                {(["days", "hours", "minutes", "seconds"] as const).map(unit => (
                  <motion.div
                    key={unit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <span className="font-display text-4xl md:text-6xl font-bold text-foreground tabular-nums">
                      {String(countdown[unit]).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{unit}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ AI STUDIO ═══ */}
        <AiStudioSection />

        {/* ═══ NFT TIERS ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-widest mb-4">
                <Diamond className="w-3 h-3" /> Limited Editions
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Own the Session</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Three tiers. Three levels of access. Choose your edition.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {NFT_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative rounded-2xl border ${tier.border} bg-secondary/10 backdrop-blur-sm p-6 flex flex-col hover:border-red-500/40 transition-colors group`}
                >
                  {/* Tier badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-semibold mb-4 w-fit`}>
                    <tier.icon className="w-3 h-3" /> {tier.name}
                  </div>

                  {/* Cover preview */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                    <img src={COVERS[tier.coverIdx].src} alt={tier.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white/80 text-xs font-medium">{tier.supply} Supply</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
                        <ChevronRight className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button variant="outline" className="w-full rounded-full border-border/30 hover:border-red-500/40 hover:bg-red-500/10 transition-all">
                    <Sparkles className="w-3.5 h-3.5 mr-2" /> Coming Soon
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TOKEN-GATED PREVIEW ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Collector-Only Zone</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Mint any edition to unlock high-res downloads, stems, exclusive AI conversations, and future drop whitelist access.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Hi-Res Covers", "Full Stems", "AI Exclusive Mode", "Whitelist Access"].map(item => (
                  <div key={item} className="px-4 py-3 rounded-xl bg-secondary/30 border border-border/20 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" /> {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ BEHIND THE SONG ═══ */}
        <BehindTheSong />

        {/* ═══ SHARE ═══ */}
        <ShareSection />

        {/* ═══ EMAIL CAPTURE ═══ */}
        <EmailCapture />
      </main>

      <Footer />
    </>
  );
};

export default PantiesOnMyPiano;

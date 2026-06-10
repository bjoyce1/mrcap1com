import { useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Headphones, Shuffle } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { useAudioAnalyzerStore } from "@/stores/audioAnalyzerStore";

/**
 * The Listening Room — the /music hero.
 *
 * A canvas of layered candy-paint ridges (violet to magenta, with a gold
 * hairline reading the music like an archive seismograph). Idle, it drifts
 * slowly. When a track plays, the ridges become the music: amplitude driven
 * by the live Web Audio analyser bins. The page is the player.
 */

const VIOLET = { r: 110, g: 48, b: 201 };   // #6E30C9
const MAGENTA = { r: 210, g: 52, b: 122 };  // #D2347A
const GOLD = "rgba(217, 164, 65, 0.55)";    // #D9A441

const POINTS = 48;

interface ListeningRoomHeroProps {
  trackCount: number;
  albumCount: number;
  allPlayable: Track[];
  latestPlayable: Track[];
}

const ListeningRoomHero = ({ trackCount, albumCount, allPlayable, latestPlayable }: ListeningRoomHeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothed = useRef<number[]>(new Array(POINTS).fill(0));
  const rafRef = useRef<number | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlay, nextTrack, queue } = usePlayerStore();

  // ── Canvas render loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawFrame = (t: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const data = useAudioAnalyzerStore.getState().frequencyData;
      const live = data.length > 0 && usePlayerStore.getState().isPlaying;

      // Target amplitudes: live frequency bins, or a slow idle drift
      const sm = smoothed.current;
      for (let i = 0; i < POINTS; i++) {
        let target: number;
        if (live) {
          const idx = Math.floor((i / POINTS) * data.length);
          target = data[idx] ?? 0;
        } else {
          target = 0.10 + 0.06 * Math.sin(t * 0.0008 + i * 0.45) + 0.03 * Math.sin(t * 0.0013 + i * 0.9);
        }
        // Heavy smoothing: screwed and chopped, nothing snaps
        sm[i] = sm[i] * 0.88 + target * 0.12;
      }

      const baseY = h * 0.74;
      const maxRise = h * 0.42;

      // Three layered ridges: violet wash, magenta wash, gold hairline
      const layers = [
        { scale: 1.0, alpha: 0.22, color: VIOLET, offset: 0 },
        { scale: 0.72, alpha: 0.20, color: MAGENTA, offset: 2 },
      ];

      for (const layer of layers) {
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let i = 0; i <= POINTS; i++) {
          const v = sm[Math.min(POINTS - 1, (i + layer.offset) % POINTS)];
          const x = (i / POINTS) * w;
          const y = baseY - v * maxRise * layer.scale;
          if (i === 0) ctx.lineTo(x, y);
          else {
            const prevX = ((i - 1) / POINTS) * w;
            const cx = (prevX + x) / 2;
            const prevV = sm[Math.min(POINTS - 1, (i - 1 + layer.offset) % POINTS)];
            const prevY = baseY - prevV * maxRise * layer.scale;
            ctx.quadraticCurveTo(prevX, prevY, cx, (prevY + y) / 2);
          }
        }
        ctx.lineTo(w, baseY);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const c = layer.color;
        grad.addColorStop(0, `rgba(${VIOLET.r}, ${VIOLET.g}, ${VIOLET.b}, ${layer.alpha})`);
        grad.addColorStop(1, `rgba(${MAGENTA.r}, ${MAGENTA.g}, ${MAGENTA.b}, ${layer.alpha})`);
        void c;
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Gold hairline tracing the main ridge: the archive reading the music
      ctx.beginPath();
      for (let i = 0; i <= POINTS; i++) {
        const v = sm[Math.min(POINTS - 1, i % POINTS)];
        const x = (i / POINTS) * w;
        const y = baseY - v * maxRise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    if (reduceMotion) {
      // Single static frame, no animation
      drawFrame(0);
    } else {
      const loop = (t: number) => {
        drawFrame(t);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePlayCatalog = () => {
    if (allPlayable.length === 0) return;
    // Shuffle the full catalog into a fresh queue
    const shuffledQueue = [...allPlayable];
    for (let i = shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
    }
    playTrack(shuffledQueue[0], shuffledQueue, 0);
  };

  const handlePlayLatest = () => {
    if (latestPlayable.length === 0) return;
    playTrack(latestPlayable[0], latestPlayable, 0);
  };

  const playing = isPlaying && currentTrack;

  return (
    <section className="relative w-full min-h-[78vh] flex items-end overflow-hidden bg-background">
      {/* Background video — YouTube embed scaled to fill, no controls/sound */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <iframe
          src="https://www.youtube.com/embed/nojd0u9jBr0?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&playlist=nojd0u9jBr0"
          title="Background visual"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[300vh] sm:w-[300%] sm:h-[300%] border-0"
        />
        {/* Dual black gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* The candy ridge canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      {/* Soft floor gradient so content stays readable */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />


      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 pt-36">
        <div className="flex items-center gap-2 mb-5">
          <Headphones className="w-4 h-4 text-[hsl(var(--accent-gold))]" />
          <span className="catalog-stamp">The Listening Room</span>
        </div>

        {playing ? (
          /* ── NOW PLAYING state ── */
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {currentTrack.cover_art_url && (
              <img
                src={currentTrack.cover_art_url}
                alt={currentTrack.title}
                className="w-28 h-28 sm:w-40 sm:h-40 rounded-xl object-cover border border-border/40"
                style={{ boxShadow: "var(--shadow-candy)" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="catalog-stamp block mb-2">Now Playing{currentTrack.release_year ? ` · ${currentTrack.release_year}` : ""}</span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-foreground leading-[1.05] truncate">
                {currentTrack.title}
              </h1>
              <p className="mt-2 text-muted-foreground font-mono text-sm">
                {currentTrack.featured_artists
                  ? `${currentTrack.artist} ft. ${currentTrack.featured_artists}`
                  : currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="candy-sheen flex items-center justify-center w-14 h-14 rounded-full text-primary-foreground shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              {queue.length > 1 && (
                <button
                  onClick={nextTrack}
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-[hsl(var(--accent-gold)/0.4)] text-foreground hover:border-[hsl(var(--accent-gold))] transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── IDLE state ── */
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end justify-between">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display text-foreground leading-[1.05]">
                Stream Direct.
                <br />
                No Middleman.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-md">
                Three decades of Houston hip hop, straight from the source. Press play and the room comes alive.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-4">
              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                <span>{trackCount} tracks</span>
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--accent-gold))]" />
                <span>{albumCount} albums</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlayCatalog}
                  className="candy-sheen flex items-center gap-2 text-primary-foreground px-6 py-3 rounded-full font-medium shadow-lg"
                >
                  <Shuffle className="w-4 h-4" /> Play the Catalog
                </button>
                <button
                  onClick={handlePlayLatest}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-[hsl(var(--accent-gold)/0.4)] text-foreground hover:border-[hsl(var(--accent-gold))] transition-colors font-medium"
                >
                  <Play className="w-4 h-4" /> Latest First
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListeningRoomHero;

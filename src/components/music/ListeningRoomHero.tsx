import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Play, Pause, SkipForward, Headphones, Shuffle } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/playerStore";
import { useAudioAnalyzerStore } from "@/stores/audioAnalyzerStore";
import { SplitText } from "@/components/whois/motion";
import { useMotionOk } from "@/components/whois/motionUtils";
import { WRAP, coverThumb } from "./catalog";

const Vinyl3D = lazy(() => import("@/components/music/Vinyl3D"));

/**
 * The Listening Room — the /music hero.
 *
 * Houston at dusk behind a canvas of layered candy-paint ridges (violet to
 * magenta, with a gold hairline reading the music like an archive seismograph).
 * Idle, the ridges drift. When a track plays they become the music: amplitude
 * driven by the live Web Audio analyser bins. Every loop here stops when the
 * hero is off screen or motion is switched off.
 */

const VIOLET = { r: 110, g: 48, b: 201 }; // #6E30C9
const MAGENTA = { r: 210, g: 52, b: 122 }; // #D2347A
const GOLD = "rgba(217, 164, 65, 0.55)"; // #D9A441

const POINTS = 48;
const SKY = "/images/covers/opt/houston-dusk";

interface ListeningRoomHeroProps {
  trackCount: number;
  albumCount: number;
  allPlayable: Track[];
  latestPlayable: Track[];
}

const ListeningRoomHero = ({ trackCount, albumCount, allPlayable, latestPlayable }: ListeningRoomHeroProps) => {
  const ok = useMotionOk();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothed = useRef<number[]>(new Array(POINTS).fill(0));
  const visible = useInView(sectionRef);
  const running = ok && visible;

  const { currentTrack, isPlaying, playTrack, togglePlay, nextTrack, queue } = usePlayerStore();
  const [show3D, setShow3D] = useState(false);

  // leaving the room: the sky sinks slower than the page, the copy lifts away, the record drops
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ok ? ["0%", "22%"] : ["0%", "0%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ok ? [0, -70] : [0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], ok ? [1, 0] : [1, 1]);
  const recordY = useTransform(scrollYProgress, [0, 1], ok ? ["0%", "30%"] : ["0%", "0%"]);
  const recordTilt = useTransform(scrollYProgress, [0, 1], ok ? [0, -10] : [0, 0]);

  // Mount the 3D vinyl after first paint so the hero stays fast
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => setShow3D(true), { timeout: 2500 });
    else setTimeout(() => setShow3D(true), 800);
  }, []);

  // ── Canvas: sized once per resize, drawn by a loop that only runs while it can be seen ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) drawFrame(0);
    };

    const drawFrame = (t: number) => {
      const w = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, w, h);

      const data = useAudioAnalyzerStore.getState().frequencyData;
      const live = running && data.length > 0 && usePlayerStore.getState().isPlaying;

      // Target amplitudes: live frequency bins, or a slow idle drift
      const sm = smoothed.current;
      for (let i = 0; i < POINTS; i++) {
        const target = live
          ? data[Math.floor((i / POINTS) * data.length)] ?? 0
          : 0.1 + 0.06 * Math.sin(t * 0.0008 + i * 0.45) + 0.03 * Math.sin(t * 0.0013 + i * 0.9);
        // Heavy smoothing: screwed and chopped, nothing snaps
        sm[i] = running ? sm[i] * 0.88 + target * 0.12 : target;
      }

      const baseY = h * 0.74;
      const maxRise = h * 0.42;

      // Two layered ridges (violet wash, magenta wash) and a gold hairline
      for (const layer of [
        { scale: 1.0, alpha: 0.22, offset: 0 },
        { scale: 0.72, alpha: 0.2, offset: 2 },
      ]) {
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let i = 0; i <= POINTS; i++) {
          const v = sm[Math.min(POINTS - 1, (i + layer.offset) % POINTS)];
          const x = (i / POINTS) * w;
          const y = baseY - v * maxRise * layer.scale;
          if (i === 0) ctx.lineTo(x, y);
          else {
            const prevX = ((i - 1) / POINTS) * w;
            const prevV = sm[Math.min(POINTS - 1, (i - 1 + layer.offset) % POINTS)];
            const prevY = baseY - prevV * maxRise * layer.scale;
            ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
          }
        }
        ctx.lineTo(w, baseY);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${VIOLET.r}, ${VIOLET.g}, ${VIOLET.b}, ${layer.alpha})`);
        grad.addColorStop(1, `rgba(${MAGENTA.r}, ${MAGENTA.g}, ${MAGENTA.b}, ${layer.alpha})`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      for (let i = 0; i <= POINTS; i++) {
        const x = (i / POINTS) * w;
        const y = baseY - sm[Math.min(POINTS - 1, i % POINTS)] * maxRise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    resize();
    window.addEventListener("resize", resize);
    if (running) {
      const loop = (t: number) => {
        drawFrame(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else {
      drawFrame(0);
    }
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [running]);

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
    <section ref={sectionRef} className="relative flex min-h-[82svh] w-full items-end overflow-hidden bg-background">
      {/* Houston at dusk: a still, so the room costs a 100KB image instead of a streaming video */}
      <motion.div aria-hidden="true" style={{ y: skyY }} className="pointer-events-none absolute inset-0">
        <img
          src={`${SKY}-1600.webp`}
          srcSet={`${SKY}-900.webp 900w, ${SKY}-1600.webp 1600w`}
          sizes="100vw"
          alt=""
          decoding="async"
          {...{ fetchpriority: "high" }}
          className={`h-full w-full object-cover object-[50%_62%] ${running ? "hero-drift" : ""}`}
        />
        {/* readability: dark from the top, darker toward the copy, fully dark at the seam */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/45 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/30 to-transparent" />
      </motion.div>

      {/* The candy ridge canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Soft floor gradient so content stays readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* 3D vinyl — spins with the music, label mirrors the current track */}
      {show3D && (
        <motion.div style={{ y: recordY, rotate: recordTilt }} className="pointer-events-none absolute inset-0">
          <Suspense fallback={null}>
            <Vinyl3D active={running} />
          </Suspense>
        </motion.div>
      )}

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className={`${WRAP} relative z-10 pb-14 pt-36 sm:pb-20`}>
        <div className="mb-5 flex items-center gap-2">
          <Headphones className="h-4 w-4 text-[hsl(var(--accent-gold))]" />
          <span className="catalog-stamp">The Listening Room</span>
        </div>

        {playing ? (
          /* ── NOW PLAYING state ── */
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            {currentTrack.cover_art_url && (
              <img
                src={coverThumb(currentTrack.cover_art_url)}
                alt={currentTrack.title}
                className="h-28 w-28 rounded-xl border border-border/40 object-cover sm:h-40 sm:w-40"
                style={{ boxShadow: "var(--shadow-candy)" }}
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="catalog-stamp mb-2 block">Now Playing{currentTrack.release_year ? ` · ${currentTrack.release_year}` : ""}</span>
              <h1 className="truncate font-display text-3xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">{currentTrack.title}</h1>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                {currentTrack.featured_artists ? `${currentTrack.artist} ft. ${currentTrack.featured_artists}` : currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="candy-sheen flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
              </button>
              {queue.length > 1 && (
                <button
                  onClick={nextTrack}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--accent-gold)/0.4)] text-foreground transition-colors hover:border-[hsl(var(--accent-gold))]"
                  aria-label="Next track"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── IDLE state ── */
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="flex-1">
              <SplitText as="h1" immediate delay={0.15} className="font-display text-4xl leading-[1.05] text-foreground sm:text-6xl xl:text-7xl">
                Stream Direct.
                <br />
                No Middleman.
              </SplitText>
              <p className="mt-4 max-w-md text-base text-[hsl(var(--foreground)/0.72)] sm:text-lg">
                Three decades of Houston hip hop, straight from the source. Press play and the room comes alive.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <span>{trackCount} tracks</span>
                <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent-gold))]" />
                <span>{albumCount} albums</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlayCatalog}
                  className="candy-sheen flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground shadow-lg"
                >
                  <Shuffle className="h-4 w-4" /> Play the Catalog
                </button>
                <button
                  onClick={handlePlayLatest}
                  className="flex items-center gap-2 rounded-full border border-[hsl(var(--accent-gold)/0.4)] px-6 py-3 font-medium text-foreground transition-colors hover:border-[hsl(var(--accent-gold))]"
                >
                  <Play className="h-4 w-4" /> Latest First
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ListeningRoomHero;

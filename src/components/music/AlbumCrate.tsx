import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, ListMusic, Pause, Play } from "lucide-react";
import { useAlbumTracks } from "@/hooks/useStreamingData";
import { usePlayerStore, type Album } from "@/stores/playerStore";
import { EASE_OUT, useMediaMatch, useMotionOk } from "@/components/whois/motionUtils";
import { Vinyl } from "./Vinyl";
import { ShelfHeader } from "./ShelfParts";
import { WRAP, coverImg, coverThumb } from "./catalog";
import { easeInOut, lerp, ramp, scrollToBeat } from "./stageMath";

type OpenAlbum = (album: Album) => void;

/**
 * Albums as a crate. The records stand in a stack; each scroll beat lifts the
 * front record out of its sleeve, then tips the sleeve forward to reveal the one
 * behind it, the way you flip through a crate. With motion off (or on a very
 * short screen) it's a plain grid.
 */
const AlbumCrate = ({ albums, onOpen }: { albums: Album[]; onOpen: OpenAlbum }) => {
  const short = useMediaMatch("(max-height: 659px)");
  const ok = useMotionOk() && !short;
  if (!albums.length) return null;
  return ok ? <Crate albums={albums} onOpen={onOpen} /> : <AlbumGrid albums={albums} onOpen={onOpen} />;
};

/** The crate's settled position: whole numbers while a record is up front, moving only while one tips away. */
const settled = (v: number, n: number) => {
  const x = Math.min(v * n, n - 0.0001);
  const base = Math.floor(x);
  return Math.min(n - 1, base + easeInOut(ramp(x - base, 0.7, 1)));
};

const Crate = ({ albums, onOpen }: { albums: Album[]; onOpen: OpenAlbum }) => {
  const n = albums.length;
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: runway, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(n - 1, Math.round(settled(v, n)))));
  const album = albums[active];

  return (
    <section id="albums" aria-labelledby="albums-title" className="catalog-section relative">
      <div ref={runway} className="relative" style={{ height: `${n * 75 + 45}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 50% at 26% 62%, hsl(var(--accent-gold) / 0.09), transparent 70%), radial-gradient(40% 40% at 85% 30%, hsl(var(--candy-violet) / 0.12), transparent 70%)",
            }}
          />

          <div className={`${WRAP} relative flex h-full flex-col pb-24 pt-24 md:pb-10 md:pt-28`}>
            <div className="flex items-end justify-between gap-6">
              <h2 id="albums-title" className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-none text-foreground">
                Albums
              </h2>
              <p className="pb-1 font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground" aria-hidden="true">
                <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
              </p>
            </div>

            <div className="grid min-h-0 flex-1 content-center items-center gap-4 md:gap-8 lg:grid-cols-12 lg:gap-12">
              {/* the crate */}
              <div className="lg:col-span-6">
                <div className="relative w-[min(54vw,30svh)] pt-[34%] md:w-[min(40vw,36svh)] lg:w-[min(32vw,46svh,460px)]">
                  <div className="relative aspect-square [perspective:1400px]">
                    {albums.map((a, i) => (
                      <CrateRecord key={a.id} album={a} i={i} n={n} p={p} />
                    ))}
                  </div>
                  {/* the crate's front lip */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-x-[6%] -bottom-[7%] h-[13%] border-t border-[hsl(var(--accent-gold)/0.35)] bg-gradient-to-b from-[hsl(var(--card))] to-background shadow-[0_-18px_40px_hsl(0_0%_0%/0.55)]"
                  />
                </div>
              </div>

              {/* the record that's up front */}
              <div className="relative min-h-[13rem] md:min-h-[17rem] lg:col-span-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <AlbumDetails album={album} onOpen={onOpen} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <nav aria-label="Albums" className="mt-3 hidden justify-end gap-3 md:flex">
              {albums.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => scrollToBeat(runway, i, n, true)}
                  aria-current={i === active ? "true" : undefined}
                  aria-label={`${a.title}, ${a.release_year}`}
                  className={`group relative h-12 w-12 overflow-hidden border transition-[border-color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === active ? "-translate-y-1 border-[hsl(var(--accent-gold))]" : "border-foreground/15 hover:border-foreground/50"
                  }`}
                >
                  <img src={coverThumb(a.cover_art_url)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

const CrateRecord = ({ album, i, n, p }: { album: Album; i: number; n: number; p: MotionValue<number> }) => {
  const depth = (v: number) => i - settled(v, n);
  // up front: lift the record out of the top of the sleeve, then set it back before the sleeve tips away
  const lift = useTransform(p, (v) => {
    const x = v * n - i;
    if (x < -0.3 || x > 1) return "0%";
    const up = easeInOut(ramp(x, 0.06, 0.38));
    const down = i === n - 1 ? 0 : easeInOut(ramp(x, 0.52, 0.68));
    return `${-(up - down) * 36}%`;
  });
  const turn = useTransform(p, (v) => (v * n - i) * 140);

  const y = useTransform(p, (v) => {
    const d = depth(v);
    return d >= 0 ? `${-d * 8}%` : `${-d * 14}%`;
  });
  const scale = useTransform(p, (v) => {
    const d = depth(v);
    return d >= 0 ? 1 - d * 0.06 : 1 + -d * 0.04;
  });
  const rotateX = useTransform(p, (v) => {
    const d = depth(v);
    return d >= 0 ? 0 : d * 78; // tips toward you
  });
  const opacity = useTransform(p, (v) => {
    const d = depth(v);
    if (d >= 0) return 1 - ramp(d, 2.6, 3.4);
    return 1 - ramp(-d, 0.5, 0.95);
  });
  const veil = useTransform(p, (v) => Math.min(0.78, Math.max(0, depth(v)) * 0.3));

  return (
    <motion.div
      style={{ y, scale, rotateX, opacity, zIndex: n - i, transformOrigin: "50% 100%" }}
      className="absolute inset-0 will-change-transform"
    >
      <motion.div style={{ y: lift }} className="absolute inset-0 z-[1]">
        <motion.div style={{ rotate: turn }} className="absolute inset-0">
          <Vinyl cover={album.cover_art_url} className="booth-vinyl" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 z-[2] overflow-hidden border border-[hsl(var(--foreground)/0.14)] bg-card shadow-[0_26px_60px_-12px_hsl(0_0%_0%/0.75)]">
        <img
          {...coverImg(album.cover_art_url, "(min-width: 1024px) 460px, (min-width: 768px) 40vw, 54vw")}
          alt={`${album.title} cover art`}
          loading={i < 2 ? "eager" : "lazy"}
          decoding="async"
          className="block h-full w-full object-cover"
        />
        <motion.div aria-hidden="true" style={{ opacity: veil }} className="absolute inset-0 bg-background" />
      </div>
    </motion.div>
  );
};

/** Year, title, what's on it, and the ways in. Shared by the crate and the grid's dialog-free path. */
const AlbumDetails = ({ album, onOpen }: { album: Album; onOpen: OpenAlbum }) => (
  <div>
    <div
      aria-hidden="true"
      className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.85] text-transparent"
      style={{ WebkitTextStroke: "2px hsl(var(--accent-gold) / 0.85)" }}
    >
      {album.release_year}
    </div>
    <h3 className="font-display mt-3 text-[clamp(2rem,4vw,3.75rem)] leading-[0.92] text-foreground [text-wrap:balance]">{album.title}</h3>
    <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="sr-only">Released {album.release_year} · </span>
      {album.artist} · {album.track_count || 0} tracks
    </p>
    {album.description && <p className="mt-4 hidden max-w-lg text-base leading-relaxed text-muted-foreground md:line-clamp-3">{album.description}</p>}
    <div className="mt-6 flex flex-wrap gap-3">
      <PlayAlbum album={album} />
      <button
        type="button"
        onClick={() => onOpen(album)}
        className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-gold)/0.4)] px-5 py-3 font-medium text-foreground transition-colors hover:border-[hsl(var(--accent-gold))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ListMusic className="h-4 w-4" /> Tracklist
      </button>
      <Link
        to={`/album/${album.slug}`}
        className="hidden items-center gap-2 px-2 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
      >
        Album page <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

/** Plays the album from track one. Albums with nothing uploaded yet say so instead of offering a dead button. */
export const PlayAlbum = ({ album }: { album: Album }) => {
  const { data: tracks, isLoading } = useAlbumTracks(album.id);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const playable = (tracks || []).filter((t) => t.audio_url);
  const fromThis = !!currentTrack && currentTrack.album_id === album.id;
  const playingThis = fromThis && isPlaying;

  if (!isLoading && playable.length === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-foreground/15 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
        Streaming soon
      </span>
    );
  }
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => (fromThis ? togglePlay() : playTrack(playable[0], playable, 0))}
      className="candy-sheen inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground shadow-[0_14px_30px_-8px_hsl(var(--candy-magenta)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-50"
    >
      {playingThis ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      {playingThis ? "Pause" : "Play album"}
    </button>
  );
};

/** Motion-off / short-screen version: a grid of sleeves. Hover or focus lifts each record out of its sleeve. */
const AlbumGrid = ({ albums, onOpen }: { albums: Album[]; onOpen: OpenAlbum }) => (
  <section id="albums" aria-labelledby="albums-title" className="catalog-section relative overflow-x-clip py-20 md:py-28">
    <div className={WRAP}>
      <ShelfHeader id="albums-title" title="Albums" size="lg" description="Full-length records, newest first." />
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-24 pt-24 md:grid-cols-3 md:gap-x-10 xl:grid-cols-5">
        {albums.map((a) => (
          <article key={a.id} className="disco-card group relative" style={{ ["--pull" as never]: "-24%" }}>
            <div className="art-wrap relative aspect-square">
              <Vinyl cover={a.cover_art_url} />
              <div className="art">
                <img {...coverImg(a.cover_art_url, "(min-width: 1280px) 250px, (min-width: 768px) 30vw, 45vw")} alt={`${a.title} cover art`} loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl leading-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
                <button
                  type="button"
                  onClick={() => onOpen(a)}
                  className="font-display text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
                >
                  {a.title}
                </button>
              </h3>
              <span className="font-mono text-sm tabular-nums text-[hsl(var(--accent-gold))]">{a.release_year}</span>
            </div>
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {a.artist} · {a.track_count || 0} tracks
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default AlbumCrate;

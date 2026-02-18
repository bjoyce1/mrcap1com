import * as React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Pause,
  Heart,
  Share2,
  Search,
  Shuffle,
  ListMusic,
  Grid3X3,
  Flame,
  Sparkles,
  ChevronDown,
  Clock,
  Disc3,
  Music,
} from "lucide-react";
import { useAlbums, useAllTracks } from "@/hooks/useStreamingData";
import { usePlayerStore, type Track } from "@/stores/playerStore";

type ViewMode = "grid" | "list";
type SortMode = "new" | "popular" | "title";

const formatTime = (s: number) => {
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${mm}:${ss.toString().padStart(2, "0")}`;
};

export default function PremiumMusicSection() {
  const { data: albums } = useAlbums();
  const { data: allTracks } = useAllTracks();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();

  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [sort, setSort] = React.useState<SortMode>("new");
  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeDetail, setActiveDetail] = React.useState<Track | null>(null);

  const toggleLike = (id: string) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const openDrawer = (t: Track) => {
    setActiveDetail(t);
    setDrawerOpen(true);
  };

  const handlePlay = (track: Track, queue: Track[], index: number) => {
    if (!track.audio_url) return;
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, queue, index);
    }
  };

  // Filter & sort
  const filtered = React.useMemo(() => {
    if (!allTracks) return [];
    const q = query.trim().toLowerCase();
    const base = allTracks.filter((t) => {
      if (!q) return true;
      const blob =
        `${t.title} ${t.artist} ${t.featured_artists ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
    return [...base].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "popular") return (b.play_count ?? 0) - (a.play_count ?? 0);
      return (b.release_year ?? 0) - (a.release_year ?? 0);
    });
  }, [allTracks, query, sort]);

  // Hero = first filtered track or current track
  const hero = currentTrack || filtered[0];
  const singles = allTracks?.filter((t) => !t.album_id) || [];

  if (!hero) return null;

  const isHeroPlaying = currentTrack?.id === hero.id && isPlaying;

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-32 pt-16 space-y-0">
        {/* ═══════ HERO BANNER ═══════ */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {/* Blurred cover backdrop */}
          <div className="absolute inset-0">
            <img
              src={hero.cover_art_url || "/placeholder.svg"}
              alt=""
              className="w-full h-full object-cover scale-110 blur-3xl opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-12">
            {/* Cover art */}
            <div className="shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <img
                  src={hero.cover_art_url || "/placeholder.svg"}
                  alt={hero.title}
                  className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl object-cover shadow-2xl ring-1 ring-border/20 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <button
                    onClick={() =>
                      handlePlay(hero, filtered, filtered.indexOf(hero))
                    }
                    className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    {isHeroPlaying ? (
                      <Pause className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {hero.explicit && (
                  <Badge
                    variant="outline"
                    className="border-destructive/50 text-destructive text-[10px]"
                  >
                    Explicit
                  </Badge>
                )}
                {(hero.play_count ?? 0) > 100 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[10px] bg-orange-500/15 text-orange-400 border-orange-500/30"
                  >
                    <Flame className="w-3 h-3" /> Trending
                  </Badge>
                )}
                {hero.requires_nft && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[10px] bg-violet-500/15 text-violet-400 border-violet-500/30"
                  >
                    <Sparkles className="w-3 h-3" /> NFT Exclusive
                  </Badge>
                )}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight mb-2">
                {hero.title}
              </h2>

              <p className="text-base text-muted-foreground mb-4">
                {hero.artist}
                {hero.featured_artists && (
                  <span className="text-foreground/60">
                    {" "}
                    ft. {hero.featured_artists}
                  </span>
                )}
                {hero.release_year && (
                  <span className="text-muted-foreground/50">
                    {" "}
                    · {hero.release_year}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-3 flex-wrap mb-6">
                <Badge variant="outline" className="text-xs border-border/40">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(hero.duration)} runtime
                </Badge>
                {(hero.play_count ?? 0) > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-border/40"
                  >
                    {(hero.play_count ?? 0).toLocaleString()} plays
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="flux"
                  className="rounded-full gap-2"
                  onClick={() =>
                    handlePlay(hero, filtered, filtered.indexOf(hero))
                  }
                >
                  {isHeroPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isHeroPlaying ? "Pause" : "Play"}
                </Button>

                <Button
                  variant="fluxOutline"
                  className="rounded-full gap-2"
                  onClick={() => openDrawer(hero)}
                >
                  <ListMusic className="w-4 h-4" />
                  Details
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleLike(hero.id)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        liked[hero.id]
                          ? "border-red-500/50 bg-red-500/10 text-red-400"
                          : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={liked[hero.id] ? "currentColor" : "none"}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Like</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        navigator?.clipboard
                          ?.writeText?.(window.location.href)
                          .catch(() => {})
                      }
                      className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Copy page link</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ CONTROLS ROW ═══════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists…"
              className="pl-9 rounded-2xl bg-card/50 ring-1 ring-border/20 border-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1 border-border/30 bg-card/50"
                >
                  Sort:{" "}
                  {sort === "new"
                    ? "Newest"
                    : sort === "popular"
                      ? "Popular"
                      : "Title"}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSort("new")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("popular")}>
                  Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("title")}>
                  Title
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex rounded-full border border-border/30 overflow-hidden">
              <button
                className={`p-2 transition-colors ${view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                className={`p-2 transition-colors ${view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setView("list")}
              >
                <ListMusic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════ TABS + CONTENT ═══════ */}
        <Tabs defaultValue="tracks" className="space-y-8">
          <TabsList className="bg-card/50 border border-border/20 rounded-full p-1">
            <TabsTrigger value="tracks" className="rounded-full text-sm">
              Tracks
            </TabsTrigger>
            <TabsTrigger value="releases" className="rounded-full text-sm">
              Releases
            </TabsTrigger>
            <TabsTrigger value="featured" className="rounded-full text-sm">
              Featured
            </TabsTrigger>
          </TabsList>

          {/* ── TRACKS TAB ── */}
          <TabsContent value="tracks">
            <AnimatePresence mode="wait">
              {view === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                >
                  {filtered.map((t, i) => {
                    const isCurrent =
                      currentTrack?.id === t.id;
                    const isTrackPlaying = isCurrent && isPlaying;
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <button
                          onClick={() => handlePlay(t, filtered, i)}
                          className="group relative block w-full text-left"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-border/10 group-hover:ring-primary/30 transition-all">
                            <img
                              src={t.cover_art_url || "/placeholder.svg"}
                              alt={t.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Tags overlay */}
                            {t.explicit && (
                              <div className="absolute top-2 left-2">
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] bg-black/50 backdrop-blur-sm border-0"
                                >
                                  E
                                </Badge>
                              </div>
                            )}

                            {/* Play + Like overlay */}
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                              <span className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30">
                                {isTrackPlaying ? (
                                  <Pause className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                  <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                                )}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLike(t.id);
                                }}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                                  liked[t.id]
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-black/30 text-white/70 hover:text-white"
                                }`}
                              >
                                <Heart
                                  className="w-3.5 h-3.5"
                                  fill={liked[t.id] ? "currentColor" : "none"}
                                />
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : "text-foreground"}`}
                              >
                                {t.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {t.artist}
                                {t.featured_artists
                                  ? ` ft. ${t.featured_artists}`
                                  : ""}
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground/60 tabular-nums shrink-0 mt-0.5">
                              {formatTime(t.duration)}
                            </span>
                          </div>
                        </button>

                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground/50">
                            {formatTime(t.duration)}
                          </span>
                          <button
                            onClick={() => openDrawer(t)}
                            className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors"
                          >
                            <ListMusic className="w-3 h-3 inline mr-0.5" />
                            Open
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-xl overflow-hidden"
                >
                  {/* List header */}
                  <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_100px_60px_80px] gap-3 px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/10">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span>Year</span>
                    <span>
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <span />
                  </div>

                  {filtered.map((t, i) => {
                    const isCurrent = currentTrack?.id === t.id;
                    const isTrackPlaying = isCurrent && isPlaying;
                    const albumName =
                      albums?.find((a) => a.id === t.album_id)?.title || "—";

                    return (
                      <React.Fragment key={t.id}>
                        <button
                          onClick={() => handlePlay(t, filtered, i)}
                          className={`group w-full grid grid-cols-[40px_1fr_60px] sm:grid-cols-[40px_1fr_1fr_100px_60px_80px] gap-3 px-5 py-3 text-left transition-colors border-b border-border/5 last:border-b-0 ${
                            isCurrent
                              ? "bg-primary/5"
                              : "hover:bg-secondary/40"
                          }`}
                        >
                          {/* Number */}
                          <span className="flex items-center text-sm tabular-nums">
                            {isCurrent ? (
                              isTrackPlaying ? (
                                <Pause className="w-4 h-4 text-primary" />
                              ) : (
                                <Play className="w-4 h-4 text-primary" />
                              )
                            ) : (
                              <>
                                <span className="group-hover:hidden text-muted-foreground">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <Play className="hidden group-hover:block w-4 h-4 text-primary" />
                              </>
                            )}
                          </span>

                          {/* Cover + Title */}
                          <span className="flex items-center gap-3 min-w-0">
                            <img
                              src={t.cover_art_url || "/placeholder.svg"}
                              alt={t.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <span className="min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : "text-foreground"}`}
                              >
                                {t.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {t.artist}
                                {t.featured_artists
                                  ? ` ft. ${t.featured_artists}`
                                  : ""}
                              </p>
                            </span>
                          </span>

                          {/* Album */}
                          <span className="hidden sm:flex items-center text-sm text-muted-foreground truncate">
                            {albumName}
                          </span>

                          {/* Year */}
                          <span className="hidden sm:flex items-center text-xs text-muted-foreground">
                            {t.release_year || "—"}
                          </span>

                          {/* Duration */}
                          <span className="flex items-center justify-end sm:justify-start text-xs text-muted-foreground tabular-nums">
                            {t.duration > 0 ? formatTime(t.duration) : "—"}
                          </span>

                          {/* Actions */}
                          <span className="hidden sm:flex items-center gap-2">
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleLike(t.id);
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                liked[t.id]
                                  ? "text-red-400"
                                  : "text-muted-foreground/40 hover:text-foreground"
                              }`}
                            >
                              <Heart
                                className="w-3.5 h-3.5"
                                fill={liked[t.id] ? "currentColor" : "none"}
                              />
                            </span>
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openDrawer(t);
                              }}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-foreground transition-colors"
                            >
                              <ListMusic className="w-3.5 h-3.5" />
                            </span>
                          </span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── RELEASES TAB ── */}
          <TabsContent value="releases">
            <div className="space-y-10">
              {/* Albums grid */}
              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight mb-5 flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-primary" /> Albums &amp;
                  Projects
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {albums?.map((album) => (
                    <Link
                      key={album.id}
                      to={`/album/${album.slug}`}
                      className="group text-left"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-border/10 hover:ring-primary/30 transition-all">
                        <img
                          src={album.cover_art_url || "/placeholder.svg"}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30">
                            <Play
                              className="w-5 h-5 text-primary-foreground ml-0.5"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {album.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {album.release_year} · {album.artist}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Singles */}
              {singles.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-5 flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" /> Singles &amp;
                    Features
                  </h3>
                  <div className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-xl overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[40px_1fr_100px_60px] gap-3 px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/10">
                      <span>#</span>
                      <span>Title</span>
                      <span>Year</span>
                      <span>
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    {singles.map((track, i) => (
                      <button
                        key={track.id}
                        onClick={() => handlePlay(track, singles, i)}
                        className="group w-full grid grid-cols-[40px_1fr_60px] sm:grid-cols-[40px_1fr_100px_60px] gap-3 px-5 py-3 text-left hover:bg-secondary/40 transition-colors border-b border-border/5 last:border-b-0"
                      >
                        <span className="flex items-center text-sm text-muted-foreground tabular-nums">
                          <span className="group-hover:hidden">{i + 1}</span>
                          <Play className="hidden group-hover:block w-4 h-4 text-primary" />
                        </span>
                        <span className="flex items-center gap-3 min-w-0">
                          <img
                            src={track.cover_art_url || "/placeholder.svg"}
                            alt={track.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <span className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {track.artist}
                              {track.featured_artists
                                ? ` ft. ${track.featured_artists}`
                                : ""}
                            </p>
                          </span>
                        </span>
                        <span className="hidden sm:flex items-center text-xs text-muted-foreground">
                          {track.release_year || "—"}
                        </span>
                        <span className="flex items-center justify-end text-xs text-muted-foreground tabular-nums">
                          {track.duration > 0 ? formatTime(track.duration) : "—"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── FEATURED TAB ── */}
          <TabsContent value="featured">
            <div className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Featured placements, music videos, interviews, playlists, and
                brand collaborations — this tab is your press &amp; platform
                flex.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* ═══════ SPOTIFY EMBED ═══════ */}
        <div className="pt-12">
          <h2 className="text-lg font-semibold text-foreground tracking-tight mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[hsl(141,73%,42%)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Full Catalog on Spotify
          </h2>
          <div className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-xl p-4">
            <iframe
              style={{ borderRadius: 12 }}
              src="https://open.spotify.com/embed/artist/69pjfQNXA1xjusnI2wfgug?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>

        {/* ═══════ TRACK DETAIL DRAWER ═══════ */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Track Details</SheetTitle>
            </SheetHeader>

            {activeDetail && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <img
                    src={activeDetail.cover_art_url || "/placeholder.svg"}
                    alt={activeDetail.title}
                    className="w-24 h-24 rounded-xl object-cover shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-display font-bold text-foreground truncate">
                      {activeDetail.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeDetail.artist}
                      {activeDetail.featured_artists
                        ? ` ft. ${activeDetail.featured_artists}`
                        : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeDetail.explicit && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-destructive/40 text-destructive"
                        >
                          Explicit
                        </Badge>
                      )}
                      {activeDetail.requires_nft && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-violet-500/15 text-violet-400"
                        >
                          NFT Exclusive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/20" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Runtime
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatTime(activeDetail.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Year</p>
                    <p className="text-sm font-medium text-foreground">
                      {activeDetail.release_year ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Plays</p>
                    <p className="text-sm font-medium text-foreground">
                      {(activeDetail.play_count ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/20" />

                {activeDetail.credits && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Credits / Notes
                    </p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                      {activeDetail.credits}
                    </p>
                  </div>
                )}

                {activeDetail.spotify_url && (
                  <Button
                    variant="outline"
                    className="w-full rounded-full gap-2"
                    asChild
                  >
                    <a
                      href={activeDetail.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Stream on Spotify
                    </a>
                  </Button>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

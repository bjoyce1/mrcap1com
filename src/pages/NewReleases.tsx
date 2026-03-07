import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FanCaptureBanner from "@/components/FanCaptureBanner";
import { motion } from "framer-motion";
import { Play, ArrowRight, Newspaper, Film, Disc3, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pressPageData } from "@/content/press";

/* ───── data fetching ───── */

function useReleases() {
  return useQuery({
    queryKey: ["releases-all"],
    queryFn: async () => {
      // fetch tracks (singles + album tracks) ordered by year desc
      const { data: tracks } = await supabase
        .from("tracks")
        .select("*, albums(title, slug, cover_art_url)")
        .eq("is_public", true)
        .order("release_year", { ascending: false });

      // fetch albums
      const { data: albums } = await supabase
        .from("albums")
        .select("*")
        .eq("is_public", true)
        .order("release_year", { ascending: false });

      return { tracks: tracks ?? [], albums: albums ?? [] };
    },
    staleTime: 5 * 60_000,
  });
}

/* ───── videos data (static, mirrors Videos page) ───── */
const VIDEOS = [
  { id: "1", title: "Limitless (Official Music Video)", youtubeId: "limitless-music-video", year: 2024, relatedRelease: "/music/limitless", thumbnail: "/video/limitless-music-video.mp4" },
  { id: "2", title: "Dippin' Thru the Metaverse (Official Visual)", youtubeId: "dippin-thru-metaverse", year: 2023, relatedRelease: "/music/dippin-thru-the-metaverse", thumbnail: "/video/limitless-nft.mp4" },
  { id: "3", title: "Bet'n On Me (Promo Visual)", youtubeId: "fight-minnies-promo", year: 2024, relatedRelease: "/music/betn-on-me", thumbnail: "/video/fight-minnies-promo.mp4" },
];

/* ───── helper: build unified release list ───── */
interface ReleaseCard {
  slug: string;
  title: string;
  artist: string;
  coverArt: string | null;
  releaseYear: number | null;
  type: "Single" | "Album";
  href: string;
}

function buildReleaseList(tracks: any[], albums: any[]): ReleaseCard[] {
  const seen = new Set<string>();
  const cards: ReleaseCard[] = [];

  // standalone singles (no album_id)
  for (const t of tracks) {
    if (!t.album_id) {
      cards.push({
        slug: t.slug,
        title: t.title,
        artist: t.artist,
        coverArt: t.cover_art_url,
        releaseYear: t.release_year,
        type: "Single",
        href: `/music/${t.slug}`,
      });
      seen.add(t.slug);
    }
  }

  // albums
  for (const a of albums) {
    if (!seen.has(a.slug)) {
      cards.push({
        slug: a.slug,
        title: a.title,
        artist: a.artist,
        coverArt: a.cover_art_url,
        releaseYear: a.release_year,
        type: "Album",
        href: `/albums/${a.slug}`,
      });
    }
  }

  cards.sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0));
  return cards;
}

/* ───── page ───── */

export default function NewReleases() {
  const { data, isLoading } = useReleases();

  const releases = useMemo(
    () => (data ? buildReleaseList(data.tracks, data.albums) : []),
    [data]
  );

  const latest = releases[0] ?? null;
  const recent = releases.slice(1);

  // press entries tied to releases
  const releasePressEntries = pressPageData.timeline
    .filter((e) => e.relatedRelease && e.url?.startsWith("/press/"))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "New Releases | Mr. CAP",
    url: "https://mrcap1.com/new-releases",
    description: "Explore the latest official releases from Mr. CAP on CAP Legacy.",
    isPartOf: { "@type": "WebSite", name: "Mr. CAP", url: "https://mrcap1.com" },
  };

  return (
    <>
      <SEO
        title="New Releases | Mr. CAP"
        description="Explore the latest official releases from Mr. CAP on CAP Legacy, including music, stories, visuals, and release updates."
        canonical="https://mrcap1.com/new-releases"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-20">
          {/* ── 1. HERO ── */}
          <section className="relative overflow-hidden py-24 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto px-6 text-center relative">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs tracking-[0.3em] uppercase text-primary mb-4"
              >
                CAP Legacy
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-display tracking-tight"
              >
                New Releases
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
              >
                The official release hub for the newest music, stories, and visuals from Mr.&nbsp;CAP. Every drop lives here first.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                {latest && (
                  <Button asChild size="lg">
                    <Link to={latest.href}>
                      <Play className="w-4 h-4 mr-2" /> Listen to {latest.title}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg">
                  <a href="#fan-capture">Join CAP Legacy</a>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* ── 2. LATEST RELEASE SPOTLIGHT ── */}
          {latest && (
            <section className="py-16 md:py-24">
              <div className="max-w-6xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
                >
                  {/* cover */}
                  <Link to={latest.href} className="group block">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                      <img
                        src={latest.coverArt || "/placeholder.svg"}
                        alt={latest.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                        <span className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2">
                          <Play className="w-4 h-4" /> Listen Now
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* info */}
                  <div className="space-y-5">
                    <span className="inline-block text-xs tracking-[0.25em] uppercase text-primary border border-primary/20 px-3 py-1 rounded-full">
                      Latest Release
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display tracking-tight leading-tight">
                      {latest.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {latest.artist} · {latest.type} · {latest.releaseYear ?? ""}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      The newest official release from Mr.&nbsp;CAP — available now on CAP Legacy. Stream, explore the story behind the music, and discover the full content ecosystem.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button asChild>
                        <Link to={latest.href}>
                          <Play className="w-4 h-4 mr-2" /> Listen Now
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to={latest.href}>
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* ── 3. RECENT RELEASES GRID ── */}
          {recent.length > 0 && (
            <section className="py-16 md:py-24 border-t border-border/10">
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl md:text-3xl font-display mb-10 tracking-tight">Recent Releases</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recent.map((r, i) => (
                    <motion.div
                      key={r.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={r.href}
                        className="group block rounded-xl border border-border/10 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-colors"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={r.coverArt || "/placeholder.svg"}
                            alt={r.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-5 space-y-1">
                          <p className="text-xs text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                            <Disc3 className="w-3 h-3" /> {r.type}
                            {r.releaseYear && (
                              <>
                                <span className="text-border">·</span>
                                <Calendar className="w-3 h-3" /> {r.releaseYear}
                              </>
                            )}
                          </p>
                          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{r.artist}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── 4. LATEST PRESS / RELEASE NEWS ── */}
          {releasePressEntries.length > 0 && (
            <section className="py-16 md:py-24 border-t border-border/10">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-display tracking-tight flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-primary" /> Release News
                  </h2>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/press">All Press <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {releasePressEntries.map((post, i) => (
                    <motion.article
                      key={post.slug ?? i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-border/10 bg-card/20 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors"
                    >
                      <p className="text-xs text-primary tracking-wide uppercase mb-2">{post.outlet} · {post.date}</p>
                      <h3 className="font-display text-base leading-snug mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.summary}</p>
                      {post.url && (
                        <Link to={post.url} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                          Read Article <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── 5. RELEASE VIDEOS ── */}
          <section className="py-16 md:py-24 border-t border-border/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-display tracking-tight flex items-center gap-3">
                  <Film className="w-6 h-6 text-primary" /> Release Visuals
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/videos">All Videos <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEOS.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border/10 bg-card/20 backdrop-blur-sm overflow-hidden group hover:border-primary/20 transition-colors"
                  >
                    <div className="aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden">
                      <Play className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="p-5 space-y-1">
                      <h3 className="font-display text-sm">{v.title}</h3>
                      <p className="text-xs text-muted-foreground">{v.year}</p>
                      {v.relatedRelease && (
                        <Link to={v.relatedRelease} className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                          View Release <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. FAN CAPTURE ── */}
          <section id="fan-capture" className="py-16 md:py-24 border-t border-border/10">
            <FanCaptureBanner
              sourcePage="new-releases"
              headline="Get New Releases First"
              subheadline="Join CAP Legacy — stay updated on new music, videos, and shows from Mr. CAP."
              className="mx-6 md:mx-auto max-w-4xl"
            />
          </section>

          {/* ── 7. CATALOG CTA ── */}
          <section className="py-16 md:py-24 border-t border-border/10">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-display mb-4">Explore the Full Catalog</h2>
              <p className="text-muted-foreground mb-8">
                Dive deeper into 30+ years of Mr.&nbsp;CAP's music — from early underground classics to modern releases.
              </p>
              <Button asChild size="lg">
                <Link to="/music">
                  Visit Music Page <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

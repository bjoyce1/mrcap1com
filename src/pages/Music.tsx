import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import CitationBlock from "@/components/blocks/CitationBlock";
import { musicPageData } from "@/content/music";
import {
  Play,
  ExternalLink,
  Disc3,
  Music as MusicIcon,
  Headphones,
  Sparkles,
  ArrowRight,
  Calendar,
  Film,
} from "lucide-react";

import albumTies from "@/assets/album-ties.jpg";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumColdAss from "@/assets/album-cold-ass-pimp.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";

/* ───── Data ───── */

const featuredReleases = [
  {
    title: "The Ties That Bind Us",
    year: "2024",
    meta: "SPC Group Album • 19 Tracks",
    description: "A South Park Coalition statement piece that ties history, chemistry, and movement into one project.",
    image: albumTies,
    spotify: "https://open.spotify.com/album/...",
    apple: "https://music.apple.com/us/album/the-ties-that-bind-us/1770685229",
    isNew: true,
  },
  {
    title: "The Art of ISM",
    year: "2019",
    meta: "Sony Music / The Orchard",
    description: "A concept-driven release built around philosophy, presence, and the ISM mindset.",
    image: albumArtOfIsm,
    spotify: "https://open.spotify.com/album/...",
    ismLink: "/art-of-ism",
  },
  {
    title: "2 Tha Grave",
    year: "2011",
    meta: "Album",
    description: "A hard-edged catalog release that carries weight, grit, and long-form Houston energy.",
    image: albumGrave,
    spotify: "https://open.spotify.com/album/...",
  },
  {
    title: "O.N.E. on O.N.E.",
    year: "2005",
    meta: "Album",
    description: "An early essential from the catalog that helped lay the foundation for the Mr. CAP archive.",
    image: albumOneOnOne,
  },
];

const discographyEntries = [
  { title: "The Ties That Bind Us", artist: "South Park Coalition", year: "2024", type: "Album", format: "Digital, 19 tracks", image: albumTies, label: "South Park Coalition LLC", spotify: "https://open.spotify.com/album/..." },
  { title: "The Art Of ISM", artist: "Mr. CAP", year: "2019", type: "Album", format: "Digital, 11 tracks", image: albumArtOfIsm, label: "Sony Music / The Orchard", spotify: "https://open.spotify.com/album/..." },
  { title: "2 Tha Grave", artist: "Mr. CAP", year: "2011", type: "Album", format: "MP3, Album", image: albumGrave, label: "Cap Records", spotify: "https://open.spotify.com/album/..." },
  { title: "Tha Cold Ass Pimp", artist: "Tha Cold Ass Pimp", year: "2006", type: "Mixtape", format: "CDr, Album", image: albumColdAss, label: "O.N.E. 4 Da Money Entertainment" },
  { title: "O.N.E. on O.N.E.", artist: "O.N.E. & Mr. CAP", year: "2005", type: "Album", format: "CD, Album", image: albumOneOnOne, label: "O.N.E. 4 Da Money Entertainment" },
];

const singlesData = [
  { year: "2024", tracks: [
    { title: "Social Media is a Ho Stroll", artist: "Mr. CAP feat. Ai'Eshsa" },
    { title: "Bet'n On Me", artist: "South Park Coalition" },
  ]},
  { year: "2023", tracks: [
    { title: "Dippin Thru the Metaverse", artist: "Mr. CAP (prod. Ciddy Boi P)" },
    { title: "Southern Sounds (Ultra ISM)", artist: "Mr. CAP feat. Venita Vyne" },
    { title: "H-Town Represent", artist: "Mr. CAP feat. Ciddy Boi P" },
    { title: "Where the Bag At (Extended)", artist: "Mr. CAP feat. Devyn Kelly" },
  ]},
  { year: "2021", tracks: [{ title: "Limitless", artist: "Mr. CAP feat. K-Rino", nft: true }]},
  { year: "2019", tracks: [{ title: "Limitless", artist: "Mr. CAP" }]},
  { year: "2018", tracks: [{ title: "Today Was A Great Day", artist: "Mr. CAP" }]},
  { year: "2016", tracks: [{ title: "No More Bloodshed", artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G" }]},
  { year: "2015", tracks: [{ title: "Capism", artist: "Mr. CAP" }]},
  { year: "2014", tracks: [
    { title: "I Ain't F*n With You Devils", artist: "Mr. Cap feat. Herb Of The Dynamite Squad" },
    { title: "Big Navi L.A. Remix", artist: "Mr. Cap feat. Big Prez" },
    { title: "Unsolved Mysteries – The Single Pt. 1", artist: "Mr Cap & K-Rino" },
  ]},
  { year: "2013", tracks: [
    { title: "I'm Bout To Blow", artist: "Mr. CAP" },
    { title: "2 Minute Flow", artist: "Mr. CAP" },
  ]},
  { year: "2012", tracks: [
    { title: "Live My Life", artist: "Mr. CAP" },
    { title: "Cap International", artist: "Mr. Cap feat. Big Prez & Alyssa Harris" },
    { title: "Pyrex (Egg Beater In Hand)", artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray" },
    { title: "Put The Dope Down", artist: "Mr. Cap feat. SAAK & Bosey-B" },
  ]},
];

type DiscFilter = "all" | "albums" | "singles" | "collectibles";

const quickLinks = [
  { label: "Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", icon: "🎵" },
  { label: "Apple Music", href: "https://music.apple.com/us/artist/mr-cap/1506719540", icon: "🍎" },
  { label: "YouTube", href: "https://www.youtube.com/@mrcap1", icon: "▶️" },
  { label: "Instagram", href: "https://instagram.com/mrcap1", icon: "📸" },
  { label: "X / Twitter", href: "https://x.com/mrcap1", icon: "𝕏" },
  { label: "TikTok", href: "https://tiktok.com/@mrcap1", icon: "♪" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

/* ───── Component ───── */

const MusicPage = () => {
  const [filter, setFilter] = useState<DiscFilter>("all");

  const pageTitle = "Music | Mr. CAP — Houston Hip-Hop Artist";
  const metaDescription = "Latest releases, catalog essentials, and collectible drops from Mr. CAP. Stream, watch visuals, explore the discography, and collect NFT music.";

  const allSingles = singlesData.flatMap((g) => g.tracks);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        name: "Mr. CAP — Music Hub",
        description: metaDescription,
        url: "https://mrcap1.com/music",
        numTracks: discographyEntries.length + allSingles.length,
        track: [
          ...discographyEntries.map((a) => ({ "@type": "MusicAlbum", name: a.title, datePublished: a.year, byArtist: { "@type": "Person", name: "Mr. CAP" } })),
          ...allSingles.map((s) => ({ "@type": "MusicRecording", name: s.title, byArtist: { "@type": "Person", name: "Mr. CAP" } })),
        ],
      },
      { "@type": "Person", "@id": "https://mrcap1.com/#person", name: "Mr. CAP", url: "https://mrcap1.com" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Music", item: "https://mrcap1.com/music" },
      ]},
    ],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href="https://mrcap1.com/music" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/music" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        {/* ═══════════════ 1. HERO / NEW RELEASES ═══════════════ */}
        <section id="new-releases" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
          {/* background blur */}
          <div className="absolute inset-0 z-0">
            <img src={albumTies} alt="" className="w-full h-full object-cover opacity-[0.12] blur-3xl scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-[0.25em] uppercase text-red-400 mb-3">
              Latest Release
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-7xl font-display font-bold mb-3">
              Music
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              Latest releases, catalog essentials, and collectible drops from Mr. CAP.
            </motion.p>

            {/* hero card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="flex flex-col md:flex-row gap-8 items-center md:items-end"
            >
              <div className="relative w-64 md:w-80 shrink-0 group">
                <img
                  src={albumTies}
                  alt="The Ties That Bind Us album cover"
                  className="w-full aspect-square object-cover rounded-2xl shadow-[0_8px_40px_hsl(0_0%_0%/0.5)] group-hover:shadow-[0_8px_40px_hsl(var(--primary)/0.3)] transition-shadow duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">New</div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-1">The Ties That Bind Us</h2>
                <p className="text-sm text-primary font-medium mb-3">2024 • SPC Group Album • 19 Tracks</p>
                <p className="text-muted-foreground mb-6 max-w-lg">
                  A new-era South Park Coalition release built for legacy, chemistry, and Houston history in motion.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button variant="flux" asChild>
                    <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                      <Headphones className="w-4 h-4 mr-2" /> Stream Now
                    </a>
                  </Button>
                  <Button variant="fluxOutline" asChild>
                    <Link to="/videos"><Film className="w-4 h-4 mr-2" /> Watch Visuals</Link>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <a href="#discography"><Disc3 className="w-4 h-4 mr-2" /> Explore Catalog</a>
                  </Button>
                  <Button variant="fluxGhost" asChild>
                    <Link to="/nft"><Sparkles className="w-4 h-4 mr-2" /> View NFT</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ 2. QUICK LISTEN BAR ═══════════════ */}
        <section className="border-y border-border/20 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mr-2 hidden md:inline">
                Listen Everywhere
              </span>
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-muted/40 hover:bg-primary/10 hover:text-primary text-muted-foreground text-xs font-medium transition-colors"
                >
                  <span>{link.icon}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 3. FEATURED RELEASES ═══════════════ */}
        <section id="featured-releases" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="mb-10">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-bold mb-2">Featured Releases</motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Essential projects from the catalog.</motion.p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredReleases.map((release, i) => (
                <motion.div
                  key={release.title}
                  variants={fadeUp}
                  custom={i + 2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="group relative bg-card/40 rounded-2xl overflow-hidden border border-border/10 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.15)] hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={release.image} alt={`${release.title} cover`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
                    {release.isNew && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">New</div>
                    )}
                    {/* hover overlay buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {release.spotify && (
                        <a href={release.spotify} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                          <Play className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-foreground mb-1">{release.title}</h3>
                    <p className="text-xs text-primary/80 font-medium mb-2">{release.year} • {release.meta}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{release.description}</p>
                    <div className="flex gap-2">
                      {release.spotify && (
                        <Button variant="flux" size="sm" className="flex-1" asChild>
                          <a href={release.spotify} target="_blank" rel="noopener noreferrer">Stream</a>
                        </Button>
                      )}
                      {release.ismLink && (
                        <Button variant="fluxOutline" size="sm" className="flex-1" asChild>
                          <Link to={release.ismLink}>Explore ISM</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 4. FULL DISCOGRAPHY ═══════════════ */}
        <section id="discography" className="py-16 md:py-24 bg-card/20">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-bold mb-2">Discography</motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-xl">The full catalog across eras, systems, and sound.</motion.p>
            </motion.div>

            {/* filter tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {(["all", "albums", "singles", "collectibles"] as DiscFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Albums */}
            {(filter === "all" || filter === "albums") && (
              <div className="mb-12">
                <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-primary" /> Albums & Projects
                </h3>
                <div className="space-y-3">
                  {discographyEntries.map((entry, i) => (
                    <motion.div
                      key={entry.title}
                      variants={fadeUp}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-20px" }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border/10 hover:border-primary/20 transition-all group"
                    >
                      <img src={entry.image} alt={entry.title} className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h4 className="font-display font-bold text-foreground">{entry.title}</h4>
                          <span className="text-xs text-primary font-medium">{entry.year}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground uppercase tracking-wider">{entry.type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.artist} • {entry.label}</p>
                      </div>
                      {entry.spotify && (
                        <a href={entry.spotify} target="_blank" rel="noopener noreferrer" className="shrink-0 w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors">
                          <Play className="w-4 h-4" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Singles */}
            {(filter === "all" || filter === "singles") && (
              <div className="mb-12">
                <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                  <MusicIcon className="w-5 h-5 text-primary" /> Singles & Features
                </h3>
                <div className="space-y-6">
                  {singlesData.map((group) => (
                    <div key={group.year}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-primary">{group.year}</span>
                        <div className="flex-1 h-px bg-border/30" />
                      </div>
                      <div className="space-y-1.5">
                        {group.tracks.map((track) => (
                          <div key={track.title} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/20 transition-colors">
                            <Play className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span className="text-sm text-foreground font-medium flex-1 min-w-0 truncate">{track.title}</span>
                            {(track as any).nft && (
                              <a
                                href="https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full hover:bg-amber-400 transition-colors shrink-0"
                              >
                                NFT
                              </a>
                            )}
                            <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">{track.artist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collectibles */}
            {(filter === "all" || filter === "collectibles") && filter === "collectibles" && (
              <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Collectible releases are available in the <Link to="/nft" className="text-primary hover:underline">NFT Gallery</Link>.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════ 5. VISUALS ═══════════════ */}
        <section id="videos" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-bold mb-2">Visuals</motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Watch videos, performances, and featured visuals.</motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/nojd0u9jBr0"
                  title="Mr. CAP — Latest Visual"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </motion.div>
              <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col justify-center">
                <p className="text-muted-foreground mb-6">Music lives differently when the visuals hit with it.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="flux" asChild>
                    <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </a>
                  </Button>
                  <Button variant="fluxOutline" asChild>
                    <Link to="/videos">View Latest Visuals</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 6. COLLECT THE MUSIC ═══════════════ */}
        <section id="collect" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-background to-background z-0" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} custom={0} className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-bold mb-3">Collect the Music</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mb-8">
                Explore digital releases, collectible editions, and NFT-linked music experiences.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 justify-center">
                <Button variant="flux" asChild>
                  <Link to="/nft">View NFT Gallery</Link>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <Link to="/nft">Explore Collectibles</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ 7. BOOKING CTA ═══════════════ */}
        <section id="booking" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-card/30 border border-border/20 rounded-2xl p-10">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold mb-3">Book Mr. CAP</h2>
              <p className="text-muted-foreground mb-6">
                Available for concerts, festivals, features, speaking engagements, and interviews.
              </p>
              <Button variant="flux" size="lg" asChild>
                <Link to="/booking">Submit a Booking Request <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════ 8. STREAM & FOLLOW ═══════════════ */}
        <section className="border-t border-border/20 py-10">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-5">Stream & Follow</h3>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-muted/30 hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground text-lg transition-colors"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQAccordion items={musicPageData.faq} />

        {/* Citation */}
        <CitationBlock
          canonicalUrl="https://mrcap1.com/music"
          description={musicPageData.citation.description}
          links={musicPageData.citation.links}
        />

        <Footer />
      </div>
    </>
  );
};

export default MusicPage;

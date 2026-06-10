import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, ChevronRight, ChevronLeft, X } from "lucide-react";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import StoryNotesBlock from "@/components/music/StoryNotesBlock";
import CitationBlock from "@/components/blocks/CitationBlock";
import CTAButtonRow from "@/components/blocks/CTAButtonRow";
import { musicPageData } from "@/content/music";

import albumTies from "@/assets/album-ties.webp";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import albumGrave from "@/assets/album-grave.webp";
import albumColdAss from "@/assets/album-cold-ass-pimp.webp";
import albumOneOnOne from "@/assets/album-one-on-one.webp";
import capHeroPortrait from "@/assets/cap-hero-portrait.webp";

type SingleTrack = {
  title: string;
  artist: string;
  label: string;
  nft?: boolean;
};

type Album = {
  title: string;
  artist: string;
  year: string;
  role: string;
  label: string;
  format: string;
  image: string;
  featured?: boolean;
  description?: string;
  spotify?: string;
  apple?: string;
  tracks?: { num: number; title: string; duration?: string }[];
};

const studioAlbums: Album[] = [
  {
    title: "The Ties That Bind Us",
    artist: "South Park Coalition",
    year: "2024",
    role: "SPC Group Album",
    label: "South Park Coalition LLC",
    format: "Digital, Album, 19 tracks",
    image: albumTies,
    featured: true,
    description:
      "SPC group album featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped version released Jan 2025.",
    spotify: "https://open.spotify.com/album/...",
    apple: "https://music.apple.com/us/album/the-ties-that-bind-us/1770685229",
  },
  {
    title: "The Art Of ISM",
    artist: "Mr. CAP",
    year: "2019",
    role: "Lead artist (3rd studio album)",
    label: "Sony Music / The Orchard",
    format: "Digital, Album, 11 tracks",
    image: albumArtOfIsm,
    description:
      "Features production by Zaytoven, Metro Boomin & Mike Will Made-It. Lead single: Words Of Ism (2018)",
    spotify: "https://open.spotify.com/album/...",
  },
  {
    title: "2 Tha Grave",
    artist: "Mr. CAP",
    year: "2011",
    role: "Lead artist",
    label: "Cap Records",
    format: "MP3, Album",
    image: albumGrave,
    spotify: "https://open.spotify.com/album/...",
  },
  {
    title: "Tha Cold Ass Pimp",
    artist: "Tha Cold Ass Pimp",
    year: "2006",
    role: "Mixtape",
    label: "O.N.E. 4 Da Money Entertainment",
    format: "CDr, Album",
    image: albumColdAss,
  },
  {
    title: "O.N.E. on O.N.E.",
    artist: "O.N.E. & Mr. CAP",
    year: "2005",
    role: "Co-artist (collab album)",
    label: "O.N.E. 4 Da Money Entertainment",
    format: "CD, Album",
    image: albumOneOnOne,
  },
];

const singlesData: { year: string; tracks: SingleTrack[] }[] = [
  {
    year: "2024",
    tracks: [
      { title: "Social Media is a Ho Stroll", artist: "Mr. CAP feat. Ai'Eshsa", label: "CAP Distributions" },
      { title: "Bet'n On Me", artist: "South Park Coalition", label: "South Park Coalition LLC" },
    ],
  },
  {
    year: "2023",
    tracks: [
      { title: "Dippin Thru the Metaverse", artist: "Mr. CAP (prod. Ciddy Boi P)", label: "CAP Distributions" },
      { title: "Southern Sounds (Ultra ISM)", artist: "Mr. CAP feat. Venita Vyne", label: "Power Camp" },
      { title: "H-Town Represent", artist: "Mr. CAP feat. Ciddy Boi P", label: "CAP Distributions" },
      { title: "Where the Bag At (Extended)", artist: "Mr. CAP feat. Devyn Kelly", label: "CAP Distributions" },
    ],
  },
  {
    year: "2021",
    tracks: [{ title: "Limitless", artist: "Mr. CAP feat. K-Rino", label: "Independent", nft: true }],
  },
  { year: "2019", tracks: [{ title: "Limitless", artist: "Mr. CAP", label: "Independent" }] },
  { year: "2018", tracks: [{ title: "Today Was A Great Day", artist: "Mr. CAP", label: "Independent" }] },
  {
    year: "2016",
    tracks: [
      {
        title: "No More Bloodshed",
        artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G",
        label: "Gutterlife Records",
      },
    ],
  },
  { year: "2015", tracks: [{ title: "Capism", artist: "Mr. CAP", label: "CAP Distributions" }] },
  {
    year: "2014",
    tracks: [
      { title: "I Ain't F*n With You Devils", artist: "Mr. Cap feat. Herb Of The Dynamite Squad", label: "CAP Distributions" },
      { title: "Big Navi L.A. Remix", artist: "Mr. Cap feat. Big Prez", label: "CAP Distributions" },
      { title: "Unsolved Mysteries – The Single Pt. 1", artist: "Mr Cap & K-Rino", label: "ISM Muzik" },
    ],
  },
  {
    year: "2013",
    tracks: [
      { title: "I'm Bout To Blow", artist: "Mr. CAP", label: "Cap Records" },
      { title: "2 Minute Flow", artist: "Mr. CAP", label: "CAP Distributions" },
    ],
  },
  {
    year: "2012",
    tracks: [
      { title: "Live My Life (We Hustle All Day, We Hustle All Night)", artist: "Mr. CAP", label: "CAP Distributions" },
      { title: "Cap International", artist: "Mr. Cap feat. Big Prez & Alyssa Harris", label: "Fifth Amendment Entertainment" },
      {
        title: "Pyrex (Egg Beater In Hand)",
        artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray",
        label: "Cap Distributions",
      },
      { title: "Put The Dope Down", artist: "Mr. Cap feat. SAAK & Bosey-B", label: "CAP Distribution" },
    ],
  },
];

/* ---------------- Decorative Soundwave (SVG) ---------------- */
const Soundwave = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M0,60 Q30,20 60,60 T120,60 T180,60 T240,60 T300,60 T360,60 T420,60 T480,60 T540,60 T600,60 T660,60 T720,60 T780,60 T840,60 T900,60 T960,60 T1020,60 T1080,60 T1140,60 T1200,60"
      fill="none"
      stroke="hsl(var(--primary) / 0.35)"
      strokeWidth="1"
    />
    <path
      d="M0,60 Q40,5 80,60 T160,60 T240,60 T320,60 T400,60 T480,60 T560,60 T640,60 T720,60 T800,60 T880,60 T960,60 T1040,60 T1120,60 T1200,60"
      fill="none"
      stroke="hsl(var(--primary) / 0.18)"
      strokeWidth="1"
    />
  </svg>
);

const Discography = () => {
  const pageTitle = "Mr. CAP Discography | Complete Album & Singles List | Houston Hip-Hop";
  const metaDescription =
    "Explore the complete discography of Houston rapper Mr. CAP. Albums include The Ties That Bind Us (2024), The Art of ISM (2019), 2 Tha Grave (2011), O.N.E. on O.N.E. (2005), plus singles, mixtapes, and NFT releases.";

  const allSingles = singlesData.flatMap((g) => g.tracks);
  const featuredAlbum = studioAlbums.find((a) => a.featured) ?? studioAlbums[0];

  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (dir: "left" | "right") => {
    if (!railRef.current) return;
    const amount = railRef.current.clientWidth * 0.8;
    railRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // Lock body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = activeAlbum ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeAlbum]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        name: "Mr. CAP Complete Discography",
        description: metaDescription,
        url: "https://mrcap1.com/discography",
        numTracks: studioAlbums.length + allSingles.length,
        track: [
          ...studioAlbums.map((album) => ({
            "@type": "MusicAlbum",
            name: album.title,
            datePublished: album.year,
            byArtist: { "@type": "Person", name: "Mr. CAP" },
          })),
          ...allSingles.map((single) => ({
            "@type": "MusicRecording",
            name: single.title,
            byArtist: { "@type": "Person", name: "Mr. CAP" },
          })),
        ],
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        name: "Mr. CAP",
        alternateName: ["Cornelius A. Pratt"],
        url: "https://mrcap1.com",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
          { "@type": "ListItem", position: 2, name: "Discography", item: "https://mrcap1.com/discography" },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content="mr cap discography, mr cap albums, mr cap singles, ties that bind us, art of ism, houston rap albums, south park coalition music, mr cap songs, mr cap music list"
        />
        <link rel="canonical" href="https://mrcap1.com/discography" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/discography" />
        <meta property="og:image" content="https://mrcap1.com/images/covers/album-ties.webp" />
        <meta property="og:site_name" content="Mr. CAP Legacy" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://mrcap1.com/images/covers/album-ties.webp" />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          {/* ============ CINEMATIC HERO ============ */}
          <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-background">
            {/* Yellow backdrop glow behind portrait */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80vw] max-w-[900px] h-[80vw] max-h-[900px] rounded-full bg-primary blur-3xl opacity-60" />
            </div>

            {/* Solid yellow disc behind subject (sharper edge) */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <div className="w-[70vw] max-w-[720px] h-[70vw] max-h-[720px] rounded-full bg-primary translate-y-[15%] opacity-90" />
            </div>

            {/* Foreground portrait (cut-out PNG) */}
            <div className="absolute inset-0 flex items-end justify-center">
              <img
                src={capHeroPortrait}
                alt="Mr. CAP portrait"
                className="h-[95%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_hsl(0_0%_0%/0.7)]"
                fetchPriority="high"
              />
            </div>

            {/* Vignette + bottom fade for legibility */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.5)_75%,hsl(var(--background))_100%)]" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/30 via-transparent to-background" />

            {/* Soundwave decoration */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-32 opacity-70 pointer-events-none">
              <Soundwave className="w-full h-full" />
            </div>

            {/* Breadcrumb top-left */}
            <nav className="absolute top-28 left-0 right-0 z-10">
              <div className="container mx-auto px-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground/80">
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground/90">Listen</span>
                </div>
              </div>
            </nav>

            {/* Hero title — bottom-anchored, oversized */}
            <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-24 z-10">
              <div className="container mx-auto px-6 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary mb-6">
                  The Official Catalog
                </p>
                <h1 className="font-display font-bold leading-[0.85] tracking-tight text-[18vw] md:text-[14vw] lg:text-[10rem] xl:text-[12rem]">
                  LISTEN
                </h1>
                <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
                  Twenty plus years of Houston hip-hop — albums, singles, mixtapes, and on-chain releases from Mr. CAP and the South Park Coalition.
                </p>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground/60">
              <div className="w-px h-10 bg-gradient-to-b from-transparent to-primary/60 mx-auto" />
            </div>
          </section>

          {/* ============ ALBUM GRID (editorial / MJ-style) ============ */}
          <section className="relative py-24 md:py-32 border-t border-white/5">
            <div className="container mx-auto px-6 mb-16 md:mb-20 text-center">
              <span className="catalog-stamp mb-3 block">01 — Albums</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Studio &amp; Collab Records</h2>
              <div className="archive-rule mt-4 mx-auto w-24" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 md:gap-y-24">
                {studioAlbums.map((album) => (
                  <button
                    key={album.title}
                    onClick={() => setActiveAlbum(album)}
                    className="group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  >
                    <div className="relative w-full aspect-square overflow-hidden shadow-[0_20px_50px_-10px_hsl(0_0%_0%/0.7)] transition-transform duration-500 group-hover:-translate-y-1">
                      <img
                        src={album.image}
                        alt={`${album.title} cover art`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/40">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_4px_24px_hsl(0_0%_0%/0.5)]">
                          <Play className="w-7 h-7 text-primary-foreground translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-8 font-editorial text-3xl md:text-4xl leading-tight text-foreground">
                      {album.title}
                    </h3>

                    <span className="mt-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">
                      See More
                      <span aria-hidden="true" className="inline-block w-8 h-px bg-current relative">
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-current rotate-45" />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ============ FEATURED ALBUM SPOTLIGHT ============ */}
          <section className="relative py-20 md:py-32 overflow-hidden border-t border-white/5">
            {/* Blurred bg of featured cover */}
            <div className="absolute inset-0">
              <img
                src={featuredAlbum.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-15 scale-110 blur-3xl"
              />
              <div className="absolute inset-0 bg-background/85" />
            </div>

            <div className="relative container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative aspect-square max-w-md mx-auto md:mx-0 w-full">
                  <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full" />
                  <img
                    src={featuredAlbum.image}
                    alt={`${featuredAlbum.title} cover art`}
                    className="relative w-full h-full object-cover rounded-md shadow-[0_20px_60px_hsl(0_0%_0%/0.6)]"
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Featured Release</p>
                  <h2 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] mb-6">
                    {featuredAlbum.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
                    <span>{featuredAlbum.artist}</span>
                    <span className="opacity-40">•</span>
                    <span>{featuredAlbum.year}</span>
                    <span className="opacity-40">•</span>
                    <span>{featuredAlbum.format}</span>
                  </div>
                  {featuredAlbum.description && (
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-10 max-w-xl">
                      {featuredAlbum.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {featuredAlbum.spotify && (
                      <Button variant="flux" size="lg" asChild>
                        <a href={featuredAlbum.spotify} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-2" /> Play on Spotify
                        </a>
                      </Button>
                    )}
                    {featuredAlbum.apple && (
                      <Button variant="fluxOutline" size="lg" asChild>
                        <a href={featuredAlbum.apple} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" /> Apple Music
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="lg" onClick={() => setActiveAlbum(featuredAlbum)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ FULL ALBUM GRID ============ */}
          <section className="relative py-20 md:py-28 border-t border-white/5">
            <div className="container mx-auto px-6">
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">02 — Full Catalog</p>
                <h2 className="text-3xl md:text-5xl font-display font-bold">Every Album. Every Era.</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {studioAlbums.map((album) => (
                  <button
                    key={`grid-${album.title}`}
                    onClick={() => setActiveAlbum(album)}
                    className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md mb-4 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
                      <img
                        src={album.image}
                        alt={`${album.title} cover art`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary-foreground translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">{album.year}</p>
                    <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{album.role}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ============ SINGLES TIMELINE ============ */}
          <section className="relative py-20 md:py-28 border-t border-white/5 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
            <div className="container mx-auto px-6">
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">03 — Singles &amp; Features</p>
                <h2 className="text-3xl md:text-5xl font-display font-bold">A Decade of Drops</h2>
              </div>

              <div className="max-w-4xl mx-auto">
                {singlesData.map((yearGroup) => (
                  <div key={yearGroup.year} className="grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-12 py-8 border-b border-white/5 last:border-b-0">
                    <div className="text-right">
                      <span className="font-display text-3xl md:text-5xl font-bold text-primary/80 tabular-nums">
                        {yearGroup.year}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {yearGroup.tracks.map((track, i) => (
                        <div
                          key={`${yearGroup.year}-${i}`}
                          className="group flex items-center gap-4 py-2 hover:translate-x-1 transition-transform"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Play className="w-3 h-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-foreground">{track.title}</h3>
                              {track.nft && (
                                <a
                                  href="https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] uppercase tracking-[0.2em] text-primary border border-primary/40 px-2 py-0.5 rounded-full hover:bg-primary/10 transition-colors"
                                >
                                  NFT
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{track.artist}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">{track.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ STREAM EVERYWHERE BAND ============ */}
          <section className="relative py-24 md:py-32 border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <Soundwave className="w-full h-full" />
            </div>
            <div className="relative container mx-auto px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Stream Everywhere</p>
              <h2 className="font-display font-bold text-4xl md:text-6xl mb-6 leading-[0.95]">
                Available on every platform.
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-10">
                The full Mr. CAP catalog, from independent classics to the latest South Park Coalition releases.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="flux" size="lg" asChild>
                  <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <a href="https://music.apple.com/us/artist/mr-cap/561550224" target="_blank" rel="noopener noreferrer">
                    Apple Music
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/nft">NFT Collection</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Story Notes */}
          <StoryNotesBlock body={musicPageData.storyNotes} />

          {/* FAQ */}
          <FAQAccordion items={musicPageData.faq} />

          {/* Citation */}
          <CitationBlock
            canonicalUrl="https://mrcap1.com/discography"
            description={musicPageData.citation.description}
            links={musicPageData.citation.links}
          />

          {/* Final CTAs */}
          <CTAButtonRow items={musicPageData.finalCTAs} />
        </main>

        <Footer />
      </div>

      {/* ============ ALBUM DETAIL MODAL ============ */}
      {activeAlbum && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setActiveAlbum(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeAlbum.title} details`}
        >
          <button
            onClick={() => setActiveAlbum(null)}
            className="fixed top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors"
            aria-label="Close album details"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="min-h-screen container mx-auto px-6 py-20 md:py-28"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
              <div className="relative aspect-square">
                <div className="absolute -inset-3 bg-primary/15 blur-3xl rounded-full" />
                <img
                  src={activeAlbum.image}
                  alt={`${activeAlbum.title} cover art`}
                  className="relative w-full h-full object-cover rounded-md shadow-[0_20px_60px_hsl(0_0%_0%/0.6)]"
                />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">{activeAlbum.role}</p>
                <h2 className="font-display font-bold text-4xl md:text-6xl leading-[0.9] mb-6">
                  {activeAlbum.title}
                </h2>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1">Artist</dt>
                    <dd className="text-foreground">{activeAlbum.artist}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1">Year</dt>
                    <dd className="text-foreground">{activeAlbum.year}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1">Label</dt>
                    <dd className="text-foreground">{activeAlbum.label}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1">Format</dt>
                    <dd className="text-foreground">{activeAlbum.format}</dd>
                  </div>
                </dl>

                {activeAlbum.description && (
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-10">
                    {activeAlbum.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {activeAlbum.spotify && (
                    <Button variant="flux" size="lg" asChild>
                      <a href={activeAlbum.spotify} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-2" /> Spotify
                      </a>
                    </Button>
                  )}
                  {activeAlbum.apple && (
                    <Button variant="fluxOutline" size="lg" asChild>
                      <a href={activeAlbum.apple} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Apple Music
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Discography;

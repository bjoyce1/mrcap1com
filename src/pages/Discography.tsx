import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, ChevronRight, Disc3, Music } from "lucide-react";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";
import FAQAccordion from "@/components/blocks/FAQAccordion";
import StartHereCards from "@/components/music/StartHereCards";
import StoryNotesBlock from "@/components/music/StoryNotesBlock";
import CitationBlock from "@/components/blocks/CitationBlock";
import CTAButtonRow from "@/components/blocks/CTAButtonRow";
import { musicPageData } from "@/content/music";

import albumTies from "@/assets/album-ties.jpg";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumColdAss from "@/assets/album-cold-ass-pimp.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";

const studioAlbums = [
  {
    title: "The Ties That Bind Us",
    artist: "South Park Coalition",
    year: "2024",
    role: "SPC Group Album",
    label: "South Park Coalition LLC",
    format: "Digital, Album, 19 tracks",
    image: albumTies,
    featured: true,
    description: "SPC group album featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped version released Jan 2025.",
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
    description: "Features production by Zaytoven, Metro Boomin & Mike Will Made-It. Lead single: Words Of Ism (2018)",
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

const singlesData = [
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
    tracks: [
      { title: "Limitless", artist: "Mr. CAP feat. K-Rino", label: "Independent", nft: true },
    ],
  },
  {
    year: "2019",
    tracks: [
      { title: "Limitless", artist: "Mr. CAP", label: "Independent" },
    ],
  },
  {
    year: "2018",
    tracks: [
      { title: "Today Was A Great Day", artist: "Mr. CAP", label: "Independent" },
    ],
  },
  {
    year: "2016",
    tracks: [
      { title: "No More Bloodshed", artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G", label: "Gutterlife Records" },
    ],
  },
  {
    year: "2015",
    tracks: [
      { title: "Capism", artist: "Mr. CAP", label: "CAP Distributions" },
    ],
  },
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
      { title: "Pyrex (Egg Beater In Hand)", artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray", label: "Cap Distributions" },
      { title: "Put The Dope Down", artist: "Mr. Cap feat. SAAK & Bosey-B", label: "CAP Distribution" },
    ],
  },
];

const Discography = () => {
  const pageTitle = "Mr. CAP Discography | Complete Album & Singles List | Houston Hip-Hop";
  const metaDescription = "Explore the complete discography of Houston rapper Mr. CAP. Albums include The Ties That Bind Us (2024), The Art of ISM (2019), 2 Tha Grave (2011), O.N.E. on O.N.E. (2005), plus singles, mixtapes, and NFT releases.";

  const allSingles = singlesData.flatMap(group => group.tracks);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        "name": "Mr. CAP Complete Discography",
        "description": metaDescription,
        "url": "https://mrcap1.com/discography",
        "numTracks": studioAlbums.length + allSingles.length,
        "track": [
          ...studioAlbums.map(album => ({
            "@type": "MusicAlbum",
            "name": album.title,
            "datePublished": album.year,
            "byArtist": { "@type": "Person", "name": "Mr. CAP" }
          })),
          ...allSingles.map(single => ({
            "@type": "MusicRecording",
            "name": single.title,
            "byArtist": { "@type": "Person", "name": "Mr. CAP" }
          }))
        ]
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        "name": "Mr. CAP",
        "alternateName": ["Cornelius A. Pratt"],
        "url": "https://mrcap1.com"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Discography", "item": "https://mrcap1.com/discography" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="mr cap discography, mr cap albums, mr cap singles, ties that bind us, art of ism, houston rap albums, south park coalition music, mr cap songs, mr cap music list" />
        <link rel="canonical" href="https://mrcap1.com/discography" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/discography" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mrcap1" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Discography</span>
            </nav>

            <div className="max-w-4xl mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                Mr. CAP Discography
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete catalog of albums, singles, mixtapes, and NFT releases spanning 20+ years of Houston hip-hop.
              </p>
            </div>

            {/* Studio & Collab Albums */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Disc3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-display font-bold">Studio & Collab Albums</h2>
              </div>
              
              <div style={{ position: 'relative', minHeight: '400px' }}>
                <ChromaGrid
                  items={studioAlbums.map((album) => ({
                    image: album.image,
                    title: album.title,
                    subtitle: album.role,
                    handle: album.artist,
                    borderColor: album.featured ? "hsl(var(--primary))" : "hsl(var(--border))",
                    gradient: `linear-gradient(145deg, hsl(var(--primary) / ${album.featured ? '0.12' : '0.06'}), hsl(var(--background)))`,
                    album,
                  } as ChromaGridItem))}
                  columns={4}
                  radius={250}
                  damping={0.45}
                  fadeOut={0.6}
                  renderCard={(item) => {
                    const album = item.album as typeof studioAlbums[0];
                    return (
                      <div className="flex flex-col h-full">
                        <div className="relative aspect-square overflow-hidden bg-muted rounded-t-[20px]">
                          <img src={album.image} alt={`${album.title} album cover`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                          {album.featured && (
                            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">LATEST</div>
                          )}
                          <div className="absolute bottom-3 left-3"><span className="px-2 py-0.5 rounded bg-background/80 text-xs font-medium">{album.year}</span></div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-foreground mb-1 line-clamp-1">{album.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{album.artist}</p>
                          <p className="text-xs text-muted-foreground/70">{album.label}</p>
                          <p className="text-xs text-primary/70 mt-1">{album.role}</p>
                          {(album.spotify || album.apple) && (
                            <div className="flex gap-2 mt-3">
                              {album.spotify && <Button variant="flux" size="sm" className="flex-1" asChild><a href={album.spotify} target="_blank" rel="noopener noreferrer"><Play className="w-3 h-3" /></a></Button>}
                              {album.apple && <Button variant="fluxOutline" size="sm" className="flex-1" asChild><a href={album.apple} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3 h-3" /></a></Button>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </section>

            {/* Singles & EPs */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Music className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-display font-bold">Singles & EPs</h2>
              </div>
              
              <div className="space-y-6">
                {singlesData.map((yearGroup, yearIndex) => (
                  <div key={yearIndex}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-semibold text-primary">{yearGroup.year}</span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                    <div style={{ position: 'relative', minHeight: '80px' }}>
                      <ChromaGrid
                        items={yearGroup.tracks.map((track) => ({
                          title: track.title,
                          subtitle: track.artist,
                          borderColor: track.nft ? "#f59e0b" : "hsl(var(--primary))",
                          gradient: `linear-gradient(145deg, ${track.nft ? 'rgba(245,158,11,0.08)' : 'hsl(var(--primary) / 0.06)'}, hsl(var(--background)))`,
                          nft: track.nft,
                        } as ChromaGridItem))}
                        columns={3}
                        radius={200}
                        damping={0.4}
                        fadeOut={0.5}
                        renderCard={(item) => (
                          <div className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Play className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground text-sm line-clamp-1">{item.title}</p>
                                {item.nft && (
                                  <a
                                    href="https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full hover:bg-amber-400 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Buy NFT
                                  </a>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Stream CTA */}
            <section className="bg-gradient-to-r from-primary/10 to-flux-accent/10 border border-border/50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Stream the Full Catalog
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                All of Mr. CAP's music is available on every major streaming platform.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="flux" asChild>
                  <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <a href="https://music.apple.com/us/artist/mr-cap/1506719540" target="_blank" rel="noopener noreferrer">
                    Apple Music
                  </a>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                </Button>
                <Button variant="fluxOutline" asChild>
                  <Link to="/nft">
                    NFT Collection
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Discography;
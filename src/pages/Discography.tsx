import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, ChevronRight, Disc3, Calendar, Music } from "lucide-react";

import albumTies from "@/assets/album-ties.jpg";
import albumBetn from "@/assets/betn-on-me.png";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumColdAss from "@/assets/album-cold-ass-pimp.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";
import dippinMetaverse from "@/assets/dippin-metaverse.png";
import southernSounds from "@/assets/southern-sounds.jpg";
import boutToBlow from "@/assets/bout-to-blow.png";
import hTownRepresent from "@/assets/h-town-represent.png";
import limitless from "@/assets/limitless.webp";
import socialMediaHoStroll from "@/assets/social-media-ho-stroll.jpg";

const discography = {
  albums: [
    {
      title: "The Ties That Bind Us",
      year: "2024",
      image: albumTies,
      type: "SPC Group Album",
      tracks: 19,
      label: "Independent / CAP Distributions",
      spotify: "https://open.spotify.com/album/...",
      apple: "https://music.apple.com/us/album/the-ties-that-bind-us/1770685229",
      description: "South Park Coalition group album featuring K-Rino, Point Blank, Klondike Kat, and more. Over an hour of Houston underground hip-hop with the lead single 'Bet'n On Me'.",
      featured: true,
    },
    {
      title: "The Art of ISM",
      year: "2019",
      image: albumArtOfIsm,
      type: "Studio Album",
      tracks: 11,
      label: "Sony Music / The Orchard",
      spotify: "https://open.spotify.com/album/...",
      apple: "https://music.apple.com/...",
      description: "Major label distribution with production from Zaytoven, Metro Boomin, and Mike Will Made-It. Features the track 'Words of ISM' and collaborations with Houston legends.",
    },
    {
      title: "2 Tha Grave",
      year: "2011",
      image: albumGrave,
      type: "Studio Album",
      tracks: 14,
      label: "Wreckless Entertainment",
      spotify: "https://open.spotify.com/album/...",
      description: "Follow-up album introducing the signature blend of raw lyricism, Southern grit, and street wisdom. A tribute to perseverance and legacy.",
    },
    {
      title: "O.N.E. on O.N.E.",
      year: "2005",
      image: albumOneOnOne,
      type: "Debut Album",
      tracks: 16,
      label: "Wreckless Entertainment",
      description: "Debut solo album establishing Houston's underground meets conscious lyricism. Features collaborations with South Park Coalition members.",
    },
  ],
  mixtapes: [
    {
      title: "Tha Cold Ass Pimp",
      year: "2006",
      image: albumColdAss,
      type: "Mixtape",
      description: "Critically acclaimed mixtape showcasing versatility and street credibility. A fan favorite from the early catalog.",
    },
  ],
  singles: [
    {
      title: "Bet'n On Me",
      year: "2024",
      image: albumBetn,
      spotify: "https://open.spotify.com/track/...",
      apple: "https://music.apple.com/...",
      description: "Lead single from 'The Ties That Bind Us'. An anthem for hustlers betting on themselves.",
    },
    {
      title: "Social Media is a Ho Stroll",
      year: "2024",
      image: socialMediaHoStroll,
      featuring: "Ai'Eshsa",
      description: "A sharp reflection on the pitfalls of social media culture.",
    },
    {
      title: "Dippin Thru the Metaverse",
      year: "2023",
      image: dippinMetaverse,
      producer: "Ciddy Boi P",
      description: "Fuses Houston street narratives with futuristic production and blockchain culture.",
    },
    {
      title: "Southern Sounds (Ultra ISM)",
      year: "2023",
      image: southernSounds,
      featuring: "Venita Vyne",
      apple: "https://music.apple.com/us/album/southern-sounds-ultra-ism-feat-venita-vyne-single/1715088888",
      description: "Soulful collaboration released on Power Camp.",
    },
    {
      title: "H-Town Represent",
      year: "2023",
      image: hTownRepresent,
      featuring: "Ciddy Boi P",
      apple: "https://music.apple.com/us/album/h-town-represent-feat-ciddy-boi-p-single/1681810016",
      description: "A high-energy homage to Houston.",
    },
    {
      title: "Limitless",
      year: "2021",
      image: limitless,
      featuring: "K-Rino",
      description: "Historic track—first Houston Hip-Hop NFT ever sold on the blockchain.",
      nft: true,
    },
    {
      title: "I'm Bout To Blow",
      year: "2013",
      image: boutToBlow,
      description: "Classic street anthem that defined an era.",
    },
  ],
};

const Discography = () => {
  const pageTitle = "Mr. CAP Discography | Complete Album & Singles List | Houston Hip-Hop";
  const metaDescription = "Explore the complete discography of Houston rapper Mr. CAP. Albums include The Ties That Bind Us (2024), The Art of ISM (2019), 2 Tha Grave (2011), O.N.E. on O.N.E. (2005), plus singles, mixtapes, and NFT releases.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        "name": "Mr. CAP Complete Discography",
        "description": metaDescription,
        "url": "https://mrcap1.com/mr-cap-discography",
        "numTracks": discography.albums.reduce((acc, a) => acc + (a.tracks || 0), 0) + discography.singles.length,
        "track": [
          ...discography.albums.map(album => ({
            "@type": "MusicAlbum",
            "name": album.title,
            "datePublished": album.year,
            "numTracks": album.tracks,
            "byArtist": { "@type": "Person", "name": "Mr. CAP" }
          })),
          ...discography.singles.map(single => ({
            "@type": "MusicRecording",
            "name": single.title,
            "datePublished": single.year,
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
          { "@type": "ListItem", "position": 2, "name": "Mr. CAP Discography", "item": "https://mrcap1.com/mr-cap-discography" }
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
        <link rel="canonical" href="https://mrcap1.com/mr-cap-discography" />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/mr-cap-discography" />
        
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

            {/* Albums Section */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Disc3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-display font-bold">Studio Albums</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {discography.albums.map((album) => (
                  <div 
                    key={album.title}
                    className={`bg-card/50 border rounded-2xl overflow-hidden ${album.featured ? 'border-primary/50' : 'border-border/50'}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 flex-shrink-0">
                        <img 
                          src={album.image} 
                          alt={`${album.title} album cover`}
                          className="w-full aspect-square object-cover"
                        />
                        {album.featured && (
                          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                            LATEST
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-primary font-medium uppercase tracking-wider">{album.type}</span>
                            <span className="text-xs text-muted-foreground">• {album.year}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{album.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {album.tracks && <span>{album.tracks} tracks</span>}
                            {album.label && <span>• {album.label}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {album.spotify && (
                            <Button variant="flux" size="sm" asChild>
                              <a href={album.spotify} target="_blank" rel="noopener noreferrer">
                                <Play className="w-3 h-3 mr-1" />
                                Spotify
                              </a>
                            </Button>
                          )}
                          {album.apple && (
                            <Button variant="fluxOutline" size="sm" asChild>
                              <a href={album.apple} target="_blank" rel="noopener noreferrer">
                                Apple Music
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mixtapes */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Music className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-display font-bold">Mixtapes</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {discography.mixtapes.map((mixtape) => (
                  <div 
                    key={mixtape.title}
                    className="bg-card/50 border border-border/50 rounded-xl overflow-hidden"
                  >
                    <img 
                      src={mixtape.image} 
                      alt={`${mixtape.title} cover`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">{mixtape.type} • {mixtape.year}</span>
                      <h3 className="font-bold mt-1 mb-2">{mixtape.title}</h3>
                      <p className="text-sm text-muted-foreground">{mixtape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Singles */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-display font-bold">Singles & Features</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {discography.singles.map((single) => (
                  <div 
                    key={single.title}
                    className={`bg-card/50 border rounded-xl overflow-hidden ${single.nft ? 'border-amber-500/50' : 'border-border/50'}`}
                  >
                    <div className="relative">
                      <img 
                        src={single.image} 
                        alt={`${single.title} artwork`}
                        className="w-full aspect-square object-cover"
                      />
                      {single.nft && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-full">
                          NFT
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground">{single.year}</span>
                      <h3 className="font-bold mt-1">{single.title}</h3>
                      {single.featuring && (
                        <p className="text-xs text-primary">feat. {single.featuring}</p>
                      )}
                      {single.producer && (
                        <p className="text-xs text-muted-foreground">Prod. {single.producer}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        {single.spotify && (
                          <Button variant="flux" size="sm" className="flex-1" asChild>
                            <a href={single.spotify} target="_blank" rel="noopener noreferrer">
                              <Play className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {single.apple && (
                          <Button variant="fluxOutline" size="sm" className="flex-1" asChild>
                            <a href={single.apple} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
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

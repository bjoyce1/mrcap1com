import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, ExternalLink, Music as MusicIcon, Disc3, ArrowRight } from "lucide-react";

import albumBetn from "@/assets/betn-on-me.png";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumColdAss from "@/assets/album-cold-ass-pimp.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";
import albumTies from "@/assets/album-ties.jpg";
import dippinMetaverse from "@/assets/dippin-metaverse.png";
import southernSounds from "@/assets/southern-sounds.jpg";
import boutToBlow from "@/assets/bout-to-blow.png";
import hTownRepresent from "@/assets/h-town-represent.png";
import limitless from "@/assets/limitless.webp";
import socialMediaHoStroll from "@/assets/social-media-ho-stroll.jpg";

const albums = [
  {
    title: "The Ties That Bind Us",
    year: "2024",
    image: albumTies,
    spotify: "https://open.spotify.com/album/...",
    apple: "https://music.apple.com/us/album/the-ties-that-bind-us/1770685229",
    type: "SPC Album",
    tracks: 19,
    description: "South Park Coalition group album featuring K-Rino, Point Blank, Klondike Kat, and more. Over an hour of Houston underground.",
    featured: true,
  },
  {
    title: "Bet'n On Me",
    year: "2024",
    image: albumBetn,
    spotify: "https://open.spotify.com/track/...",
    apple: "https://music.apple.com/...",
    type: "Single",
    description: "Lead single from The Ties That Bind Us. An anthem for hustlers betting on themselves.",
  },
  {
    title: "Social Media is a Ho Stroll",
    year: "2024",
    image: socialMediaHoStroll,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/...",
    type: "Single",
    description: "Featuring Ai'Eshsa. A reflection on the pitfalls of social media culture.",
  },
  {
    title: "Dippin Thru the Metaverse",
    year: "2023",
    image: dippinMetaverse,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/...",
    type: "Single",
    description: "Produced by Ciddy Boi P. Fuses Houston street narratives with futuristic production and blockchain culture.",
  },
  {
    title: "Southern Sounds (Ultra ISM)",
    year: "2023",
    image: southernSounds,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/us/album/southern-sounds-ultra-ism-feat-venita-vyne-single/1715088888",
    type: "Single",
    description: "Featuring Venita Vyne. Released on Power Camp.",
  },
  {
    title: "I'm Bout To Blow",
    year: "2013",
    image: boutToBlow,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/...",
    type: "Single",
    description: "Classic street anthem from 2013.",
  },
  {
    title: "H-Town Represent",
    year: "2023",
    image: hTownRepresent,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/us/album/h-town-represent-feat-ciddy-boi-p-single/1681810016",
    type: "Single",
    description: "Featuring Ciddy Boi P. A high-energy homage to Houston.",
  },
  {
    title: "Where the Bag At (Extended)",
    year: "2023",
    image: albumBetn,
    spotify: "https://open.spotify.com/...",
    apple: "https://music.apple.com/us/album/where-the-bag-at-extended-feat-devyn-kelly-single/1683108665",
    type: "Single",
    description: "Featuring Devyn Kelly.",
  },
  {
    title: "The Art of ISM",
    year: "2019",
    image: albumArtOfIsm,
    spotify: "https://open.spotify.com/album/...",
    apple: "https://music.apple.com/...",
    type: "Album",
    tracks: 11,
    label: "Sony Music / The Orchard",
    description: "Features production from Zaytoven and Metro Boomin.",
  },
  {
    title: "2 Tha Grave",
    year: "2011",
    image: albumGrave,
    spotify: "https://open.spotify.com/album/...",
    type: "Album",
    description: "Debut album introducing the signature blend of raw lyricism and Southern grit.",
  },
  {
    title: "Tha Cold Ass Pimp",
    year: "2006",
    image: albumColdAss,
    type: "Mixtape",
    description: "Critically acclaimed mixtape showcasing versatility and street credibility.",
  },
  {
    title: "O.N.E. on O.N.E.",
    year: "2005",
    image: albumOneOnOne,
    type: "Album",
    description: "Debut solo album establishing Houston's underground meets conscious lyricism.",
  },
];

const streamingPlatforms = [
  { name: "Spotify", url: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", color: "bg-[#1DB954]" },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/mr-cap/1506719540", color: "bg-[#FA2D48]" },
  { name: "YouTube Music", url: "https://www.youtube.com/@mrcap1", color: "bg-[#FF0000]" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/mr-cap", color: "bg-[#FF9900]" },
  { name: "Tidal", url: "https://tidal.com/artist/mr-cap", color: "bg-[#000000] ring-1 ring-white/20" },
];

const Music = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicPlaylist",
        "name": "Mr. CAP Discography",
        "description": "Complete discography of Houston hip-hop artist Mr. CAP including albums, singles, and collaborations.",
        "url": "https://mrcap1.com/music",
        "numTracks": 50,
        "track": albums.filter(a => a.type === "Album" || a.type === "SPC Album").map(album => ({
          "@type": "MusicRecording",
          "name": album.title,
          "datePublished": album.year,
          "byArtist": { "@type": "Person", "name": "Mr. CAP" }
        }))
      },
      {
        "@type": "MusicAlbum",
        "name": "The Ties That Bind Us",
        "byArtist": { "@type": "MusicGroup", "name": "South Park Coalition" },
        "genre": ["Hip-Hop", "Southern Rap"],
        "datePublished": "2024-10-18",
        "numTracks": 19,
        "track": [{ "@type": "MusicRecording", "name": "Bet'n On Me" }]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Music", "item": "https://mrcap1.com/music" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Music by Mr. CAP | Albums, Singles & Discography | Houston Hip-Hop</title>
        <meta name="description" content="Stream albums, singles and music from Mr. CAP – Houston hip-hop artist and South Park Coalition original member. Explore The Ties That Bind Us, The Art of ISM, 2 Tha Grave, and more." />
        <link rel="canonical" href="https://mrcap1.com/music" />
        
        <meta property="og:title" content="Music by Mr. CAP | Albums, Singles & Discography" />
        <meta property="og:description" content="Stream the complete discography of Houston hip-hop pioneer Mr. CAP." />
        <meta property="og:type" content="music.album" />
        <meta property="og:url" content="https://mrcap1.com/music" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#000000] text-zinc-100">
        <Navigation />
        
        <main className="pt-24">
          {/* Hero Section */}
          <section className="relative z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8 animate-fade-in">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Music</span>
              </nav>

              <div className="flex flex-col sm:flex-row gap-8 items-center justify-between pb-12">
                {/* Left: Heading */}
                <div className="text-left flex-1">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-white leading-tight">
                    20+ Years. 6 Albums. Countless Stories.
                  </h1>
                </div>

                {/* Right: Subheading + Button */}
                <div className="flex flex-col flex-1 text-left sm:text-right max-w-md space-y-6 items-start sm:items-end">
                  <p className="text-base sm:text-lg text-white/70 max-w-sm">
                    From South Park streets to streaming platforms worldwide—Mr. CAP's discography spans two decades of Houston hip-hop.
                  </p>
                  <Button variant="flux" size="lg" className="group">
                    Stream Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Featured Album Preview with Glow */}
              <div className="relative mt-8 sm:mt-16">
                {/* Glow */}
                <div className="absolute -top-8 inset-0 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30 h-56 max-w-5xl rounded-[28px] mx-auto blur-2xl" />

                <div className="relative backdrop-blur-2xl bg-white/[0.03] ring-1 ring-white/5 rounded-2xl overflow-hidden max-w-5xl mx-auto" style={{ maskImage: 'linear-gradient(black 0%, black 70%, transparent 100%)' }}>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative group">
                        <img
                          src={albumTies}
                          alt="The Ties That Bind Us album cover"
                          className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          NEW ALBUM
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
                          <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                          FEATURED RELEASE
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight">
                          The Ties That Bind Us
                        </h2>
                        <p className="text-neutral-400 mb-6 max-w-lg">
                          More than an album—it's a life story scored in 808s. From Third Ward lessons to blockchain boardrooms, Mr. CAP turns years of struggle, hustle, and growth into a soundtrack for people betting on themselves.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <Button variant="flux">
                            <Play className="mr-2 h-4 w-4" />
                            Play Album
                          </Button>
                          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Listen to "Bet'n On Me"
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Streaming Platforms */}
          <section className="py-12 mt-16 border-y border-white/5 bg-white/[0.02]" style={{ backdropFilter: 'blur(20px)' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <p className="text-center text-neutral-400 mb-6">Stream on your favorite platform</p>
              <div className="flex flex-wrap justify-center gap-3">
                {streamingPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                    <span className="text-sm font-medium text-white">{platform.name}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Albums Horizontal Scroll */}
          <section className="py-16 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Discography</h2>
                <span className="text-sm text-neutral-400">{albums.length} releases</span>
              </div>
              <div className="grid grid-flow-col auto-cols-[minmax(180px,1fr)] gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
                {albums.map((album) => (
                  <a
                    key={album.title}
                    href={album.spotify || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border rounded-xl p-3 min-w-[180px] transition-all bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                    style={{ backdropFilter: 'blur(18px)' }}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={album.image}
                        alt={`${album.title} album cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {album.featured && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          NEW
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{album.title}</p>
                    <p className="text-xs text-neutral-400">{album.type} • {album.year}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Two Column Layout */}
          <section className="py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              {/* Featured Tracks */}
              <div className="border rounded-xl p-5 backdrop-blur-xl bg-white/[0.03] border-white/5" style={{ backdropFilter: 'blur(24px)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold tracking-tight text-white">Featured Tracks</h3>
                </div>
                <ul className="divide-y divide-white/5">
                  {[
                    { name: "Dippin Thru the Metaverse", album: "Single (2023)", duration: "3:45", image: dippinMetaverse },
                    { name: "Bet'n On Me", album: "The Ties That Bind Us", duration: "3:45", image: albumBetn },
                    { name: "Social Media is a Ho Stroll", album: "Single (2024)", duration: "3:32", image: socialMediaHoStroll },
                    { name: "Words of ISM", album: "The Art of ISM", duration: "4:12", image: albumArtOfIsm },
                    { name: "Limitless", album: "Single", duration: "3:58", image: limitless },
                  ].map((track, i) => (
                    <li key={i} className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img src={track.image} className="w-full h-full object-cover" alt={track.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{track.name}</p>
                        <p className="text-xs text-neutral-400 truncate">{track.album}</p>
                      </div>
                      <span className="text-xs text-neutral-400">{track.duration}</span>
                      <button className="ml-2 p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Album Highlights */}
              <div className="border rounded-xl p-5 backdrop-blur-xl bg-white/[0.03] border-white/5" style={{ backdropFilter: 'blur(24px)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold tracking-tight text-white">Album Highlights</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {albums.slice(0, 4).map((album) => (
                    <a
                      key={album.title}
                      href={album.spotify || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl overflow-hidden border transition-colors border-white/5 bg-white/5 hover:bg-white/10"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={album.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={album.title}
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-white truncate">{album.title}</p>
                        <p className="text-xs text-neutral-400">{album.tracks ? `${album.tracks} tracks` : album.type} • {album.year}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Spotify Embed */}
          <section className="py-16 px-4 sm:px-6 border-t border-white/5 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold tracking-tight text-white text-center mb-8">Full Catalog on Spotify</h2>
              <div className="max-w-3xl mx-auto rounded-xl overflow-hidden ring-1 ring-white/10">
                <iframe
                  src="https://open.spotify.com/embed/artist/69pjfQNXA1xjusnI2wfgug?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-white/10 mb-6">
                <MusicIcon className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
                Experience Live
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto mb-8">
                Whether it's a packed Houston club or a festival stage in another city, Mr. CAP brings a raw, 
                honest performance—built on decades of experience and a lifetime of stories.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="flux" asChild>
                  <Link to="/live">View Live Shows</Link>
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white" asChild>
                  <Link to="/nft">NFT Collection</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Music;
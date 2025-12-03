import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, ExternalLink, Music as MusicIcon } from "lucide-react";

import albumBetn from "@/assets/betn-on-me.png";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumColdAss from "@/assets/album-cold-ass-pimp.jpg";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";
import albumTies from "@/assets/album-ties.jpg";

const albums = [
  {
    title: "The Ties That Bind Us",
    year: "2024",
    image: albumTies,
    spotify: "https://open.spotify.com/album/...",
    apple: "https://music.apple.com/...",
    type: "Album",
    tracks: 12,
  },
  {
    title: "Bet'n On Me",
    year: "2024",
    image: albumBetn,
    spotify: "https://open.spotify.com/track/...",
    apple: "https://music.apple.com/...",
    type: "Single",
    featured: true,
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
  },
  {
    title: "2 Tha Grave",
    year: "2011",
    image: albumGrave,
    spotify: "https://open.spotify.com/album/...",
    type: "Album",
  },
  {
    title: "Tha Cold Ass Pimp",
    year: "2006",
    image: albumColdAss,
    type: "Mixtape",
  },
  {
    title: "O.N.E. on O.N.E.",
    year: "2005",
    image: albumOneOnOne,
    type: "Album",
  },
];

const streamingPlatforms = [
  { name: "Spotify", url: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", color: "bg-[#1DB954]" },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/mr-cap/1506719540", color: "bg-[#FA2D48]" },
  { name: "YouTube Music", url: "https://www.youtube.com/@mrcap1", color: "bg-[#FF0000]" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/mr-cap", color: "bg-[#FF9900]" },
  { name: "Tidal", url: "https://tidal.com/artist/mr-cap", color: "bg-[#000000]" },
];

const Music = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Mr. CAP",
    "url": "https://mrcapmusic.com/music",
    "genre": ["Hip-Hop", "Rap", "Underground Hip-Hop"],
    "album": albums.filter(a => a.type === "Album").map(album => ({
      "@type": "MusicAlbum",
      "name": album.title,
      "datePublished": album.year,
      "numTracks": album.tracks,
      "image": album.image
    }))
  };

  return (
    <>
      <Helmet>
        <title>Music — Mr. CAP Discography | Houston Hip-Hop Albums & Singles</title>
        <meta name="description" content="Stream Mr. CAP's complete discography including The Ties That Bind Us, The Art of ISM, and classic albums. Authentic Houston underground hip-hop on all platforms." />
        <link rel="canonical" href="https://mrcapmusic.com/music" />
        
        <meta property="og:title" content="Music — Mr. CAP Discography" />
        <meta property="og:description" content="Stream the complete discography of Houston hip-hop pioneer Mr. CAP." />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Music</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Discography
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Three decades of authentic Houston hip-hop. Stream albums, singles, and collaborations.
              </p>
            </div>
          </section>

          {/* Streaming Platforms */}
          <section className="py-12 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <p className="text-center text-muted-foreground mb-6">Stream on your favorite platform</p>
              <div className="flex flex-wrap justify-center gap-4">
                {streamingPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-full px-5 py-2 hover:border-primary/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Albums Grid */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8">Albums & Releases</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => (
                  <div
                    key={album.title}
                    className={`group bg-card/30 border rounded-xl overflow-hidden hover:border-primary/50 transition-all ${
                      album.featured ? "border-primary/50 ring-2 ring-primary/20" : "border-border/50"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={album.image}
                        alt={`${album.title} album cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {album.featured && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                          NEW RELEASE
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                        <Button variant="flux" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Listen Now
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {album.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{album.year}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      {album.label && (
                        <p className="text-sm text-muted-foreground mt-1">{album.label}</p>
                      )}
                      {album.tracks && (
                        <p className="text-sm text-muted-foreground mt-1">{album.tracks} tracks</p>
                      )}
                      <div className="flex gap-2 mt-4">
                        {album.spotify && (
                          <a href={album.spotify} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Spotify Embed */}
          <section className="py-20 bg-card/20 border-y border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">Full Catalog on Spotify</h2>
              <div className="max-w-3xl mx-auto">
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
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <MusicIcon className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Experience Live
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Nothing beats experiencing Mr. CAP's music live. Check out upcoming shows and booking info.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="flux" asChild>
                  <Link to="/live">View Live Shows</Link>
                </Button>
                <Button variant="fluxOutline" asChild>
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

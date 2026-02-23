import { Play, Pause, Headphones, ExternalLink, Music, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { trackMusicPlay } from "@/components/GoogleAnalytics";
import ScrollReveal from "@/components/ScrollReveal";
import albumTies from "@/assets/album-ties.jpg";
import albumGrave from "@/assets/album-grave.jpg";
import betnOnMe from "@/assets/betn-on-me.png";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumOneOnOne from "@/assets/album-one-on-one.jpg";
import albumColdAssPimp from "@/assets/album-cold-ass-pimp.jpg";

const albums = [{
  title: "The Ties That Bind Us",
  artist: "South Park Coalition",
  year: "2024",
  role: "SPC Group Album",
  label: "South Park Coalition LLC",
  format: "Digital, Album, 19 tracks",
  image: albumTies,
  featured: true,
  description: "SPC group album featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped version released Jan 2025."
}, {
  title: "The Art Of ISM",
  artist: "Mr. CAP",
  year: "2019",
  role: "Lead artist (3rd studio album)",
  label: "Sony Music / The Orchard",
  format: "Digital, Album, 11 tracks",
  catalog: "Deluxe Edition",
  image: albumArtOfIsm,
  description: "Features production by Zaytoven, Metro Boomin & Mike Will Made-It. Lead single: Words Of Ism (2018)"
}, {
  title: "2 Tha Grave",
  artist: "Mr. CAP",
  year: "2011",
  role: "Lead artist",
  label: "Cap Records",
  format: "MP3, Album",
  catalog: "CAP RECORDS",
  image: albumGrave
}, {
  title: "Tha Cold Ass Pimp",
  artist: "Tha Cold Ass Pimp",
  year: "2006",
  role: "Mixtape",
  label: "O.N.E. 4 Da Money Entertainment",
  format: "CDr, Album",
  image: albumColdAssPimp
}, {
  title: "O.N.E. on O.N.E.",
  artist: "O.N.E. & Mr. CAP",
  year: "2005",
  role: "Co-artist (collab album)",
  label: "O.N.E. 4 Da Money Entertainment",
  format: "CD, Album",
  image: albumOneOnOne
}];

const singles = [{
  year: "2024",
  tracks: [{ title: "Social Media is a Ho Stroll", artist: "Mr. CAP feat. Ai'Eshsa", label: "CAP Distributions" }]
}, {
  year: "2023",
  tracks: [
    { title: "Dippin Thru the Metaverse", artist: "Mr. CAP (prod. Ciddy Boi P)", label: "CAP Distributions" },
    { title: "Southern Sounds (Ultra ISM)", artist: "Mr. CAP feat. Venita Vyne", label: "Power Camp" },
    { title: "H-Town Represent", artist: "Mr. CAP feat. Ciddy Boi P", label: "CAP Distributions" },
    { title: "Where the Bag At (Extended)", artist: "Mr. CAP feat. Devyn Kelly", label: "CAP Distributions" },
  ]
}, {
  year: "2019",
  tracks: [{ title: "Limitless", artist: "Mr. CAP", label: "Independent" }]
}, {
  year: "2018",
  tracks: [{ title: "Today Was A Great Day", artist: "Mr. CAP", label: "Independent" }]
}, {
  year: "2016",
  tracks: [{ title: "No More Bloodshed", artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G", label: "Gutterlife Records" }]
}, {
  year: "2015",
  tracks: [{ title: "Capism", artist: "Mr. CAP", label: "CAP Distributions" }]
}, {
  year: "2014",
  tracks: [
    { title: "I Ain't F*n With You Devils", artist: "Mr. Cap feat. Herb Of The Dynamite Squad", label: "CAP Distributions" },
    { title: "Big Navi L.A. Remix", artist: "Mr. Cap feat. Big Prez", label: "CAP Distributions" },
    { title: "Unsolved Mysteries – The Single Pt. 1", artist: "Mr Cap & K-Rino", label: "ISM Muzik" },
  ]
}, {
  year: "2013",
  tracks: [
    { title: "I'm Bout To Blow", artist: "Mr. CAP", label: "Cap Records" },
    { title: "2 Minute Flow", artist: "Mr. CAP", label: "CAP Distributions" },
  ]
}, {
  year: "2012",
  tracks: [
    { title: "Live My Life (We Hustle All Day, We Hustle All Night)", artist: "Mr. CAP", label: "CAP Distributions" },
    { title: "Cap International", artist: "Mr. Cap feat. Big Prez & Alyssa Harris", label: "Fifth Amendment Entertainment" },
    { title: "Pyrex (Egg Beater In Hand)", artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray", label: "Cap Distributions" },
    { title: "Put The Dope Down", artist: "Mr. Cap feat. SAAK & Bosey-B", label: "CAP Distribution" },
  ]
}];

const MusicSection = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        trackMusicPlay("Bet'n On Me");
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="music" className="section-spacing relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/4 blur-[140px] rounded-full pointer-events-none" />

      <audio ref={audioRef} src="/audio/betn-on-me.mp3" onEnded={() => setIsPlaying(false)} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-primary" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                Discography
              </span>
            </div>
            <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Music & <span className="text-gradient-orange">Releases</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-2xl font-light text-balance">
              From underground classics to digital-age releases, Mr. CAP's catalog reflects
              a journey — not just a career.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal width="100%">
          <div className="mb-20">
            <div className="group glass rounded-2xl overflow-hidden card-lift">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  <img src={betnOnMe} alt="Bet'n On Me Single Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background md:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium">
                      Latest Album
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={togglePlay} className="w-20 h-20 rounded-full glass flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-8 h-8 text-foreground" fill="currentColor" /> : <Play className="w-8 h-8 text-foreground ml-1" fill="currentColor" />}
                    </button>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground mb-2">2024 · South Park Coalition LLC</p>
                  <h3 className="font-editorial text-4xl md:text-5xl tracking-tight mb-2">Bet'n On Me</h3>
                  <p className="text-sm text-primary mb-4">Lead Single: "Bet'n On Me"</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-light text-balance">
                    A grown-man statement album — honest, reflective, and unflinching.
                    CAP explores loyalty, pain, spirituality, survival, and growth over
                    cinematic production and Southern knock.
                  </p>
                  <p className="text-xs text-muted-foreground mb-8">
                    Recorded by K-Water · Mixed by K-Water · Mastered by Mr. CAP
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="flux" size="default" className="rounded-full" onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? "Pause" : "Play \"Bet'n On Me\""}
                    </Button>
                    <Button variant="fluxOutline" size="default" className="rounded-full">
                      <Headphones className="w-4 h-4" />
                      Stream Album
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mb-20">
          <ScrollReveal width="100%">
            <div className="flex items-center gap-3 mb-8">
              <Disc3 className="w-5 h-5 text-primary" />
              <h3 className="font-editorial text-2xl">Studio & Collab Albums</h3>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {albums.map((album, index) => (
              <ScrollReveal key={index} width="100%" delay={0.1 * index}>
                <div className="album-card group glass rounded-xl overflow-hidden card-lift">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {album.image ? (
                      <img src={album.image} alt={`${album.title} Album Cover`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Disc3 className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded glass text-xs font-medium">{album.year}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-foreground mb-1 line-clamp-1">{album.title}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{album.artist}</p>
                    <p className="text-xs text-primary/60">{album.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div>
          <ScrollReveal width="100%">
            <div className="flex items-center gap-3 mb-8">
              <Music className="w-5 h-5 text-primary" />
              <h3 className="font-editorial text-2xl">Singles & EPs</h3>
            </div>
          </ScrollReveal>
          <div className="space-y-8">
            {singles.map((yearGroup, yearIndex) => (
              <ScrollReveal key={yearIndex} width="100%" delay={0.05 * yearIndex}>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-lg font-display text-primary">{yearGroup.year}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {yearGroup.tracks.map((track, trackIndex) => (
                      <div key={trackIndex} className="group flex items-center gap-3 p-4 rounded-xl glass cursor-pointer hover:border-primary/20 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all shrink-0">
                          <Play className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-clamp-1">{track.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal width="100%">
          <div className="mt-16 pt-10 border-t border-white/5">
            <p className="text-sm text-muted-foreground mb-5">Stream on all major platforms:</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
                <a href="https://open.spotify.com/artist/1pSXGKxJIw95dV3xQX4TjS" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> Spotify
                </a>
              </Button>
              <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
                <a href="https://music.apple.com/us/artist/mr-cap/276295771" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> Apple Music
                </a>
              </Button>
              <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
                <a href="https://music.youtube.com/channel/UCTBPJTJdwbE2G-mANsRzwqg" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> YouTube Music
                </a>
              </Button>
              <Button variant="fluxOutline" size="sm" className="rounded-full" asChild>
                <a href="https://music.amazon.com/artists/B001G5R6E6/mr-cap" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> Amazon Music
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MusicSection;

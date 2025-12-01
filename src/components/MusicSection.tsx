import { Play, Headphones, ExternalLink, Music, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import albumTies from "@/assets/album-ties.jpg";
import albumGrave from "@/assets/album-grave.jpg";
import betnOnMe from "@/assets/betn-on-me.png";
const albums = [{
  title: "O.N.E. on O.N.E.",
  artist: "O.N.E. & Mr. CAP",
  year: "2005",
  role: "Co-artist (collab album)",
  label: "O.N.E. 4 Da Money Entertainment",
  format: "CD, Album",
  image: null
}, {
  title: "Tha Cold Ass Pimp",
  artist: "Tha Cold Ass Pimp",
  year: "2006",
  role: "Mr. CAP-associated",
  label: "O.N.E. 4 Da Money Entertainment",
  format: "CDr, Album",
  image: null
}, {
  title: "2 Tha Grave",
  artist: "Mr. CAP",
  year: "2011",
  role: "Lead artist",
  label: "Cap Records",
  format: "MP3, Album",
  catalog: "CAP RECORDS",
  image: albumGrave,
  featured: true
}, {
  title: "The Art Of ISM",
  artist: "Mr. CAP",
  year: "2019",
  role: "Lead artist",
  label: "Power Camp",
  format: "MP3, Album, Stereo",
  catalog: "USCAP4573",
  image: null
}];
const singles = [{
  year: "2012",
  tracks: [{
    title: "Live My Life (We Hustle All Day, We Hustle All Night)",
    artist: "Mr. CAP",
    label: "CAP Distributions"
  }, {
    title: "Cap International",
    artist: "Mr. Cap feat. Big Prez & Alyssa Harris",
    label: "Fifth Amendment Entertainment"
  }, {
    title: "Pyrex (Egg Beater In Hand)",
    artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray",
    label: "Cap Distributions"
  }, {
    title: "Put The Dope Down",
    artist: "Mr. Cap feat. SAAK & Bosey-B",
    label: "CAP Distribution"
  }]
}, {
  year: "2013",
  tracks: [{
    title: "I'm Bout To Blow",
    artist: "Mr. CAP",
    label: "Cap Records",
    catalog: "CAP4573"
  }, {
    title: "2 Minute Flow",
    artist: "Mr. CAP",
    label: "CAP Distributions"
  }]
}, {
  year: "2014",
  tracks: [{
    title: "I Ain't F*n With You Devils",
    artist: "Mr. Cap feat. Herb Of The Dynamite Squad",
    label: "CAP Distributions"
  }, {
    title: "Big Navi L.A. Remix",
    artist: "Mr. Cap feat. Big Prez",
    label: "CAP Distributions"
  }, {
    title: "Unsolved Mysteries – The Single Pt. 1",
    artist: "Mr Cap & K-Rino",
    label: "ISM Muzik"
  }]
}, {
  year: "2015",
  tracks: [{
    title: "Capism",
    artist: "Mr. CAP",
    label: "CAP Distributions"
  }]
}, {
  year: "2016",
  tracks: [{
    title: "No More Bloodshed",
    artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G",
    label: "Gutterlife Records"
  }]
}, {
  year: "2018",
  tracks: [{
    title: "Today Was A Great Day",
    artist: "Mr. CAP",
    label: "Independent"
  }]
}, {
  year: "2019",
  tracks: [{
    title: "Limitless",
    artist: "Mr. CAP",
    label: "Independent"
  }]
}];
const MusicSection = () => {
  return <section id="music" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Discography
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Music & <span className="text-gradient-gold">Releases</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            From underground classics to digital-age releases, Mr. CAP's catalog reflects 
            a journey — not just a career. Available for streaming, playlisting, sync, and press use.
          </p>
        </div>

        {/* Latest Release Feature */}
        <div className="mb-16">
          <div className="group bg-card-gradient rounded-2xl border border-primary/30 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-square md:aspect-auto overflow-hidden">
                <img src={betnOnMe} alt="Bet'n On Me Single Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card md:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium">
                    Latest Album
                  </span>
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <p className="text-xs text-muted-foreground mb-2">2024 · South Park Coalition LLC</p>
                <h3 className="font-display text-4xl md:text-5xl mb-2">Bet'n on me</h3>
                <p className="text-sm text-cap-gold mb-4">
                  Lead Single: "Bet'n On Me"
                </p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  A grown-man statement album — honest, reflective, and unflinching. 
                  CAP explores loyalty, pain, spirituality, survival, and growth over 
                  cinematic production and Southern knock.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Recorded by K-Water · Mixed by K-Water · Mastered by Mr. CAP · 
                  Executive Produced by South Park Coalition LLC
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="hero" size="sm">
                    <Play className="w-4 h-4" />
                    Play "Bet'n On Me"
                  </Button>
                  <Button variant="outline" size="sm">
                    <Headphones className="w-4 h-4" />
                    Stream Album
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Albums */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-5 h-5 text-primary" />
            <h3 className="font-display text-2xl">Studio & Collab Albums</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map((album, index) => <div key={index} className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {album.image ? <img src={album.image} alt={`${album.title} Album Cover`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-cap-gold/10">
                      <Disc3 className="w-16 h-16 text-primary/40" />
                    </div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-background/80 text-xs font-medium">
                      {album.year}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{album.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{album.artist}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {album.label}
                  </p>
                  <p className="text-xs text-primary/70 mt-1">{album.role}</p>
                </div>
              </div>)}
          </div>
        </div>

        {/* Singles & EPs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Music className="w-5 h-5 text-cap-gold" />
            <h3 className="font-display text-2xl">Singles & EPs</h3>
          </div>
          <div className="space-y-6">
            {singles.map((yearGroup, yearIndex) => <div key={yearIndex}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-cap-gold">{yearGroup.year}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {yearGroup.tracks.map((track, trackIndex) => <div key={trackIndex} className="group flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <Play className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-1">{track.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {track.artist}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>)}
          </div>
        </div>

        {/* Streaming Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Stream Mr. CAP's music on all major platforms:</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              Spotify
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              Apple Music
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              YouTube Music
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              Amazon Music
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default MusicSection;
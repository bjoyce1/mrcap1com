import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Play, 
  Pause,
  ExternalLink, 
  Cpu, 
  Globe, 
  Coins, 
  Building2, 
  Music, 
  Blocks,
  Zap,
  ArrowRight,
  Network,
  Volume2,
  VolumeX
} from "lucide-react";
import dippinMetaverse from "@/assets/dippin-metaverse.png";

const Innovation = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Innovation & Tech - Mr. CAP",
        "description": "Explore Mr. CAP's tech ventures including CAP Distributions digital distribution platform, blockchain projects, NFTs, and the groundbreaking 'Dippin Thru the Metaverse' single.",
        "url": "https://mrcap1.com/innovation",
        "mainEntity": {
          "@type": "Person",
          "name": "Mr. CAP",
          "description": "Houston hip-hop artist, technologist, and entrepreneur",
          "knowsAbout": ["Digital Distribution", "Blockchain", "NFTs", "Web3", "Music Technology", "Computer Network Engineering"]
        }
      },
      {
        "@type": "Organization",
        "name": "CAP Distributions",
        "description": "Digital distribution company helping independent artists make their music available worldwide.",
        "founder": { "@type": "Person", "name": "Mr. CAP" },
        "serviceType": ["Music Distribution", "Graphic Design", "Web Development", "Media Production"]
      },
      {
        "@type": "MusicRecording",
        "name": "Dippin Thru the Metaverse",
        "byArtist": { "@type": "Person", "name": "Mr. CAP" },
        "producer": { "@type": "Person", "name": "​" },
        "datePublished": "2023-12",
        "description": "A groundbreaking blend of Houston street narratives with futuristic production, exploring blockchain and digital innovation."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Innovation", "item": "https://mrcap1.com/innovation" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Innovation & Tech | Mr. CAP – Digital Distribution, Blockchain & Web3</title>
        <meta name="description" content="Explore Mr. CAP's tech ventures: CAP Distributions digital music platform, blockchain/NFT projects, and the groundbreaking 'Dippin Thru the Metaverse' single. Where Houston hip-hop meets technology." />
        <link rel="canonical" href="https://mrcap1.com/innovation" />
        
        <meta property="og:title" content="Innovation & Tech | Mr. CAP" />
        <meta property="og:description" content="Where Houston hip-hop meets blockchain technology and digital innovation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrcap1.com/innovation" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#000000] text-zinc-100">
        <Navigation />
        
        <main className="pt-24">
          {/* Hero Section */}
          <section className="relative py-20 lg:py-32 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8 animate-fade-in">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Innovation & Tech</span>
              </nav>

              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium tracking-widest uppercase text-primary">
                    Tech & Innovation
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
                  Where{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-primary to-violet-400">
                    Hip-Hop
                  </span>
                  <br />Meets Technology
                </h1>
                
                <p className="text-xl text-neutral-400 max-w-2xl mb-8 leading-relaxed">
                  With a background in computer network engineering, Mr. CAP bridges Houston's underground 
                  hip-hop legacy with cutting-edge technology—from digital distribution to blockchain innovation.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="flux" size="lg" onClick={togglePlay}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Now Playing' : 'Play "Dippin Thru the Metaverse"'}
                  </Button>
                  <Button variant="fluxOutline" size="lg" asChild>
                    <Link to="/nft">
                      <Blocks className="w-4 h-4" />
                      Explore NFT Collection
                    </Link>
                  </Button>
                </div>
                <audio
                  ref={audioRef}
                  src="/audio/dippin-thru-metaverse.mp3"
                  preload="metadata"
                  onTimeUpdate={() => {
                    if (audioRef.current) {
                      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
                    }
                  }}
                  onEnded={() => { setIsPlaying(false); setProgress(0); }}
                />
              </div>
            </div>
          </section>

          {/* Featured: Dippin Thru the Metaverse */}
          <section className="py-20 border-t border-white/5 bg-gradient-to-b from-violet-500/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-primary/20 to-violet-500/20 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src={dippinMetaverse} 
                      alt="Dippin Thru the Metaverse single artwork" 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Play overlay */}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
                        {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
                      </div>
                    </button>
                    {/* Progress bar */}
                    {progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/80 text-white text-xs font-medium backdrop-blur-sm mb-3">
                        <Music className="w-3 h-3" />
                        Featured Single
                      </span>
                      <h3 className="text-2xl font-display font-bold text-white">Dippin Thru the Metaverse</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-violet-400 mb-4">
                    <Zap className="w-4 h-4" />
                    December 2023
                  </span>
                  
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                    A Groundbreaking Blend of Hip-Hop & Technology
                  </h2>
                  
                  <div className="space-y-4 text-neutral-300 leading-relaxed mb-8">
                    <p>
                      <strong className="text-white">Produced by ​</strong>, "Dippin Thru the Metaverse" 
                      represents Mr. CAP's forward-thinking approach to music. The track fuses Houston street 
                      narratives with futuristic production, exploring the intersection of digital and real-world experiences.
                    </p>
                    <p>
                      The song's lyrics explore themes of blockchain technology, digital ownership, and the 
                      coexistence of street life with virtual innovation—positioning Mr. CAP as an artist who 
                      adapts and innovates in a rapidly changing industry.
                    </p>
                    <p>
                      The track showcases Mr. CAP's commitment to digital innovation and artist ownership, 
                      continuing his legacy as a pioneer in music technology.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="flux" onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Playing Now' : 'Play Track'}
                    </Button>
                    <Button variant="fluxOutline" asChild>
                      <a href="https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Stream on Spotify
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CAP Distributions */}
          <section className="py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase text-primary">
                      Digital Distribution
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                    CAP Distributions
                  </h2>
                  
                  <div className="space-y-4 text-neutral-300 leading-relaxed mb-8">
                    <p>
                      With his background in <strong className="text-white">computer network engineering</strong>, 
                      Mr. CAP founded CAP Distributions—a digital distribution company that helps independent 
                      artists make their music available worldwide.
                    </p>
                    <p>
                      This initiative underscores his commitment to technology and independence, providing artists 
                      with the tools and infrastructure to distribute their music on all major streaming platforms 
                      without sacrificing ownership or creative control.
                    </p>
                    <p>
                      Beyond distribution, CAP Distributions offers professional-level <strong className="text-white">
                      graphic design, web design, music production, and media solutions</strong>—connecting 
                      independent artists and brands with comprehensive creative services.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Music Distribution", icon: Music },
                      { label: "Graphic Design", icon: Building2 },
                      { label: "Web Development", icon: Globe },
                      { label: "Media Production", icon: Zap },
                    ].map((service, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <service.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <span className="text-xs text-neutral-400">{service.label}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="fluxOutline" asChild>
                    <a href="mailto:wrecklessent@gmail.com?subject=CAP Distributions Inquiry">
                      <ArrowRight className="w-4 h-4" />
                      Inquire About Services
                    </a>
                  </Button>
                </div>

                {/* Visual */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 border border-white/10 rounded-2xl p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Spotify", "Apple Music", "Amazon Music", "YouTube Music",
                        "Tidal", "Deezer", "Pandora", "iHeartRadio"
                      ].map((platform, i) => (
                        <div 
                          key={i} 
                          className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-colors"
                        >
                          <span className="text-sm text-neutral-300">{platform}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-neutral-400 mt-6">
                      Distribute to 150+ streaming platforms worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blockchain & NFT Projects */}
          <section className="py-20 border-t border-white/5 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Blockchain & NFT Pioneer
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  On <strong className="text-white">February 25, 2021</strong>, Mr. CAP became the 
                  <strong className="text-violet-400"> first Houston rap artist to sell a Hip Hop NFT</strong> on the blockchain. 
                  He minted and sold his song "Limitless" on OpenSea as a 1/1 collectible music NFT, 
                  pioneering digital ownership in Houston hip-hop.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: Blocks,
                    title: "NFT Music Collection",
                    description: "The Art of ISM album available as individual NFT tracks, plus exclusive 1/1 collectibles.",
                    link: "/nft",
                    linkText: "View NFT Gallery"
                  },
                  {
                    icon: Network,
                    title: "Web3 Platforms",
                    description: "Music released on Web3 platforms, embracing decentralized distribution and artist ownership.",
                    link: "/discography",
                    linkText: "Explore Music"
                  },
                  {
                    icon: Coins,
                    title: "Digital Ownership",
                    description: "Advocating for artist ownership and financial empowerment through blockchain technology.",
                    link: "/blog",
                    linkText: "Read More"
                  },
                ].map((item, i) => (
                  <div key={i} className="group bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                      <item.icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">{item.description}</p>
                    <Link 
                      to={item.link}
                      className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      {item.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Quote/Highlight */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-8 text-center">
                <blockquote className="text-xl md:text-2xl font-display italic text-white mb-4">
                  "Artists and communities should have access to modern tools and new economic rails."
                </blockquote>
                <p className="text-neutral-400">— Mr. CAP on blockchain & artist empowerment</p>
              </div>
            </div>
          </section>

          {/* Tech Background */}
          <section className="py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
                  Tech Background & Vision
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-primary" />
                      Technical Foundation
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Mr. CAP's background in <strong className="text-white">computer network engineering</strong> 
                      provides the technical foundation for his ventures into digital distribution, 
                      blockchain technology, and Web3 platforms. This unique combination of street-level 
                      authenticity and technical expertise sets him apart in the industry.
                    </p>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-violet-400" />
                      Future Vision
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Looking ahead, Mr. CAP continues to explore the intersection of music, technology, 
                      and ownership. From NFT collections to Web3 distribution platforms, he's building 
                      tools and experiences that extend beyond the studio and stage into tech, finance, 
                      and digital storytelling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 border-t border-white/5">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Ready to Collaborate?
              </h2>
              <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                For tech partnerships, distribution inquiries, or blockchain collaborations, 
                reach out to discuss opportunities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="flux" size="lg" asChild>
                  <a href="mailto:wrecklessent@gmail.com?subject=Tech Partnership Inquiry">
                    Get In Touch
                  </a>
                </Button>
                <Button variant="fluxOutline" size="lg" asChild>
                  <Link to="/nft">
                    <Blocks className="w-4 h-4" />
                    View NFT Collection
                  </Link>
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

export default Innovation;

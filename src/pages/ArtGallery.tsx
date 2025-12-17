import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Palette, ExternalLink, Heart, Sparkles, Crown, Calendar, X } from "lucide-react";
import { gsap } from "@/hooks/useGSAP";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mrCapCoin from "@/assets/mr-cap-coin.png";
import { Button } from "@/components/ui/button";

// 2026 Collection Artwork Imports
import deshiImg from "@/assets/self-love/deshi.png";
import fintiImg from "@/assets/self-love/finti.png";
import jaspinImg from "@/assets/self-love/jaspin.png";
import keliaImg from "@/assets/self-love/kelia.png";
import koliaImg from "@/assets/self-love/kolia.png";
import lolaImg from "@/assets/self-love/lola.png";
import minnieImg from "@/assets/self-love/minnie.png";
import nonahImg from "@/assets/self-love/nonah.png";
import pradaImg from "@/assets/self-love/prada.png";
import sakitaImg from "@/assets/self-love/sakita.png";
import skylaImg from "@/assets/self-love/skyla.png";
import trytidaImg from "@/assets/self-love/trytida.png";
import tyaImg from "@/assets/self-love/tya.png";
import velataImg from "@/assets/self-love/velata.png";
import wydayaImg from "@/assets/self-love/wydaya.png";
import yannaImg from "@/assets/self-love/yanna.png";

gsap.registerPlugin(ScrollTrigger);

const installationRooms = [
  {
    year: "2024",
    title: "The Awakening",
    theme: "Recognition • Vulnerability • First Truths",
    description: "This room introduces the Self Love universe: the moment you realize you've been surviving instead of living. The works here hold raw honesty — the beginning of self-respect, self-definition, and the first refusal to shrink.",
    link: "https://mrcap1.wixstudio.com/selflove",
    linkLabel: "Experience Room I",
    icon: Heart,
    status: "open",
  },
  {
    year: "2025",
    title: "The Becoming",
    theme: "Growth • Boundaries • Voice",
    description: "This room is motion. The characters evolve, the energy changes, the posture shifts. Here, Self Love becomes active — not a feeling, but a decision. The work speaks louder, stands taller, and draws firmer lines.",
    link: "https://selfloveproject.lovable.app/",
    linkLabel: "Enter Interactive Gallery",
    icon: Sparkles,
    status: "open",
  },
  {
    year: "2026",
    title: "The Ownership",
    theme: "Mastery • Permanence • Legacy",
    description: "This final room represents arrival. Not perfection — ownership. The work here seals the story into permanence: self-love as a power source, a standard, and a legacy.",
    link: null,
    linkLabel: "View Collection Below",
    icon: Crown,
    status: "coming",
  },
];

const artwork2026 = [
  { id: "deshi", title: "Deshi", image: deshiImg, meaning: "The keeper of thresholds" },
  { id: "finti", title: "Finti", image: fintiImg, meaning: "Strength worn openly" },
  { id: "jaspin", title: "Jaspin", image: jaspinImg, meaning: "Quiet power in stillness" },
  { id: "kelia", title: "Kelia", image: keliaImg, meaning: "One love, one heart" },
  { id: "kolia", title: "Kolia", image: koliaImg, meaning: "Profile of self-recognition" },
  { id: "lola", title: "Lola", image: lolaImg, meaning: "Eyes closed, spirit awake" },
  { id: "minnie", title: "Minnie", image: minnieImg, meaning: "Color amidst decay" },
  { id: "nonah", title: "Nonah", image: nonahImg, meaning: "Guardian of the door" },
  { id: "prada", title: "Prada", image: pradaImg, meaning: "Gold on grit" },
  { id: "sakita", title: "Sakita", image: sakitaImg, meaning: "Self, proclaimed" },
  { id: "skyla", title: "Skyla", image: skylaImg, meaning: "Bold affirmation in chaos" },
  { id: "trytida", title: "Trytida", image: trytidaImg, meaning: "Loved and unashamed" },
  { id: "tya", title: "Tya", image: tyaImg, meaning: "The look of knowing" },
  { id: "velata", title: "Velata", image: velataImg, meaning: "Weathered but present" },
  { id: "wydaya", title: "Wydaya", image: wydayaImg, meaning: "Fire behind the gaze" },
  { id: "yanna", title: "Yanna", image: yannaImg, meaning: "Love as legacy" },
];

const ArtGallery = () => {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const curatorRef = useRef<HTMLElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<typeof artwork2026[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo(
        ".gsap-hero-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // Timeline animation
      gsap.fromTo(
        ".gsap-timeline-item",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Room cards animation
      gsap.fromTo(
        ".gsap-room-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: roomsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Curator note animation
      gsap.fromTo(
        ".gsap-curator-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: curatorRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Gallery animation
      gsap.fromTo(
        ".gsap-artwork-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToRoom = (year: string) => {
    const element = document.getElementById(`room-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://mrcap1.com/art",
        name: "Self Love — Art Installation by Mr. CAP",
        description: "Self Love is a living, three-year art installation (2024–2026) built from original character-driven works, symbolic portraiture, and narrative fragments by Houston artist Mr. CAP.",
        url: "https://mrcap1.com/art",
        isPartOf: { "@id": "https://mrcap1.com/#website" },
        breadcrumb: { "@id": "https://mrcap1.com/art#breadcrumb" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://mrcap1.com/art#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
          { "@type": "ListItem", position: 2, name: "Art", item: "https://mrcap1.com/art" },
        ],
      },
      {
        "@type": "VisualArtwork",
        name: "Self Love",
        creator: {
          "@type": "Person",
          name: "Mr. CAP",
          url: "https://mrcap1.com",
        },
        artform: "Installation Art",
        description: "A living, three-year art installation built from original character-driven works, symbolic portraiture, and narrative fragments exploring identity, healing, confidence, and self-ownership.",
        temporalCoverage: "2024/2026",
      },
      {
        "@type": "Person",
        "@id": "https://mrcap1.com/#person",
        name: "Mr. CAP",
        url: "https://mrcap1.com",
        sameAs: [
          "https://instagram.com/mrcapism",
          "https://twitter.com/mrcap1",
          "https://www.youtube.com/@mrcap1",
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Self Love — Art Installation by Mr. CAP | 2024–2026</title>
        <meta
          name="description"
          content="Self Love is a living, three-year art installation (2024–2026) by Houston artist Mr. CAP. Explore original character-driven works exploring identity, healing, and self-ownership."
        />
        <link rel="canonical" href="https://mrcap1.com/art" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <Link to="/" className="flex items-center gap-3">
              <img src={mrCapCoin} alt="MR. CAP" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold tracking-tight uppercase">MR. CAP</span>
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 ring-1 ring-primary/20 rounded-lg">
              <Palette className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline text-sm font-medium">Art</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/video/art-hero-bg.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-background/60" />
          
          {/* Gradient Atmosphere */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-40 pointer-events-none"
            style={{
              background: "radial-gradient(50% 50% at 50% 30%, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="gsap-hero-item inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 ring-1 ring-primary/20 rounded-full">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                Art Installation • 2024–2026
              </span>
            </div>

            <h1 className="gsap-hero-item text-5xl md:text-7xl font-display font-extrabold uppercase tracking-wide mb-4">
              Self <span className="text-primary">Love</span>
            </h1>

            <p className="gsap-hero-item text-lg text-muted-foreground mb-2">
              An Art Installation by Mr. CAP
            </p>

            <p className="gsap-hero-item text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
              Self Love is a living, three-year art installation built from original character-driven works, 
              symbolic portraiture, and narrative fragments. This installation is not a "collection" in the 
              traditional sense — it is a timeline you step into.
            </p>

            <p className="gsap-hero-item text-sm text-muted-foreground/80 max-w-xl mx-auto mt-4">
              Each year functions as a new room in the installation: a shift in voice, mood, color, and emotional weight.
              Together, 2024, 2025, and 2026 form a single continuous story about identity, healing, confidence, and self-ownership.
            </p>
          </div>
        </section>

        {/* Installation Map / Timeline */}
        <section ref={timelineRef} className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="gsap-timeline-item text-center text-sm uppercase tracking-widest text-muted-foreground mb-8 font-medium">
              Installation Map
            </h2>
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {installationRooms.map((room, index) => (
                <div key={room.year} className="flex items-center">
                  <button
                    onClick={() => scrollToRoom(room.year)}
                    className={`gsap-timeline-item flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all hover:scale-105 ${
                      room.status === "open"
                        ? "bg-primary/10 ring-1 ring-primary/30 hover:ring-primary/50"
                        : "bg-muted/50 ring-1 ring-border"
                    }`}
                  >
                    <room.icon className={`w-5 h-5 ${room.status === "open" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-lg font-bold ${room.status === "open" ? "text-foreground" : "text-muted-foreground"}`}>
                      {room.year}
                    </span>
                    <span className="text-xs text-muted-foreground">{room.title}</span>
                  </button>
                  {index < installationRooms.length - 1 && (
                    <div className="w-8 md:w-16 h-px bg-border mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Rooms */}
        <section ref={roomsRef} className="py-16 px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-center text-3xl md:text-4xl font-display font-extrabold uppercase tracking-wide mb-12">
              Installation Rooms
            </h2>

            {installationRooms.map((room, index) => (
              <div
                key={room.year}
                id={`room-${room.year}`}
                className={`gsap-room-card relative p-8 md:p-12 rounded-3xl ring-1 ${
                  room.status === "open"
                    ? "bg-card ring-primary/20"
                    : "bg-muted/30 ring-border"
                }`}
              >
                {/* Room Number Badge */}
                <div className="absolute -top-4 left-8 px-4 py-1.5 bg-background ring-1 ring-border rounded-full">
                  <span className="text-sm font-medium text-muted-foreground">Room {index + 1}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                  {/* Year & Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      room.status === "open" ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <room.icon className={`w-8 h-8 ${room.status === "open" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-4xl font-display font-extrabold">{room.year}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide mb-2">
                      {room.title}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-4">{room.theme}</p>
                    <p className="text-muted-foreground leading-relaxed mb-6">{room.description}</p>

                    {room.link ? (
                      <a
                        href={room.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="default" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          {room.linkLabel}
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" disabled className="gap-2">
                        <Calendar className="w-4 h-4" />
                        {room.linkLabel}
                      </Button>
                    )}
                  </div>
                </div>

                {room.status === "coming" && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    Releasing throughout 2026
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2026 Featured Works Gallery */}
        <section ref={galleryRef} id="featured-works-2026" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-primary/10 ring-1 ring-primary/20 rounded-full">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm uppercase tracking-widest font-medium">Room III • 2026</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase tracking-wide mb-4">
                Featured Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The Ownership Collection — Mastery, Permanence, and Legacy sealed into visual permanence.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {artwork2026.map((artwork) => (
                <button
                  key={artwork.id}
                  onClick={() => setSelectedArtwork(artwork)}
                  className="gsap-artwork-card group relative aspect-[3/2] rounded-xl overflow-hidden ring-1 ring-border hover:ring-primary/50 transition-all duration-300"
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display font-bold text-sm uppercase tracking-wide">{artwork.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{artwork.meaning}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Artwork Modal */}
        {selectedArtwork && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
            onClick={() => setSelectedArtwork(null)}
          >
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="max-w-4xl w-full animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                className="w-full h-auto rounded-2xl ring-1 ring-border"
              />
              <div className="mt-6 text-center">
                <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-wide">
                  {selectedArtwork.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-lg">{selectedArtwork.meaning}</p>
                <p className="text-sm text-muted-foreground/60 mt-4">Self Love • Room III • 2026</p>
              </div>
            </div>
          </div>
        )}

        {/* Curator's Note */}
        <section ref={curatorRef} className="py-16 px-6 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="gsap-curator-item text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wide mb-6">
              Curator's Note
            </h2>
            <blockquote className="gsap-curator-item text-lg md:text-xl text-muted-foreground leading-relaxed italic">
              "Self Love is a visual language built from symbols, names, and lived emotional codes.
              Every piece is a chapter. Every chapter is a mirror.
              If you see yourself in the work — that's not an accident. That's the installation working."
            </blockquote>
            <p className="gsap-curator-item mt-6 text-sm text-muted-foreground">— Mr. CAP</p>
          </div>
        </section>

        {/* Collector / NFT Layer */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="gsap-curator-item inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 ring-1 ring-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm uppercase tracking-widest font-medium">Digital Collectibles</span>
            </div>
            <p className="gsap-curator-item text-muted-foreground leading-relaxed">
              Some works may be released as digital collectibles. Release details will be published 
              within the installation as they become available.
            </p>
            <div className="gsap-curator-item mt-6">
              <Link to="/nft">
                <Button variant="outline" className="gap-2">
                  View NFT Gallery
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={mrCapCoin} alt="MR. CAP" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-display text-lg font-bold uppercase">MR. CAP</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              South Park Born. SPC Raised. Independent & Future-Focused.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
                Home
              </Link>
              <Link to="/nft" className="text-sm text-muted-foreground hover:text-foreground transition">
                NFT Gallery
              </Link>
              <Link to="/epk" className="text-sm text-muted-foreground hover:text-foreground transition">
                EPK
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ArtGallery;

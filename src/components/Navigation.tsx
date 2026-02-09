import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Facebook, Youtube, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/mr-cap-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const socialLinks = [
  { href: "https://www.instagram.com/mrcapism/", label: "Instagram", icon: Instagram },
  { href: "https://x.com/mrcap1", label: "X", icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )},
  { href: "https://www.facebook.com/mrcap11", label: "Facebook", icon: Facebook },
  { href: "https://www.youtube.com/@mrcap1", label: "YouTube", icon: Youtube },
  { href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", label: "Spotify", icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )},
  { href: "https://www.tiktok.com/@mrcapism", label: "TikTok", icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )},
];

const navLinks = [
  { to: "/who-is-mr-cap", label: "Who Is Mr. CAP?" },
  { to: "/legacy", label: "Legacy" },
  { to: "/live", label: "Live" },
  { to: "/press", label: "Press" },
  { to: "/blog", label: "Blog" },
  { to: "/merch", label: "Merch", highlight: true },
  { to: "/opk", label: "OPK", highlight: true },
  { to: "/nft", label: "NFT", highlight: true },
  { to: "/innovation", label: "Tech", highlight: true },
];

const musicDropdownLinks = [
  { to: "/listen", label: "Stream" },
  { to: "/music", label: "Music" },
  { to: "/mr-cap-discography", label: "Discography" },
];

const homeSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "music", label: "Music" },
  { id: "live", label: "Live" },
  { id: "press", label: "Press" },
  { id: "video", label: "Video" },
  { id: "ventures", label: "Ventures" },
  { id: "contact", label: "Contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isMusicActive = musicDropdownLinks.some(link => location.pathname === link.to);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (isHomePage) {
        const sectionElements = homeSections.map((s) => ({
          id: s.id,
          element: document.getElementById(s.id),
        }));

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const section = sectionElements[i];
          if (section.element) {
            const rect = section.element.getBoundingClientRect();
            if (rect.top <= 100) {
              setActiveSection(section.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-black/20 backdrop-blur-lg"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="Mr. CAP Logo" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-white/80">
            <span className="flex items-center gap-2 text-white border-b border-primary/50 pb-0.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Mr. CAP
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/who-is-mr-cap"
            className={cn(
              "text-sm font-medium tracking-wide transition-colors",
              location.pathname === "/who-is-mr-cap"
                ? "text-white"
                : "text-white/80 hover:text-white"
            )}
          >
            Who Is Mr. CAP?
          </Link>
          
          {/* Music Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "flex items-center gap-1 text-sm font-medium tracking-wide transition-colors outline-none",
              isMusicActive
                ? "text-white"
                : "text-white/80 hover:text-white"
            )}>
              Music
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background border border-border/50 z-50">
              {musicDropdownLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      "w-full cursor-pointer",
                      location.pathname === link.to && "text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                link.highlight
                  ? "text-primary border-b border-primary pb-0.5 hover:text-primary/80"
                  : location.pathname === link.to
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Social Icons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="hidden md:block w-px h-5 bg-white/30" />

          <Link
            to="/#contact"
            className="hidden md:block text-xs font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors"
          >
            Contact
          </Link>
          
          {/* Mobile Menu Button - hidden when bottom nav is active */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden p-2 text-white hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-white/5 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg",
                location.pathname === "/"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              Home
            </Link>
            {/* Music Section with sub-links */}
            <div className="px-4 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground/70">
              Music
            </div>
            {musicDropdownLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-6 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg",
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg",
                  link.highlight
                    ? "text-primary bg-primary/10 border border-primary/30"
                    : location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Social Icons */}
            <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t border-white/10">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-2"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;

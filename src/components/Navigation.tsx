import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/mr-cap-logo.png";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/music", label: "Music" },
  { to: "/live", label: "Live" },
  { to: "/press", label: "Press" },
  { to: "/blog", label: "Blog" },
  { to: "/cities", label: "Cities" },
  { to: "/epk", label: "EPK", highlight: true },
  { to: "/nft", label: "NFT", highlight: true },
  { to: "/art", label: "Art", highlight: true },
  { to: "/innovation", label: "Tech", highlight: true },
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
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="Mr. CAP Logo" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground border-b border-primary/50 pb-0.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Mr. CAP
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                link.highlight
                  ? "text-primary border-b border-primary pb-0.5 hover:text-primary/80"
                  : location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <Link
            to="/#contact"
            className="hidden md:block text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
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
            {navLinks.map((link) => (
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
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;

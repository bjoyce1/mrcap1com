import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "music", label: "Music" },
  { id: "live", label: "Live" },
  { id: "press", label: "Press" },
  { id: "brand", label: "Brand" },
  { id: "video", label: "Video" },
  { id: "ventures", label: "Ventures" },
  { id: "contact", label: "Contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sectionElements = sections.map((s) => ({
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

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
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-sm">MC</span>
          </div>
          <span className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground border-b border-primary/50 pb-0.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Mr. CAP
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {isHomePage ? (
            <>
              {sections.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors",
                    activeSection === s.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </a>
              ))}
              <Link
                to="/nft"
                className="flex items-center gap-2 text-primary border-b border-primary pb-0.5
                           text-sm font-medium hover:text-primary/80 transition-colors"
              >
                <span className="w-2 h-[1px] bg-primary" />
                NFT Gallery
              </Link>
            </>
          ) : (
            <Link
              to="/"
              className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="hidden md:block text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-white/5 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
            {isHomePage ? (
              <>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg",
                      activeSection === s.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
                <Link
                  to="/nft"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg
                             text-primary bg-primary/10 border border-primary/30 mt-2"
                >
                  NFT Gallery
                </Link>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg
                           text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                Back to Home
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
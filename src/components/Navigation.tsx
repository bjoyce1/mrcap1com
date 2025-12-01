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
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-wider">
          <span className="text-primary">MR.</span>{" "}
          <span className="text-foreground">CAP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {isHomePage ? (
            <>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "px-3 py-2 text-xs uppercase tracking-widest font-medium transition-colors rounded-full",
                    activeSection === s.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {s.label}
                </a>
              ))}
              <Link
                to="/nft"
                className="px-3 py-2 text-xs uppercase tracking-widest font-medium transition-colors rounded-full
                           text-accent hover:text-accent hover:bg-accent/10 border border-accent/30"
              >
                NFT Gallery
              </Link>
            </>
          ) : (
            <Link
              to="/"
              className="px-3 py-2 text-xs uppercase tracking-widest font-medium transition-colors rounded-full
                         text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              Back to Home
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {isHomePage ? (
              <>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors rounded-lg",
                      activeSection === s.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
                <Link
                  to="/nft"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors rounded-lg
                             text-accent bg-accent/10 border border-accent/30 mt-2"
                >
                  NFT Gallery
                </Link>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors rounded-lg
                           text-muted-foreground hover:text-foreground hover:bg-secondary"
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

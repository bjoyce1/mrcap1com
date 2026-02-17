import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import mrCapCoin from "@/assets/mr-cap-coin.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { to: "/listen", label: "Music" },
  { to: "/live", label: "Live" },
  { to: "/nft", label: "NFT" },
  { to: "/who-is-mr-cap", label: "About" },
  { to: "/press", label: "Press" },
];

const moreLinks = [
  { to: "/opk", label: "OPK" },
  { to: "/merch", label: "Merch" },
  { to: "/innovation", label: "Tech" },
  { to: "/blog", label: "Blog" },
  { to: "/mr-cap-discography", label: "Discography" },
  { to: "/legacy", label: "Legacy" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isMoreActive = moreLinks.some(link => location.pathname === link.to);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        "bg-background/20 backdrop-blur-xl",
        isScrolled && "bg-background/60 border-b border-primary/10 shadow-[0_1px_30px_hsl(var(--primary)/0.05)]"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16 lg:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={mrCapCoin} 
            alt="Mr. CAP" 
            className="w-9 h-9 rounded-full object-cover transition-transform duration-500 group-hover:rotate-[360deg]"
          />
          <span className="font-display text-base tracking-wider text-foreground">
            MR. CAP
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {primaryLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-[13px] font-medium tracking-widest uppercase transition-colors link-sweep",
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "flex items-center gap-1 text-[13px] font-medium tracking-widest uppercase transition-colors outline-none",
              isMoreActive
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground"
            )}>
              More
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border border-border z-50 min-w-[160px]">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      "w-full cursor-pointer text-sm",
                      location.pathname === link.to && "text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <Link
            to="/#contact"
            className="hidden md:block text-[13px] font-medium tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors link-sweep"
          >
            Contact
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-white/5 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
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
            {[...primaryLinks, ...moreLinks].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium tracking-wide transition-colors rounded-lg",
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors rounded-lg"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
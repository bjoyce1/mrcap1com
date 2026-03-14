import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import mrCapCoin from "@/assets/mr-cap-coin.png";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/mrcapism/", label: "@mrcapism" },
    { icon: Twitter, href: "https://x.com/mrcap1", label: "@mrcap1" },
    { icon: Facebook, href: "https://www.facebook.com/mrcap11", label: "@mrcap11" },
    { icon: Youtube, href: "https://www.youtube.com/@mrcap1", label: "@mrcap1" },
    { icon: TikTokIcon, href: "https://www.tiktok.com/@mrcapism", label: "@mrcapism" },
  ];

  const siteLinks = [
    { label: "Music", href: "/music", isRoute: true },
    { label: "Discography", href: "/mr-cap-discography", isRoute: true },
    { label: "Biography", href: "/biography", isRoute: true },
    { label: "NFT Gallery", href: "/nft", isRoute: true },
    { label: "About", href: "/who-is-mr-cap", isRoute: true },
    { label: "Press", href: "/press", isRoute: true },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "Contact", href: "/#contact", isRoute: false },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-background overflow-hidden">
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80px] bg-primary/5 blur-[60px] rounded-full" />
      
      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          {/* Brand Mark — Larger */}
          <a href="#hero" className="group inline-flex flex-col items-center gap-4 mb-10">
            <img 
              src={mrCapCoin} 
              alt="MR. CAP" 
              className="w-16 h-16 rounded-full object-cover transition-transform duration-700 group-hover:rotate-[360deg]" 
            />
            <span className="font-display text-2xl tracking-wider text-foreground">
              MR. CAP
            </span>
          </a>
          
          <p className="text-sm text-muted-foreground mb-10">
            South Park Coalition · Houston, TX
          </p>

          {/* Links — Horizontal */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {siteLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest link-sweep"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest link-sweep"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mb-12">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground 
                         hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} MR. CAP. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
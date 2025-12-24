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

  const platformLinks = [
    { label: "Music", href: "/music", isRoute: true },
    { label: "Discography", href: "/mr-cap-discography", isRoute: true },
    { label: "NFT Gallery", href: "/nft", isRoute: true },
  ];

  const companyLinks = [
    { label: "Who Is Mr. CAP?", href: "/who-is-mr-cap", isRoute: true },
    { label: "About", href: "/about", isRoute: true },
    { label: "Press", href: "/press", isRoute: true },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "Contact", href: "/#contact", isRoute: false },
  ];

  return (
    <footer className="border-t border-white/5 bg-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <a href="#hero" className="inline-flex items-center gap-3 mb-4">
              <img src={mrCapCoin} alt="MR. CAP" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-display text-xl font-medium tracking-tight text-foreground">
                MR. CAP
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              South Park Coalition · Houston, TX
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground 
                           hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Copyright © {new Date().getFullYear()} MR. CAP. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
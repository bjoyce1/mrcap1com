import { Instagram, Twitter, Facebook, Youtube, Music } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/mrcap.eth", label: "@mrcap.eth" },
    { icon: Twitter, href: "https://twitter.com/mrcap1", label: "@mrcap1" },
    { icon: Facebook, href: "https://facebook.com/mrcap1", label: "@mrcap1" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Music, href: "#", label: "Spotify" },
  ];

  const platformLinks = [
    { label: "Music", href: "#music" },
    { label: "Videos", href: "#video" },
    { label: "NFT Gallery", href: "/nft" },
  ];

  const companyLinks = [
    { label: "About", href: "#about" },
    { label: "Press", href: "#press" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="border-t border-white/5 bg-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <a href="#hero" className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-display font-bold text-primary text-xs">MC</span>
              </div>
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
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
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
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
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
import { Instagram, Twitter, Facebook, Youtube, Music } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/mrcap.eth", label: "@mrcap.eth" },
    { icon: Twitter, href: "https://twitter.com/mrcap1", label: "@mrcap1" },
    { icon: Facebook, href: "https://facebook.com/mrcap1", label: "@mrcap1" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Music, href: "#", label: "Spotify" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div>
            <a href="#hero" className="font-display text-3xl tracking-wider">
              <span className="text-primary">MR.</span>{" "}
              <span className="text-foreground">CAP</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              South Park Coalition · Houston, TX
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MR. CAP · South Park Coalition LLC · All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Helmet } from "react-helmet-async";
import { ExternalLink, Music, Calendar, ShoppingBag, Mail, Disc3, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NewsletterSignup from "@/components/NewsletterSignup";
import mrCapLogo from "@/assets/mr-cap-logo.png";

const links = [
  {
    title: "🎵 Latest Music",
    description: "Stream on Spotify, Apple Music & more",
    url: "https://open.spotify.com/artist/3jK9MiCrA9DGSn3HeFKPzE",
    icon: Music,
    featured: true,
  },
  {
    title: "🎤 Book a Show",
    description: "Bring Mr. CAP to your event",
    url: "/booking",
    internal: true,
    icon: Calendar,
  },
  {
    title: "🛒 Trap University Merch",
    description: "Official streetwear collection",
    url: "/merch",
    internal: true,
    icon: ShoppingBag,
  },
  {
    title: "🎨 NFT Art Gallery",
    description: "Collect exclusive digital art",
    url: "/nft",
    internal: true,
    icon: Sparkles,
  },
  {
    title: "📰 Press Kit (EPK)",
    description: "Media & brand partnerships",
    url: "/epk",
    internal: true,
    icon: Users,
  },
  {
    title: "🎹 Discography",
    description: "35+ years of music",
    url: "/mr-cap-discography",
    internal: true,
    icon: Disc3,
  },
];

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/mrcap1", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { name: "Twitter/X", url: "https://twitter.com/mrcap1", color: "bg-black" },
  { name: "YouTube", url: "https://youtube.com/@mrcap1", color: "bg-red-600" },
  { name: "Facebook", url: "https://facebook.com/mrcap1", color: "bg-blue-600" },
];

const Links = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mr. CAP",
    "url": "https://mrcap1.com/links",
    "image": "https://mrcap1.com/images/mr-cap-logo.png",
    "sameAs": socialLinks.map(s => s.url)
  };

  return (
    <>
      <Helmet>
        <title>Mr. CAP | Links</title>
        <meta name="description" content="Quick links to Mr. CAP's music, merch, shows, and more. Houston hip-hop legend and South Park Coalition co-founder." />
        <link rel="canonical" href="https://mrcap1.com/links" />
        <meta property="og:title" content="Mr. CAP | Links" />
        <meta property="og:description" content="Quick links to Mr. CAP's music, merch, shows, and more." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrcap1.com/links" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Decorative background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-flux-accent/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-flux-accent/10 rounded-full blur-3xl" />
        </div>

        <main className="relative z-10 max-w-md mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg shadow-primary/20">
              <img 
                src={mrCapLogo} 
                alt="Mr. CAP" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-display font-bold mb-1">Mr. CAP</h1>
            <p className="text-muted-foreground text-sm">
              Houston Hip-Hop Legend • SPC Co-Founder
            </p>
          </div>

          {/* Main Links */}
          <div className="space-y-3 mb-8">
            {links.map((link) => {
              const Icon = link.icon;
              const content = (
                <div className={`
                  group relative w-full p-4 rounded-xl border transition-all duration-300
                  ${link.featured 
                    ? 'bg-gradient-to-r from-primary/20 to-flux-accent/20 border-primary/30 hover:border-primary/50' 
                    : 'bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80'
                  }
                `}>
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${link.featured ? 'bg-primary/20' : 'bg-card'}
                    `}>
                      <Icon className={`w-5 h-5 ${link.featured ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-sm">{link.title}</h3>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );

              return link.internal ? (
                <Link key={link.title} to={link.url} className="block">
                  {content}
                </Link>
              ) : (
                <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3 mb-8">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform`}
                title={social.name}
              >
                {social.name.charAt(0)}
              </a>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mb-8">
            <NewsletterSignup source="linkinbio" variant="hero" />
          </div>

          {/* Website Link */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Visit Full Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default Links;

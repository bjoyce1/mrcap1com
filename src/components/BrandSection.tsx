import { Palette, Image, Type, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const BrandSection = () => {
  const colors = [
    { name: "CAP Black", hex: "#050509", hsl: "hsl(240, 7%, 3%)" },
    { name: "SPC Red", hex: "#E02424", hsl: "hsl(0, 76%, 51%)" },
    { name: "Accent Gold", hex: "#F5C542", hsl: "hsl(43, 91%, 61%)" },
    { name: "Steel Gray", hex: "#1E2126", hsl: "hsl(216, 13%, 13%)" },
  ];

  return (
    <section id="brand" className="py-24 md:py-32 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Visual Identity
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Brand <span className="text-gradient-gold">Assets</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            To keep the brand consistent across flyers, features, podcasts, blogs, and playlists, 
            please use the approved logos, photos, and artwork below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Logos & Monograms */}
          <div className="bg-card-gradient rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl">Logos & Monograms</h3>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>• Official MR. CAP wordmark</li>
              <li>• C–A–P monogram with negative-space A</li>
              <li>• Light and dark variants (PNG/SVG)</li>
              <li>• Transparent backgrounds included</li>
            </ul>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4" />
              Download Logo Pack
            </Button>
          </div>

          {/* Album & Single Artwork */}
          <div className="bg-card-gradient rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cap-gold/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-cap-gold" />
              </div>
              <h3 className="font-display text-xl">Album Artwork</h3>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>• The Ties That Bind Us (cover art)</li>
              <li>• 2 Tha Grave (cover art)</li>
              <li>• Selected singles artwork</li>
              <li>• Social media banner templates</li>
            </ul>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4" />
              Download Artwork Bundle
            </Button>
          </div>

          {/* Colors & Typography */}
          <div className="bg-card-gradient rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl">Colors & Type</h3>
            </div>

            <div className="space-y-3 mb-6">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-border shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{color.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Typography: Bold, modern sans-serif for titles. Clean sans for body — 
              street-meets-tech aesthetic.
            </p>
          </div>
        </div>

        {/* Full Brand Kit CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-card-gradient border border-border text-center">
          <h3 className="font-display text-2xl mb-2">Need the Complete Brand Kit?</h3>
          <p className="text-muted-foreground mb-6">
            Download the full brand guidelines including logos, colors, typography, 
            and usage examples for designers and media partners.
          </p>
          <Button variant="hero" size="lg">
            <Download className="w-4 h-4" />
            Download Full Brand Kit
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;

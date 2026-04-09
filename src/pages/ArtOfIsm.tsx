import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { ArrowRight, BookOpen, Star, Sparkles, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import artOfIsmTitle from "@/assets/art-of-ism-title.png";
import artOfIsmPoster from "@/assets/art-of-ism-poster.png";
import artOfIsmQr from "@/assets/art-of-ism-qr.png";

const highlights = [
  { icon: BookOpen, label: "11 Immersive Chapters" },
  { icon: Star, label: "Exclusive ISM Codes" },
  { icon: Quote, label: "Quote Vault" },
  { icon: Sparkles, label: "Interactive Experience" },
];

const ArtOfIsm = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "name": "The Art of ISM",
        "author": { "@type": "Person", "name": "Mr. CAP" },
        "url": "https://theartofism.com",
        "description": "A Code of Thought, Movement, and Mastery — an interactive online book experience by Mr. CAP.",
        "genre": "Philosophy / Self-Development",
        "publisher": { "@type": "Person", "name": "Mr. CAP" },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
          { "@type": "ListItem", position: 2, name: "The Art of ISM", item: "https://mrcap1.com/art-of-ism" },
        ],
      },
    ],
  };

  return (
    <>
      <SEO
        title="The Art of ISM — Interactive Book by Mr. CAP"
        description="A Code of Thought, Movement, and Mastery. 11 immersive chapters, exclusive ISM codes, and a quote vault. Enter the interactive online book experience."
        canonical="https://mrcap1.com/art-of-ism"
        ogType="book"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[hsl(var(--background))] to-[hsl(var(--background))]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_70%)]" />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
              <ScrollReveal>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left — Poster Image */}
                  <div className="flex justify-center">
                    <img
                      src={artOfIsmPoster}
                      alt="The Art of ISM by Mr. CAP — Book Cover"
                      className="w-full max-w-md rounded-2xl shadow-2xl shadow-primary/20 ring-1 ring-white/10"
                    />
                  </div>

                  {/* Right — Content */}
                  <div className="text-center lg:text-left space-y-6">
                    <img
                      src={artOfIsmTitle}
                      alt="The Art of ISM"
                      className="h-32 md:h-44 object-contain mx-auto lg:mx-0"
                    />
                    <p className="text-lg md:text-xl text-muted-foreground font-display tracking-wide uppercase">
                      A Code of Thought, Movement, and Mastery
                    </p>
                    <p className="text-muted-foreground max-w-lg mx-auto lg:mx-0">
                      A philosophy built from experience. Refined through movement.
                      Tested under pressure. This isn't just something you read —
                      it's something you live. <em className="text-primary">It's all ISM.</em>
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                      {highlights.map((h) => (
                        <div
                          key={h.label}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] ring-1 ring-white/10"
                        >
                          <h.icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">{h.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                      <Button variant="default" size="lg" asChild>
                        <a href="https://theartofism.com" target="_blank" rel="noopener noreferrer">
                          Enter the Book <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>

                    {/* QR Code */}
                    <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
                      <img
                        src={artOfIsmQr}
                        alt="Scan to visit The Art of ISM"
                        className="w-20 h-20 rounded-lg bg-white p-1"
                      />
                      <p className="text-xs text-muted-foreground max-w-[140px]">
                        Scan to enter the interactive book experience
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Embedded Preview */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-display text-foreground mb-3">
                    Preview the Experience
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Explore the interactive online book right here, or open it in a new tab for the full experience.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-primary/10 mx-auto max-w-5xl">
                  <div className="aspect-video">
                    <iframe
                      src="https://theartofism.com"
                      title="The Art of ISM — Interactive Book"
                      className="w-full h-full border-0"
                      loading="lazy"
                      allow="autoplay; fullscreen"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                  {/* Overlay CTA */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-center">
                    <Button variant="default" size="sm" asChild>
                      <a href="https://theartofism.com" target="_blank" rel="noopener noreferrer">
                        Open Full Experience <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ArtOfIsm;

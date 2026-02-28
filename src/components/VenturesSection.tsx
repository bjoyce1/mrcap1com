import { Building2, Disc, Coins, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const VenturesSection = () => {
  const ventures = [
    {
      icon: Building2,
      name: "Mortuary Media LLC",
      description:
        "Specialized media services for end-of-life events — including funeral program design, tribute videos, memorial websites, and custom writing — created to honor lives with dignity, creativity, and care.",
      color: "primary",
      borderColor: "hsl(var(--primary))",
      gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.15), hsl(var(--background)))",
    },
    {
      icon: Disc,
      name: "CAP Distributions",
      description:
        "With his background in computer network engineering, Mr. CAP founded CAP Distributions — a digital distribution company helping independent artists make their music available worldwide. Beyond distribution, it offers professional graphic design, web design, and media solutions.",
      color: "gold",
      borderColor: "hsl(var(--cap-gold))",
      gradient: "linear-gradient(180deg, hsl(var(--cap-gold) / 0.15), hsl(var(--background)))",
    },
    {
      icon: Coins,
      name: "Metaverse & Blockchain",
      description:
        "Mr. CAP's 'Dippin Thru the Metaverse' single reflects his interest in blockchain and NFT culture — portraying the coexistence of street life and digital innovation. His work explores ownership, transparency, and financial empowerment for artists.",
      color: "primary",
      borderColor: "hsl(var(--primary))",
      gradient: "linear-gradient(210deg, hsl(var(--primary) / 0.15), hsl(var(--background)))",
      url: "https://www.sound.xyz/mrcap/releases",
    },
  ];

  const chromaItems: ChromaGridItem[] = ventures.map((v) => ({
    title: v.name,
    subtitle: v.description,
    borderColor: v.borderColor,
    gradient: v.gradient,
    url: v.url,
    // Pass extra data for renderCard
    icon: v.icon,
    color: v.color,
  }));

  return (
    <section id="ventures" className="py-24 md:py-32 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <ScrollReveal width="100%">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              Entrepreneurship
            </span>
            <h2 className="font-display text-5xl md:text-6xl mt-2">
              Beyond Music: <span className="text-gradient-gold">Ventures</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              Mr. CAP's vision moves beyond the studio and stage. He builds tools, visuals,
              and experiences that extend into tech, finance, and storytelling.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ position: 'relative', minHeight: '300px' }}>
          <ChromaGrid
            items={chromaItems}
            columns={3}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            renderCard={(item) => {
              const Icon = item.icon as React.ComponentType<{ className?: string }>;
              const color = item.color as string;
              return (
                <div className="p-8 flex flex-col h-full">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                      color === "gold" ? "bg-cap-gold/20" : "bg-primary/10"
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${color === "gold" ? "text-cap-gold" : "text-primary"}`} />
                  </div>
                  <h3 className="font-display text-2xl mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {item.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary group-hover:text-cap-gold transition-colors cursor-pointer">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            }}
          />
        </div>

        <ScrollReveal width="100%" delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              For collaboration, tech partnerships, or white-label creative services,
              reach out through the contact section below.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VenturesSection;

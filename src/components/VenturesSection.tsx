import { Building2, Disc, Coins, ArrowRight } from "lucide-react";

const VenturesSection = () => {
  const ventures = [
    {
      icon: Building2,
      name: "Mortuary Media LLC",
      description:
        "Specialized media services for end-of-life events — including funeral program design, tribute videos, memorial websites, and custom writing — created to honor lives with dignity, creativity, and care.",
      color: "primary",
    },
    {
      icon: Disc,
      name: "CAP Distributions",
      description:
        "With his background in computer network engineering, Mr. CAP founded CAP Distributions — a digital distribution company helping independent artists make their music available worldwide. Beyond distribution, it offers professional graphic design, web design, and media solutions.",
      color: "gold",
    },
    {
      icon: Coins,
      name: "Metaverse & Blockchain",
      description:
        "Mr. CAP's 'Dippin Thru the Metaverse' single reflects his interest in blockchain and NFT culture — portraying the coexistence of street life and digital innovation. His work explores ownership, transparency, and financial empowerment for artists.",
      color: "primary",
      link: "https://www.sound.xyz/mrcap/releases",
    },
  ];

  return (
    <section id="ventures" className="py-24 md:py-32 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
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

        {/* Ventures Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {ventures.map((venture, index) => {
            const CardWrapper = venture.link ? 'a' : 'div';
            const cardProps = venture.link ? { href: venture.link, target: "_blank", rel: "noopener noreferrer" } : {};
            
            return (
              <CardWrapper
                 key={index}
                 {...cardProps}
                 className="group bg-card-gradient rounded-2xl border border-border p-8 hover:border-primary/30 transition-all duration-300 block card-lift glass-hover"
               >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    venture.color === "gold" ? "bg-cap-gold/20" : "bg-primary/10"
                  }`}
                >
                  <venture.icon
                    className={`w-7 h-7 ${
                      venture.color === "gold" ? "text-cap-gold" : "text-primary"
                    }`}
                  />
                </div>

                <h3 className="font-display text-2xl mb-4">{venture.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {venture.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-primary group-hover:text-cap-gold transition-colors cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            For collaboration, tech partnerships, or white-label creative services, 
            reach out through the contact section below.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VenturesSection;

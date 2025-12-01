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
      name: "Cap Distributions",
      description:
        "A digital distribution and creative services company connecting independent artists and brands with professional-level graphic design, web design, music production, and media solutions.",
      color: "gold",
    },
    {
      icon: Coins,
      name: "Blockchain & Capicoin",
      description:
        "Emerging fintech and blockchain concepts focused on ownership, transparency, and financial empowerment — reflecting Mr. CAP's belief that artists and communities should have access to modern tools and new economic rails.",
      color: "primary",
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
          {ventures.map((venture, index) => (
            <div
              key={index}
              className="group bg-card-gradient rounded-2xl border border-border p-8 hover:border-primary/30 transition-all duration-300"
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
            </div>
          ))}
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

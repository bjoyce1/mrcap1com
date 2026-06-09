import trapUniversityLogo from "@/assets/trap-university-logo.webp";

const BrandStrip = () => (
  <section className="py-12 border-y border-border/30 bg-card/20">
    <div className="container mx-auto px-4">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
        Brands
      </p>
      <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
        <a
          href="#trap-university"
          className="group flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-primary/40 bg-card hover:border-primary transition-colors"
        >
          <img
            src={trapUniversityLogo}
            alt="Trap University"
            className="h-16 md:h-20 w-auto invert opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs uppercase tracking-widest text-primary">
            Shop the Collection
          </span>
        </a>

        <div className="flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-2xl border border-dashed border-border/40 min-h-[140px] min-w-[180px]">
          <span className="text-2xl font-display font-bold text-muted-foreground/40">
            ?
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
            New Brand Coming Soon
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default BrandStrip;

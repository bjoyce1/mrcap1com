import { bookingPageData } from "@/content/booking";

const CredentialsBand = () => (
  <section className="py-10 border-y border-border/30 bg-card/20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {bookingPageData.credentials.map((c) => (
          <div key={c.label} className="text-center">
            <div className="font-mono text-3xl md:text-4xl font-bold text-gold mb-1">
              {c.stat}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CredentialsBand;

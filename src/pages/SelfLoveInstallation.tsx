import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

function RoomCard({
  room,
  year,
  title,
  tags,
  to,
  disabled,
}: {
  room: string;
  year: string;
  title: string;
  tags: string[];
  to: string;
  disabled?: boolean;
}) {
  const Card = (
    <article className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/50 p-6 hover:bg-card/70 transition-all duration-300">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/30" />
      <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
        {room}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">
        {year}: {title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border/20 bg-muted/30 px-3 py-1 text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <span
          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition
          ${
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {disabled ? "Coming Soon" : "Enter Room"}
        </span>
      </div>
    </article>
  );

  return disabled ? (
    Card
  ) : (
    <Link to={to} className="block group">
      {Card}
    </Link>
  );
}

export default function SelfLoveInstallation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="mx-auto max-w-6xl px-4 py-20 pt-32">
        <ScrollReveal width="100%">
          <header className="mb-12">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Art Installation
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold uppercase tracking-wide">
              SELF LOVE
              <span className="block text-lg sm:text-xl font-normal normal-case opacity-80 mt-3">
                An Art Installation by Mr. CAP (2024–2026)
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Three rooms. One continuous story. Character-driven works, symbolic
              portraiture, and narrative fragments exploring the journey of
              self-discovery and self-acceptance.
            </p>
          </header>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {([
            { room: "Room I", year: "2024", title: "The Awakening", tags: ["Recognition", "Vulnerability", "First Truths"] as string[], to: "/self-love/2024" },
            { room: "Room II", year: "2025", title: "The Becoming", tags: ["Growth", "Boundaries", "Voice"] as string[], to: "/self-love/2025", disabled: true },
            { room: "Room III", year: "2026", title: "The Ownership", tags: ["Mastery", "Permanence", "Legacy"] as string[], to: "/self-love/2026", disabled: true },
          ]).map((props, i) => (
            <ScrollReveal key={props.room} width="100%" delay={0.15 * i}>
              <RoomCard {...props} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal width="100%" delay={0.5}>
          <div className="mt-16 p-6 rounded-2xl border border-border/20 bg-card/30">
            <p className="text-sm italic text-muted-foreground">
              <strong className="text-foreground">Curator's Note:</strong> "Self
              Love is a visual language built from symbols, names, and lived
              emotional codes. Every piece is a chapter. Every chapter is a
              mirror."
            </p>
          </div>
        </ScrollReveal>
      </section>
      <Footer />
    </div>
  );
}

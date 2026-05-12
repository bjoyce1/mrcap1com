import { Link } from "react-router-dom";
import Reveal from "@/components/v2/Reveal";
import MagneticButton from "@/components/v2/MagneticButton";

interface Item {
  to: string;
  eyebrow: string;
  title: string;
  meta: string;
}

const ITEMS: Item[] = [
  { to: "/press", eyebrow: "Press", title: "Latest features & interviews", meta: "Press hub" },
  { to: "/blog", eyebrow: "Journal", title: "Notes from the studio", meta: "Blog" },
  { to: "/videos", eyebrow: "Visuals", title: "Music videos & visualizers", meta: "Watch" },
];

export default function NewsTriptych() {
  return (
    <section className="v2-surface px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <Reveal>
        <p className="v2-eyebrow mb-4">Recent</p>
        <h2 className="v2-display text-v2-ink text-[clamp(1.75rem,4vw,3.5rem)] max-w-[20ch] mb-16">
          The latest, from every corner of the world Mr. CAP built.
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-px bg-v2-ink/10">
        {ITEMS.map((item, i) => (
          <Reveal key={item.to} delay={i * 0.08}>
            <Link
              to={item.to}
              className="block bg-v2-bg p-8 md:p-10 h-full group transition-colors duration-500 hover:bg-v2-surface1"
            >
              <p className="v2-eyebrow mb-6">{item.eyebrow}</p>
              <h3 className="v2-display text-v2-ink text-2xl md:text-3xl mb-12 group-hover:text-v2-accent transition-colors duration-500">
                {item.title}
              </h3>
              <span className="v2-link-sweep v2-eyebrow text-v2-ink-muted">{item.meta} →</span>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <MagneticButton variant="outline" href="/press">All press & news</MagneticButton>
      </div>
    </section>
  );
}

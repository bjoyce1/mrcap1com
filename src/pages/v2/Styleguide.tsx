import { Helmet } from "react-helmet-async";
import CinematicHero from "@/components/v2/CinematicHero";
import EditorialBlock from "@/components/v2/EditorialBlock";
import Rail from "@/components/v2/Rail";
import CoverCard from "@/components/v2/CoverCard";
import MagneticButton from "@/components/v2/MagneticButton";
import SectionHeader from "@/components/v2/SectionHeader";
import Marquee from "@/components/v2/Marquee";
import Reveal from "@/components/v2/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2400&q=80&auto=format&fit=crop";
const COVERS = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
  "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=900&q=80",
  "https://images.unsplash.com/photo-1462965326201-d02e4f455804?w=900&q=80",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&q=80",
];

export default function StyleguideV2() {
  return (
    <div className="v2-surface min-h-screen font-v2sans">
      <Helmet>
        <title>V2 Styleguide — Mr. CAP Legacy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* HERO */}
      <CinematicHero
        image={HERO_IMG}
        eyebrow="Phase 1 — Cinematic Editorial"
        title={
          <>
            Built for the <em className="v2-display-italic">legacy</em>.
          </>
        }
        subtitle="A new design language for Mr. CAP. Monochrome surfaces, oxblood accent, slow refined motion. Pick the elements that feel right and we'll roll the system across every page."
        actions={
          <>
            <MagneticButton variant="primary">Approve direction</MagneticButton>
            <MagneticButton variant="outline">Request changes</MagneticButton>
          </>
        }
      />

      {/* TOKENS */}
      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32 v2-hairline-b">
        <SectionHeader eyebrow="01 — Foundations" title="Color & Type" />
        <div className="grid md:grid-cols-2 gap-16">
          {/* Swatches */}
          <div className="space-y-3">
            {[
              { name: "BG / true black", cls: "bg-v2-bg border border-v2-ink/10" },
              { name: "Surface 1", cls: "bg-v2-surface1" },
              { name: "Surface 2", cls: "bg-v2-surface2" },
              { name: "Surface 3", cls: "bg-v2-surface3" },
              { name: "Ink / bone", cls: "bg-v2-ink" },
              { name: "Accent / oxblood", cls: "bg-v2-accent" },
              { name: "Accent hi", cls: "bg-v2-accent-hi" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className={`h-12 w-24 ${s.cls}`} />
                <p className="v2-caption">{s.name}</p>
              </div>
            ))}
          </div>
          {/* Type scale */}
          <div className="space-y-6">
            <p className="v2-eyebrow">Eyebrow / 0.7rem · 0.32em tracking</p>
            <p className="v2-display text-6xl">Display 6xl</p>
            <p className="v2-display text-4xl">Display 4xl</p>
            <p className="v2-display-italic text-3xl">Display italic</p>
            <p className="v2-body max-w-prose">
              Body — Inter Variable. Houston-born, South Park Coalition original. Mr. CAP has been building
              a quiet legacy in the underground for three decades. This block is sample running copy at
              comfortable reading length to test rhythm and contrast on the new dark editorial canvas.
            </p>
            <p className="v2-caption">Caption / metadata</p>
          </div>
        </div>
      </section>

      {/* EDITORIAL BLOCK */}
      <EditorialBlock
        eyebrow="02 — Editorial block"
        title={
          <>
            Big <em className="v2-display-italic">photography</em>, quiet typography.
          </>
        }
        body={
          <>
            <p>
              Asymmetric two-column with full-bleed media on one side and headline + body on the other.
              Used for biography moments, album stories, and feature releases.
            </p>
            <p>
              Reveal animations fire as the block enters viewport. Slow, no bounce — premium pacing.
            </p>
          </>
        }
        image="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1600&q=80"
        actions={
          <>
            <MagneticButton variant="primary">Read story</MagneticButton>
            <MagneticButton variant="ghost">More chapters</MagneticButton>
          </>
        }
      />

      {/* RAIL */}
      <section className="py-24 md:py-32 v2-surface-1 v2-hairline-t v2-hairline-b">
        <div className="px-6 md:px-12 lg:px-20">
          <SectionHeader
            eyebrow="03 — Horizontal rail"
            title="Latest releases"
            action={<MagneticButton variant="ghost">View all →</MagneticButton>}
          />
        </div>
        <Rail>
          {COVERS.map((src, i) => (
            <CoverCard
              key={src}
              image={src}
              title={`Release No. ${i + 1}`}
              meta={`2024 · Single`}
              size="md"
              badge={i === 0 ? "New" : undefined}
            />
          ))}
        </Rail>
      </section>

      {/* CTAs */}
      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32 v2-hairline-b">
        <SectionHeader eyebrow="04 — Buttons & links" title="Calls to action" />
        <div className="flex flex-wrap gap-6">
          <MagneticButton variant="primary">Primary action</MagneticButton>
          <MagneticButton variant="outline">Outline action</MagneticButton>
          <MagneticButton variant="ghost">Ghost action</MagneticButton>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
          <a className="v2-link-sweep v2-eyebrow text-v2-ink">Sweep underline link</a>
          <a className="v2-link-sweep v2-eyebrow text-v2-accent">Accent sweep</a>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-16 v2-surface-2 v2-hairline-b">
        <Marquee>
          {["South Park Coalition", "Houston, TX", "Since 1994", "CAPISM Publishing", "Mortuary Media", "Ciddy Boi Music"].map(
            (t) => (
              <span key={t} className="v2-display text-v2-ink/40 text-5xl md:text-7xl">
                {t} <span className="text-v2-accent">·</span>
              </span>
            ),
          )}
        </Marquee>
      </section>

      {/* REVEAL DEMO */}
      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <SectionHeader eyebrow="05 — Motion" title="Slow editorial reveals" />
        <div className="grid md:grid-cols-3 gap-8">
          {[0, 0.15, 0.3].map((d) => (
            <Reveal key={d} delay={d}>
              <div className="aspect-[4/5] bg-v2-surface2 v2-noise relative">
                <div className="absolute inset-0 flex items-end p-6">
                  <p className="v2-display text-v2-ink text-2xl">Delay {d}s</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-12 lg:px-20 py-16 v2-hairline-t">
        <p className="v2-caption">Mr. CAP Legacy — V2 design system preview · /v2/styleguide</p>
      </footer>
    </div>
  );
}

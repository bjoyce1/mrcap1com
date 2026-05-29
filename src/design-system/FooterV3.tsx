import { Link } from "react-router-dom";
import { Body, Caption, Eyebrow } from "./Typography";
import { MarqueeRow } from "./MarqueeRow";

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/mrcapism/" },
  { label: "X", href: "https://x.com/mrcap1" },
  { label: "YouTube", href: "https://www.youtube.com/@mrcap1" },
  { label: "Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" },
  { label: "Apple Music", href: "https://music.apple.com/us/artist/561550224" },
  { label: "TikTok", href: "https://www.tiktok.com/@mrcapism" },
];

const NAV = [
  { to: "/discography", label: "Music" },
  { to: "/legacy", label: "Legacy" },
  { to: "/nft", label: "Visual" },
  { to: "/press", label: "Press" },
  { to: "/booking", label: "Book" },
];

const SECONDARY = [
  { to: "/biography", label: "Biography" },
  { to: "/south-park-coalition", label: "South Park Coalition" },
  { to: "/houston-hip-hop-history", label: "Houston Hip-Hop" },
  { to: "/merch", label: "Merch" },
  { to: "/blog", label: "Blog" },
  { to: "/for-media", label: "For Media" },
  { to: "/press-kit", label: "Press Kit" },
  { to: "/privacy", label: "Privacy" },
];

export const FooterV3 = () => (
  <footer className="bg-[hsl(var(--ds-bg))] pt-6">
    <MarqueeRow
      items={SOCIAL.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors"
        >
          {s.label}
        </a>
      ))}
      duration={80}
    />

    <div
      className="mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 py-20"
      style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)", maxWidth: "var(--ds-max)" }}
    >
      <div className="md:col-span-5">
        <Link to="/" className="ds-font-display italic text-[hsl(var(--ds-bone))] text-3xl md:text-4xl block">
          Mr.&nbsp;CAP
        </Link>
        <Body dim className="mt-6 max-w-md">
          Houston-born rapper, South Park Coalition original member, and creative
          technologist bridging hip-hop, business, and blockchain since 1995.
        </Body>
      </div>

      <div className="md:col-span-3">
        <Eyebrow className="mb-5">Navigate</Eyebrow>
        <ul className="space-y-3">
          {NAV.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="ds-font-body text-[hsl(var(--ds-bone))] hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-4">
        <Eyebrow className="mb-5">More</Eyebrow>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
          {SECONDARY.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="ds-font-body text-[hsl(var(--ds-bone-dim))] hover:text-[hsl(var(--ds-bone))] transition-colors text-sm"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div
      className="mx-auto flex flex-col md:flex-row justify-between gap-4 py-8 border-t border-[hsl(var(--ds-bone)/0.06)]"
      style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)", maxWidth: "var(--ds-max)" }}
    >
      <Caption>© {new Date().getFullYear()} Mr. CAP Legacy · CAP Distributions · Houston, TX</Caption>
      <Caption>South Park Coalition · Est. 1995</Caption>
    </div>
  </footer>
);

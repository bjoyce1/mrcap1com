import { Helmet } from "react-helmet-async";
import {
  DSRoot,
  Scene,
  Stage,
  Display,
  Eyebrow,
  Lead,
  Body,
  Caption,
  CTA,
  MarqueeRow,
  MediaFrame,
} from "@/design-system";

/**
 * /styleguide — V3 design system reference.
 * Every token + primitive in one place. Lock this before page work.
 */
const Styleguide = () => {
  return (
    <DSRoot>
      <Helmet>
        <title>V3 Styleguide · Mr. CAP Legacy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* ───── Hero Scene ───── */}
      <Scene
        bgImage="/images/mrcap-hero-bg.webp"
        scrim={0.7}
        align="start"
        justify="end"
      >
        <Stage py="none">
          <Eyebrow accent className="mb-6">V3 · Cinematic Immersive</Eyebrow>
          <Display size="monument" italic as="h1">
            Mr.&nbsp;CAP
          </Display>
          <div className="mt-8 max-w-xl">
            <Lead>The complete design language. Tokens, type, primitives, and motion — in one place.</Lead>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <CTA variant="primary" to="/">Back to site</CTA>
            <CTA variant="ghost" href="#tokens">Explore system</CTA>
          </div>
        </Stage>
      </Scene>

      {/* ───── Color tokens ───── */}
      <Stage id="tokens">
        <Eyebrow className="mb-4">01 — Tokens</Eyebrow>
        <Display size="lg" as="h2" italic>Color</Display>
        <Body dim className="mt-6 max-w-2xl">
          The palette is intentionally narrow: black, bone, and a single accent.
          Hierarchy comes from scale and spacing, not color.
        </Body>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(var(--ds-bone)/0.06)]">
          {[
            { label: "Background", token: "--ds-bg", hex: "#050505" },
            { label: "Surface", token: "--ds-surface", hex: "#0B0B0B" },
            { label: "Elevated", token: "--ds-elevated", hex: "#111111" },
            { label: "Bone", token: "--ds-bone", hex: "#F4F1EA" },
            { label: "Bone dim", token: "--ds-bone-dim", hex: "—" },
            { label: "Bone faint", token: "--ds-bone-faint", hex: "—" },
            { label: "Oxblood", token: "--ds-oxblood", hex: "#7A1F1F" },
            { label: "Gold (rare)", token: "--ds-gold", hex: "#C9A24C" },
          ].map((c) => (
            <div key={c.token}>
              <div
                className="aspect-square w-full"
                style={{ background: `hsl(var(${c.token}))` }}
              />
              <div className="p-4 bg-[hsl(var(--ds-surface))]">
                <Caption className="uppercase tracking-[0.2em]">{c.label}</Caption>
                <Body className="mt-1 font-mono text-[0.75rem]" dim>{c.hex}</Body>
              </div>
            </div>
          ))}
        </div>
      </Stage>

      {/* ───── Marquee divider ───── */}
      <MarqueeRow
        items={["The Ties That Bind Us", "Art of ISM", "2 Tha Grave", "O.N.E. on O.N.E.", "Bet On Her"]}
      />

      {/* ───── Typography ───── */}
      <Stage>
        <Eyebrow className="mb-4">02 — Typography</Eyebrow>
        <Display size="lg" as="h2" italic>Type</Display>
        <Body dim className="mt-6 max-w-2xl">
          One display (Fraunces, variable). One body (Inter). Scale is fluid via clamp — every viewport feels
          intentional, never cramped, never bloated.
        </Body>

        <div className="mt-16 space-y-16">
          <div>
            <Caption>Display · monument · italic</Caption>
            <Display size="monument" italic as="div" className="mt-3">LEGACY</Display>
          </div>
          <div>
            <Caption>Display · xl</Caption>
            <Display size="xl" as="div" className="mt-3">Mr. CAP Legacy</Display>
          </div>
          <div>
            <Caption>Display · lg · italic</Caption>
            <Display size="lg" italic as="div" className="mt-3">South Park Coalition</Display>
          </div>
          <div>
            <Caption>Display · md</Caption>
            <Display size="md" as="div" className="mt-3">The Art of ISM</Display>
          </div>
          <div>
            <Caption>Lead</Caption>
            <Lead className="mt-3 max-w-2xl">
              A thirty-year career in Houston rap, told as a single film instead of a scrapbook.
            </Lead>
          </div>
          <div>
            <Caption>Body</Caption>
            <Body className="mt-3 max-w-2xl">
              Mr. CAP is an original member of South Park Coalition, a writer, and a creative technologist
              who became the first Houston rapper to sell a hip-hop NFT.
            </Body>
          </div>
          <div>
            <Caption>Body · dim</Caption>
            <Body dim className="mt-3 max-w-2xl">
              Dimmed body sets supporting information apart without resorting to a separate color.
            </Body>
          </div>
          <div>
            <Caption>Eyebrow</Caption>
            <Eyebrow className="mt-3">South Park Coalition · Est. 1995</Eyebrow>
          </div>
          <div>
            <Caption>Eyebrow · accent</Caption>
            <Eyebrow accent className="mt-3">New release · Bet On Her</Eyebrow>
          </div>
        </div>
      </Stage>

      {/* ───── CTAs ───── */}
      <Stage>
        <Eyebrow className="mb-4">03 — CTAs</Eyebrow>
        <Display size="lg" as="h2" italic>Action</Display>
        <Body dim className="mt-6 max-w-2xl">
          Three variants. Primary oxblood for conversion, ghost bone for secondary, link for inline.
          Every CTA carries the same trailing arrow vocabulary.
        </Body>

        <div className="mt-12 flex flex-wrap gap-6 items-center">
          <CTA variant="primary">Book Mr. CAP</CTA>
          <CTA variant="ghost">View Discography</CTA>
          <CTA variant="link">Read the bio</CTA>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 items-center">
          <CTA variant="primary" arrow={false}>No arrow</CTA>
          <CTA variant="ghost" arrow={false}>No arrow</CTA>
        </div>
      </Stage>

      {/* ───── MediaFrame grid ───── */}
      <Stage>
        <Eyebrow className="mb-4">04 — Media</Eyebrow>
        <Display size="lg" as="h2" italic>Image</Display>
        <Body dim className="mt-6 max-w-2xl">
          One frame component, three ratios. Captions always use the same scale.
        </Body>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaFrame
            ratio="3/4"
            src="/images/mrcap-hero-bg.webp"
            alt="Mr. CAP portrait"
            caption="3 : 4 — Portrait"
          />
          <MediaFrame
            ratio="1/1"
            src="/images/mrcap-hero-bg.webp"
            alt="Mr. CAP square"
            caption="1 : 1 — Square"
          />
          <MediaFrame
            ratio="16/9"
            src="/images/mrcap-hero-bg.webp"
            alt="Mr. CAP landscape"
            caption="16 : 9 — Cinematic"
          />
        </div>
      </Stage>

      {/* ───── Marquee variants ───── */}
      <Stage py="md">
        <Eyebrow className="mb-4">05 — Marquee Divider</Eyebrow>
        <Display size="lg" as="h2" italic>Rhythm</Display>
        <Body dim className="mt-6 max-w-2xl">
          The universal section break. Replaces decorative borders and section titles.
        </Body>
      </Stage>
      <MarqueeRow
        items={["Houston", "Texas", "Underground", "Legacy", "1995 — 2026"]}
        duration={50}
      />
      <MarqueeRow
        items={["Press", "Booking", "Music", "Visual", "Legacy"]}
        reverse
        duration={70}
      />

      {/* ───── Closing scene ───── */}
      <Scene
        bgImage="/images/mrcap-hero-bg.webp"
        scrim={0.75}
        align="center"
        justify="center"
        minH="80vh"
      >
        <Stage py="none" narrow>
          <div className="text-center">
            <Eyebrow accent>06 — Closer</Eyebrow>
            <Display size="xl" italic as="h2" className="mt-6">
              One film. Every page.
            </Display>
            <div className="mt-10 flex justify-center gap-4">
              <CTA variant="primary" to="/booking">Book a show</CTA>
              <CTA variant="ghost" to="/">Visit homepage</CTA>
            </div>
          </div>
        </Stage>
      </Scene>
    </DSRoot>
  );
};

export default Styleguide;

// One-tap TikTok caption generator.
// Builds a suggested caption with hashtags and a UTM-tagged hub link so
// every share is attributable in analytics.

export interface CaptionInput {
  title?: string;
  artist?: string;
  type?: "track" | "album" | "page" | "hub";
  slug?: string;
  /** Optional override for the link inserted into the caption. */
  url?: string;
  /** Optional UTM campaign label (defaults to type-aware label). */
  campaign?: string;
}

const BASE_HUB = "https://mrcap1.com/tiktok";
const HASHTAGS = ["#MrCAPLegacy", "#HoustonHipHop", "#SPC", "#fyp"];

const HOOKS: Record<string, string[]> = {
  track: [
    'New cut from the vault 🎧 "{title}" — {artist}',
    'Run it back: "{title}" by {artist} 🔥',
    '"{title}" hits different on loop. — {artist}',
  ],
  album: [
    '{artist} dropped "{title}". Full body of work, no skips.',
    'Album mode: "{title}" by {artist} 💿',
    'The "{title}" project by {artist} — start to finish.',
  ],
  page: [
    "Pulled up on Mr. CAP's spot. Tap in 👇",
    "Mr. CAP Legacy — the whole movement, one link.",
  ],
  hub: [
    "Live from @mrcapism on TikTok — newest cuts, stitches & visuals.",
    "Catch every Mr. CAP drop on the hub. Stitch, duet, tag in.",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildUtmUrl(base: string, campaign: string): string {
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", "tiktok");
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", campaign);
    u.searchParams.set("utm_content", "caption_generator");
    return u.toString();
  } catch {
    return base;
  }
}

export function generateTikTokCaption(input: CaptionInput = {}): { caption: string; url: string } {
  const type = input.type ?? "hub";
  const campaign = input.campaign ?? (input.slug ? `share_${type}_${input.slug}` : `share_${type}`);
  const url = buildUtmUrl(input.url ?? BASE_HUB, campaign);

  const template = pick(HOOKS[type] ?? HOOKS.hub);
  const hook = template
    .replace(/\{title\}/g, input.title ?? "the new one")
    .replace(/\{artist\}/g, input.artist ?? "Mr. CAP");

  const tags = HASHTAGS.join(" ");
  return {
    caption: `${hook}\n\n${url}\n\n${tags}`,
    url,
  };
}

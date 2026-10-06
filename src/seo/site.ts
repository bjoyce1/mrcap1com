/**
 * Sitewide SEO constants. Everything under src/seo uses relative imports only,
 * because the build (vite.config.ts) loads these files outside the app's "@/" alias.
 */
export const SITE_URL = "https://mrcap1.com";
export const SITE_NAME = "Mr. CAP";
export const TWITTER_HANDLE = "@mrcap1";
export const LOCALE = "en_US";

/** 1200x630 hero card used when a page has no artwork of its own. */
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1772738660503-MrCAP-Hero-section-BG.webp";
export const DEFAULT_OG_IMAGE_ALT = "Mr. CAP, Houston hip-hop artist";

/** The one way the site describes Mr. CAP's place in the South Park Coalition. */
export const SPC_ROLE = "Original Member of the South Park Coalition";

/** Official profiles, used in Person / MusicGroup sameAs. */
export const SAME_AS = [
  "https://www.instagram.com/mrcapism/",
  "https://x.com/mrcap1",
  "https://www.facebook.com/mrcap11",
  "https://www.youtube.com/@mrcap1",
  "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug",
  "https://music.apple.com/us/artist/mr-cap/1506719540",
  "https://www.tiktok.com/@mrcapism",
  "https://www.wikidata.org/wiki/Q139960172",
];

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

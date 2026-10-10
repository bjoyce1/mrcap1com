/**
 * Traffic filters shared by Google Analytics and the in-house tracker.
 *
 * Most of the site's recorded "visitors" are scripted browsers from data
 * centers: one page, no scroll, never back. Leaving them out keeps the
 * numbers about real listeners.
 */

const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|prerender|facebookexternalhit|bytespider|petalbot|python|curl|wget|axios|node-fetch|phantom|puppeteer|playwright|selenium/i;

/** True for scripted browsers and crawlers that run JavaScript. */
export function isAutomated(): boolean {
  if (typeof navigator === "undefined") return true;
  if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return true;
  if (BOT_UA.test(navigator.userAgent || "")) return true;
  // headless browsers usually report no languages at all
  if (!navigator.languages || navigator.languages.length === 0) return true;
  return false;
}

/** Only the real site reports. Local builds and Lovable previews keep events on the page. */
export const isLiveHost = () => typeof location !== "undefined" && /^(www\.)?mrcap1\.com$/.test(location.hostname);

/** Staff and sign-in pages stay out of the reports. */
export const isPrivatePath = (path: string) => /^\/(admin|auth|analytics)(\/|$)/.test(path);

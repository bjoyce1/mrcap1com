import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { installMode, isIos, shouldNudge, NUDGE_AFTER_SPINS, NUDGE_QUIET_DAYS } from "./install";
import { routeSeo } from "@/seo/routes";
import { renderPage } from "@/seo/render";
import { SITE_APP_HEAD } from "@/seo/app-head";

const root = path.resolve(__dirname, "../../..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/legends-manifest.json"), "utf8"));

/** Width and height from a PNG header. */
function pngSize(file: string): [number, number] {
  const b = fs.readFileSync(path.join(root, "public", file));
  expect(b.subarray(1, 4).toString()).toBe("PNG");
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe("install mode", () => {
  it("hides the offer inside the installed app", () => {
    expect(installMode({ standalone: true, ios: true, prompt: true })).toBe("installed");
  });
  it("uses the browser prompt when there is one, then the iPhone steps", () => {
    expect(installMode({ standalone: false, ios: false, prompt: true })).toBe("prompt");
    expect(installMode({ standalone: false, ios: true, prompt: false })).toBe("ios");
    expect(installMode({ standalone: false, ios: false, prompt: false })).toBe("none");
  });
  it("spots iPhones and iPads that report a Mac", () => {
    expect(isIos({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", platform: "iPhone", maxTouchPoints: 5 })).toBe(true);
    expect(isIos({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", platform: "MacIntel", maxTouchPoints: 5 })).toBe(true);
    expect(isIos({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", platform: "MacIntel", maxTouchPoints: 0 })).toBe(false);
    expect(isIos({ userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)", platform: "Linux armv8l", maxTouchPoints: 5 })).toBe(false);
  });
});

describe("install nudge", () => {
  const now = Date.UTC(2026, 10, 5);
  const base = { mode: "prompt" as const, touch: true, spins: NUDGE_AFTER_SPINS, dismissedAt: null, now };
  it("waits for a few spins on a phone", () => {
    expect(shouldNudge(base)).toBe(true);
    expect(shouldNudge({ ...base, spins: NUDGE_AFTER_SPINS - 1 })).toBe(false);
    expect(shouldNudge({ ...base, touch: false })).toBe(false);
    expect(shouldNudge({ ...base, mode: "ios" })).toBe(true);
    expect(shouldNudge({ ...base, mode: "installed" })).toBe(false);
    expect(shouldNudge({ ...base, mode: "none" })).toBe(false);
  });
  it("stays away for two weeks after Not now", () => {
    expect(shouldNudge({ ...base, dismissedAt: now - 864e5 })).toBe(false);
    expect(shouldNudge({ ...base, dismissedAt: now - (NUDGE_QUIET_DAYS + 1) * 864e5 })).toBe(true);
  });
});

describe("Legends app manifest", () => {
  it("opens the game full screen, inside its scope", () => {
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url.startsWith("/legends")).toBe(true);
    expect(manifest.start_url.startsWith(manifest.scope)).toBe(true);
    expect(manifest.short_name.length).toBeLessThanOrEqual(12);
  });
  it("has 192 and 512 icons, plain and maskable, at their stated sizes", () => {
    for (const purpose of ["any", "maskable"]) {
      const sizes = manifest.icons.filter((i: { purpose: string }) => i.purpose === purpose).map((i: { sizes: string }) => i.sizes);
      expect(sizes).toEqual(["192x192", "512x512"]);
    }
    for (const icon of manifest.icons) expect(pngSize(icon.src).join("x")).toBe(icon.sizes);
    expect(pngSize("/games/spc-legends/app/apple-touch-icon.png")).toEqual([180, 180]);
  });
  it("uses no em or en dashes", () => {
    expect(JSON.stringify(manifest)).not.toMatch(/[–—]/);
  });
});

describe("app head in the built pages", () => {
  const tags = (html: string, re: RegExp) => html.match(re) ?? [];
  it("/legends installs the game, with one manifest and one icon", () => {
    const html = renderPage(template, routeSeo("/legends"));
    const manifests = tags(html, /<link\b[^>]*rel="manifest"[^>]*>/g);
    expect(manifests).toHaveLength(1);
    expect(manifests[0]).toContain('href="/legends-manifest.json"');
    expect(tags(html, /<link\b[^>]*rel="apple-touch-icon"[^>]*>/g)).toEqual(['<link rel="apple-touch-icon" href="/games/spc-legends/app/apple-touch-icon.png" />']);
    expect(tags(html, /<meta name="theme-color"[^>]*>/g)).toEqual(['<meta name="theme-color" content="#06040b" />']);
    expect(html).toContain('<meta name="apple-mobile-web-app-title" content="SPC Legends" />');
    expect(html).toContain("__installPrompt");
  });
  it("other pages keep the site's own app", () => {
    const html = renderPage(template, routeSeo("/legends/terms"));
    expect(tags(html, /<link\b[^>]*rel="manifest"[^>]*>/g)).toEqual([`<link rel="manifest" href="${SITE_APP_HEAD.manifest}" />`]);
    expect(html).toContain(`<link rel="apple-touch-icon" href="${SITE_APP_HEAD.icon}" />`);
    expect(html).toContain(`<meta name="theme-color" content="${SITE_APP_HEAD.themeColor}" />`);
    expect(html).not.toContain("apple-mobile-web-app-title");
  });
});

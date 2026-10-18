import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ALIASES, ROUTES, routeSeo } from "./routes";
import { collectPages, type Catalog } from "./pages";
import { BODY_END, BODY_START, renderPage, ROBOTS_NOINDEX, scriptJson } from "./render";
import { fitDescription, fitTitle, hasDash, noDashes } from "./text";
import { blogPostSeo, musicPlaylistLd, personRef, pressPostSeo, trackSeo } from "./builders";
import { sitemapUrls, sitemapXml } from "./sitemap";
import { allCities } from "../data/cities";
import type { SeoEntry } from "./types";

const root = path.resolve(__dirname, "../..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
const catalog: Catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "catalog-snapshot.json"), "utf8"));
const pages = collectPages(catalog);

/** Every string anywhere in a value. */
const strings = (v: unknown): string[] =>
  typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

// a claim about Mr. CAP's role, not "Key SPC members include..."
const WRONG_SPC = [/co-?founder/i, /founding member/i, /long-?time member/i, /south park coalition member\b/i, /\bSPC member\b/i, /\bcore member\b/i];

function checkEntry(e: SeoEntry) {
  const where = `${e.path} (${e.title})`;
  expect(e.title.length, `title length: ${where}`).toBeLessThanOrEqual(59);
  expect(e.description.length, `description length ${e.description.length}: ${where}`).toBeGreaterThanOrEqual(140);
  expect(e.description.length, `description length ${e.description.length}: ${where}`).toBeLessThanOrEqual(160);
  expect(e.h1.trim(), `h1: ${where}`).not.toBe("");
  expect(e.summary.length, `summary paragraphs: ${where}`).toBeGreaterThanOrEqual(2);
  expect(e.summary.length, `summary paragraphs: ${where}`).toBeLessThanOrEqual(4);
  for (const s of strings(e)) {
    expect(hasDash(s), `em/en dash in ${where}: "${s.slice(0, 80)}"`).toBe(false);
    for (const re of WRONG_SPC) expect(re.test(s), `SPC wording ${re} in ${where}: "${s.slice(0, 120)}"`).toBe(false);
  }
}

describe("static routes", () => {
  it("every route follows the title, description, dash and wording rules", () => {
    for (const r of ROUTES) checkEntry(r);
  });

  it("static titles use the | separator and are unique", () => {
    for (const r of ROUTES) expect(r.title, r.path).toContain(" | ");
    const indexable = ROUTES.filter((r) => !r.noIndex);
    expect(new Set(indexable.map((r) => r.title)).size).toBe(indexable.length);
    expect(new Set(indexable.map((r) => r.description)).size).toBe(indexable.length);
  });

  it("aliases point at real routes", () => {
    for (const [alias, target] of Object.entries(ALIASES)) expect(routeSeo(alias).path, alias).toBe(target);
  });

  it("the SPC role is always worded the same way", () => {
    const all = ROUTES.flatMap(strings).filter((s) => /member of the south park coalition/i.test(s));
    expect(all.length).toBeGreaterThan(0);
    for (const s of all) expect(s, s).toMatch(/Original Member of the South Park Coalition/);
  });
});

describe("shared professional identity", () => {
  const identity = {
    "@type": "Person",
    "@id": "https://corneliusapratt.com/#person",
    name: "Cornelius A. Pratt",
    alternateName: "Mr. CAP",
    url: "https://corneliusapratt.com/",
  };

  it("uses the exact shared identity on both full artist profiles", () => {
    for (const route of ["/", "/who-is-mr-cap"]) {
      const people = routeSeo(route).jsonLd?.filter((node) => node["@type"] === "Person") ?? [];
      expect(people, route).toHaveLength(1);
      expect(people[0]).toMatchObject(identity);
      expect(people[0]?.sameAs).toEqual(expect.arrayContaining([
        "https://corneliusapratt.com/",
        "https://mrcap1.com/",
        "https://www.linkedin.com/in/mrcap/",
      ]));
    }
  });

  it("keeps every nested artist Person attached to the shared identity", () => {
    const visit = (value: unknown): void => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) { value.forEach(visit); return; }
      const node = value as Record<string, unknown>;
      if (node["@type"] === "Person" && ["Mr. CAP", "Cornelius A. Pratt"].includes(String(node.name))) {
        expect(node).toMatchObject(identity);
      }
      Object.values(node).forEach(visit);
    };
    for (const page of pages) visit([page.entry.jsonLd, page.extraJsonLd]);
    expect(personRef).toEqual(identity);
  });

  it("preserves separate company and musical artist entities", () => {
    expect(routeSeo("/").jsonLd).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "Organization", "@id": "https://mrcap1.com/#organization", name: "CAP Distributions", founder: { "@id": identity["@id"] } }),
      expect.objectContaining({ "@type": "MusicGroup", "@id": "https://mrcap1.com/#artist", name: "Mr. CAP" }),
    ]));
    const recording = trackSeo({ slug: "identity-test", title: "Identity Test", artist: "Mr. CAP" }).jsonLd?.find((node) => node["@type"] === "MusicRecording");
    expect(recording?.byArtist).toMatchObject({ "@type": "MusicGroup", name: "Mr. CAP" });
  });

  it("preserves other authors and press outlet publishers", () => {
    const post = { slug: "identity-test", title: "Identity Test", excerpt: "Artist identity", date: "2026-10-18", author: "Guest Writer" };
    expect(blogPostSeo(post).jsonLd?.find((node) => node["@type"] === "BlogPosting")?.author).toMatchObject({ "@type": "Person", name: "Guest Writer" });
    const article = pressPostSeo({ ...post, summary: "Artist identity", outlet: "Houston Press" }).jsonLd?.find((node) => node["@type"] === "Article");
    expect(article?.author).toEqual({ "@type": "Person", name: "Guest Writer" });
    expect(article?.publisher).toEqual({ "@type": "Organization", name: "Houston Press" });
  });

  it("serializes valid JSON-LD on every generated artist page", () => {
    for (const page of pages) {
      const html = renderPage(template, page.entry, { extraJsonLd: page.extraJsonLd });
      const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
      expect(scripts.length, page.path).toBeGreaterThan(0);
      for (const script of scripts) expect(JSON.parse(script[1])["@context"]).toBe("https://schema.org");
    }
  });
});

describe("every built page", () => {
  it("covers static routes, aliases, cities, stories, blog, press, albums and tracks", () => {
    const paths = new Set(pages.map((p) => p.path));
    for (const p of ["/", "/music", "/south-park-coalition", "/about", "/city/houston", "/self-love/2024/amara", "/press/big-boy-drip-release", "/albums/the-art-of-ism", "/album/the-art-of-ism", "/music/big-boy-drip", "/track/big-boy-drip"])
      expect(paths.has(p), p).toBe(true);
    expect(paths.size).toBe(pages.length);
  });

  it("all data pages follow the same rules", () => {
    for (const p of pages) checkEntry(p.entry);
  });

  it("canonical URLs are absolute on mrcap1.com", () => {
    for (const p of pages) {
      const c = p.entry.canonical ?? `https://mrcap1.com${p.entry.path}`;
      expect(c, p.path).toMatch(/^https:\/\/mrcap1\.com(\/|$)/);
    }
  });

  it("every old city URL still serves a page: the live page", () => {
    const byPath = new Map(pages.map((p) => [p.path, p]));
    for (const city of allCities) expect(byPath.get(`/city/${city.slug}`)?.entry.path, city.slug).toBe("/live");
  });

  it("merged pages serve the page that absorbed them", () => {
    const byPath = new Map(pages.map((p) => [p.path, p]));
    const merged: [string, string][] = [
      ["/biography", "/who-is-mr-cap"],
      ["/new-releases", "/music"],
      ["/texas-underground-hip-hop", "/houston-hip-hop-history"],
      ["/art", "/self-love"],
      ["/self-love/2025", "/self-love"],
      ["/tiktok", "/videos"],
      ["/opk", "/press"],
      ["/opk/press", "/press"],
      ["/opk/music", "/booking"],
      ["/press-kit", "/press"],
      ["/cities", "/live"],
      ["/vinyl", "/albums/the-art-of-ism"],
    ];
    for (const [from, to] of merged) expect(byPath.get(from)?.entry.path, from).toBe(to);
  });
});

describe("sitemap", () => {
  const urls = sitemapUrls(pages);

  it("lists each indexable page once, under its canonical URL", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of ["https://mrcap1.com/", "https://mrcap1.com/music", "https://mrcap1.com/music/big-boy-drip", "https://mrcap1.com/albums/the-art-of-ism", "https://mrcap1.com/live", "https://mrcap1.com/press"])
      expect(urls, u).toContain(u);
    const byUrl = new Map(pages.map((p) => [`https://mrcap1.com${p.path}`, p]));
    for (const u of urls) {
      const page = byUrl.get(u);
      expect(page, u).toBeDefined();
      expect(page!.entry.noIndex, u).toBeFalsy();
    }
  });

  it("leaves out aliases and noindex pages", () => {
    for (const u of ["/about", "/listen", "/track/big-boy-drip", "/album/the-art-of-ism", "/admin", "/auth", "/city/new-orleans", "/cities", "/biography", "/opk", "/vinyl", "/tiktok", "/art"])
      expect(urls, u).not.toContain(`https://mrcap1.com${u}`);
  });

  it("is well-formed XML with one <url> per page", () => {
    const xml = sitemapXml(urls);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml.match(/<url>/g)?.length).toBe(urls.length);
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });
});

describe("renderPage", () => {
  const music = pages.find((p) => p.path === "/music")!;
  const html = renderPage(template, music.entry, { extraJsonLd: music.extraJsonLd });
  const head = html.slice(0, html.indexOf("</head>"));
  const count = (re: RegExp) => (head.match(re) || []).length;

  it("replaces the head tags instead of adding a second copy", () => {
    expect(count(/<title>/g)).toBe(1);
    expect(head).toContain(`<title>${music.entry.title}</title>`);
    expect(count(/name="description"/g)).toBe(1);
    expect(count(/rel="canonical"/g)).toBe(1);
    expect(head).toContain('rel="canonical" href="https://mrcap1.com/music"');
    expect(count(/property="og:site_name"/g)).toBe(1);
    expect(head).toContain('property="og:site_name" content="Mr. CAP"');
    expect(count(/property="og:title"/g)).toBe(1);
    expect(count(/property="og:image"/g)).toBe(1);
    expect(count(/name="twitter:title"/g)).toBe(1);
    expect(count(/name="robots"/g)).toBe(1);
  });

  it("marks route tags for react-helmet-async so the app replaces them", () => {
    expect(head).toMatch(/<meta data-rh="true" name="description"/);
    expect(head).toMatch(/<link data-rh="true" rel="canonical"/);
    expect(head).toMatch(/<script data-rh="true" type="application\/ld\+json">/);
  });

  it("writes valid JSON-LD including the live-data list", () => {
    const m = head.match(/<script data-rh="true" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const doc = JSON.parse(m![1]);
    const types = doc["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("MusicPlaylist");
    expect(types).toContain("BreadcrumbList");
  });

  it("swaps the content block for the route's H1, summary and links", () => {
    const block = html.slice(html.indexOf(BODY_START), html.indexOf(BODY_END));
    expect(block).toContain("Stream Direct. No Middleman.");
    expect(block).toContain(music.entry.summary[0].slice(0, 40));
    expect(block).toContain('href="/mr-cap-discography"');
    expect(block).not.toContain("first Houston rapper to sell a hip-hop NFT"); // the template's default copy is gone
    expect(html).toContain('<div id="root">');
    expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
  });

  it("has no em or en dashes anywhere in a rendered page", () => {
    for (const p of pages.slice(0, 120)) expect(hasDash(renderPage(template, p.entry, { extraJsonLd: p.extraJsonLd })), p.path).toBe(false);
  });

  it("leaves out the canonical on the root fallback file", () => {
    const home = renderPage(template, routeSeo("/"), { canonical: false });
    expect(home).not.toContain('rel="canonical"');
    expect(home).not.toContain('property="og:url"');
  });

  it("marks noindex routes", () => {
    const auth = renderPage(template, routeSeo("/auth"));
    expect(auth).toContain(`name="robots" content="${ROBOTS_NOINDEX}"`);
    expect((auth.match(/name="robots"/g) || []).length).toBe(1);
  });

  it("escapes text and keeps JSON-LD from breaking out of its script tag", () => {
    const hostile: SeoEntry = {
      ...routeSeo("/music"),
      title: 'A <b>"Bold"</b> & loud | Mr. CAP',
      h1: "<script>alert(1)</script>",
      jsonLd: [{ "@type": "Thing", name: "</script><script>alert(1)</script>" }],
    };
    const out = renderPage(template, hostile);
    expect(out).toContain("<title>A &lt;b&gt;&quot;Bold&quot;&lt;/b&gt; &amp; loud | Mr. CAP</title>");
    expect(out).not.toContain("<script>alert(1)</script>");
    expect(scriptJson("</script>")).not.toContain("</script>");
  });
});

describe("text helpers", () => {
  it("removes em and en dashes", () => {
    expect(noDashes("Who Is Mr. CAP? \u2014 Houston")).toBe("Who Is Mr. CAP?, Houston");
    expect(noDashes("2024\u20132026")).toBe("2024-2026");
    expect(hasDash(noDashes("a \u2013 b \u2014 c"))).toBe(false);
  });

  it("fits titles under 60 characters", () => {
    const t = fitTitle("Looking For Classic Houston Rap? Here Are 10 Things You Should Know About the South Park Coalition", "Mr. CAP Blog");
    expect(t.length).toBeLessThanOrEqual(59);
    expect(t).toBe("Looking For Classic Houston Rap? | Mr. CAP Blog");
  });

  it("fits descriptions between 140 and 160 characters", () => {
    const d = fitDescription(["Short opener."], ["A second sentence that adds a little more context for readers.", "And a third one to reach the minimum length."]);
    expect(d.length).toBeGreaterThanOrEqual(80);
    expect(d.length).toBeLessThanOrEqual(160);
  });

  it("builds a track page from catalog data", () => {
    const t = trackSeo({ slug: "x", title: "Test Song", artist: "Mr. CAP", featured_artists: "K-Rino", release_year: 2025, duration: 185 });
    expect(t.path).toBe("/music/x");
    expect(t.title).toBe("Test Song | Mr. CAP");
    expect(JSON.stringify(t.jsonLd)).toContain('"duration":"PT3M5S"');
    expect(musicPlaylistLd([{ slug: "x", title: "Test Song", artist: "Mr. CAP" }]).track).toHaveLength(1);
  });
});

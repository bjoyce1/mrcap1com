/**
 * Vite build plugin: after the app is built, write one HTML file per route
 * (dist/music/index.html, dist/city/houston/index.html, ...) with that route's
 * title, meta tags, canonical, Open Graph and Twitter tags, JSON-LD, and a crawlable
 * content block. Lovable's host serves a folder's index.html before falling back to the
 * app shell, so crawlers and link previews that don't run JavaScript get the right page.
 * Visitors get the same app either way; React takes over as usual.
 *
 * Data pages use the live catalog when the build can reach Supabase, otherwise the
 * committed snapshot (src/seo/catalog-snapshot.json). A failure here never fails the build.
 */
import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { collectPages, type Catalog } from "../src/seo/pages";
import { renderPage } from "../src/seo/render";
// plain JS module shared with the snapshot script
// @ts-expect-error no type declarations for the .mjs helper
import { fetchCatalog } from "./seo-catalog.mjs";

const SNAPSHOT = "src/seo/catalog-snapshot.json";

export function seoPages(env: Record<string, string>): Plugin {
  let config: ResolvedConfig;
  return {
    name: "mrcap-seo-pages",
    apply: "build",
    configResolved(c) {
      config = c;
    },
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const indexFile = path.join(outDir, "index.html");
      if (!fs.existsSync(indexFile)) return;
      try {
        const snapshotPath = path.resolve(config.root, SNAPSHOT);
        const snapshot: Catalog = fs.existsSync(snapshotPath) ? JSON.parse(fs.readFileSync(snapshotPath, "utf8")) : {};
        const live: Catalog | null = env.SEO_OFFLINE ? null : await fetchCatalog(env).catch(() => null);
        const catalog: Catalog = {
          tracks: live?.tracks ?? snapshot.tracks,
          albums: live?.albums ?? snapshot.albums,
          blogPosts: live?.blogPosts ?? snapshot.blogPosts,
          pressEntries: live?.pressEntries ?? snapshot.pressEntries,
        };

        const template = fs.readFileSync(indexFile, "utf8");
        const pages = collectPages(catalog);
        for (const page of pages) {
          // the root file is also the fallback for every unknown path, so it carries no canonical
          const html = renderPage(template, page.entry, { extraJsonLd: page.extraJsonLd, canonical: page.path !== "/" });
          const file = page.path === "/" ? indexFile : path.join(outDir, page.path.slice(1), "index.html");
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, html);
        }
        const source = live?.tracks ? "live catalog" : "catalog snapshot";
        config.logger.info(`\n[seo] wrote ${pages.length} route pages (${source}: ${catalog.tracks?.length ?? 0} tracks, ${catalog.albums?.length ?? 0} albums)`);
      } catch (err) {
        config.logger.warn(`[seo] route pages skipped: ${(err as Error).message}`);
      }
    },
  };
}

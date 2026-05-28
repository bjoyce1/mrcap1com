// ============================================================
// vite-plugin-prerender.ts
//
// Pre-renders SPA routes to static HTML at build time so crawlers
// and social-preview bots see real route-specific HTML (title,
// meta description, canonical, JSON-LD) instead of an empty
// <div id="root">. React hydrates on top after load.
//
// Key invariants:
//  - The preview server ALWAYS serves the original built index.html
//    as the SPA fallback. We never let progressively-written route
//    files leak into another route's fallback.
//  - We capture all routes into memory first, then write to disk.
//  - We verify location.pathname matches the requested route and
//    wait for Helmet to write a route-specific canonical before
//    capturing.
//  - After capture, we dedupe <link rel="canonical"> down to a
//    single tag pointing to the route's own URL.
// ============================================================

import type { Plugin } from "vite";
import { resolve } from "path";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";

// Browser globals referenced inside page.evaluate callbacks. Declared here so
// this Node-side file type-checks under tsconfig.node.json (no DOM lib).
declare const window: any;
declare const document: any;
type HTMLLinkElement = any;
type HTMLMetaElement = any;

interface PrerenderOptions {
  routes: string[];
  /** ms to wait for the page to settle before capturing (default 4000). */
  renderDelay?: number;
  /** Canonical origin baked into <link rel="canonical"> (no trailing slash). */
  origin?: string;
}

export default function prerender(options: PrerenderOptions): Plugin {
  const {
    routes,
    renderDelay = 4000,
    origin = "https://mrcap1.com",
  } = options;

  return {
    name: "vite-plugin-prerender",
    enforce: "post",
    apply: "build",

    async closeBundle() {
      console.log("\n🔄 Pre-rendering", routes.length, "routes...\n");

      const puppeteer = await import("puppeteer");
      const { createServer } = await import("http");

      const distDir = resolve(process.cwd(), "dist");
      const rootIndexPath = resolve(distDir, "index.html");

      // Snapshot the original index.html ONCE. The preview server uses this
      // for every SPA fallback, so writing /booking/index.html later cannot
      // contaminate /art-of-ism's fallback.
      const originalIndex = readFileSync(rootIndexPath, "utf-8");

      // Minimal static server: serve real assets from dist, otherwise fall
      // back to the pristine original index.html.
      const server = createServer(async (req, res) => {
        try {
          const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
          // Try real file
          const tryFile = (p: string) => {
            const filePath = resolve(distDir, "." + p);
            if (!filePath.startsWith(distDir)) return null;
            if (existsSync(filePath)) {
              const stat = require("fs").statSync(filePath);
              if (stat.isFile()) return filePath;
            }
            return null;
          };
          const candidate = tryFile(urlPath);
          if (candidate) {
            const ext = candidate.split(".").pop()?.toLowerCase() || "";
            const types: Record<string, string> = {
              js: "application/javascript",
              mjs: "application/javascript",
              css: "text/css",
              html: "text/html; charset=utf-8",
              json: "application/json",
              svg: "image/svg+xml",
              png: "image/png",
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              webp: "image/webp",
              ico: "image/x-icon",
              woff2: "font/woff2",
              woff: "font/woff",
              txt: "text/plain; charset=utf-8",
              xml: "application/xml",
            };
            res.setHeader("Content-Type", types[ext] || "application/octet-stream");
            res.end(readFileSync(candidate));
            return;
          }
          // SPA fallback — always the pristine original index.html
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(originalIndex);
        } catch (e) {
          res.statusCode = 500;
          res.end(String((e as Error).message));
        }
      });

      await new Promise<void>((res) => server.listen(4173, res));
      console.log("  📡 Preview server running on :4173 (pristine SPA fallback)");

      const browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const rendered = new Map<string, string>();

      for (const route of routes) {
        const expectedCanonical =
          route === "/" ? origin : `${origin}${route.replace(/\/$/, "")}`;
        try {
          const page = await browser.newPage();
          await page.goto(`http://localhost:4173${route}`, {
            waitUntil: "networkidle0",
            timeout: 30000,
          });

          // Verify we're on the route we asked for (no silent redirect to /).
          const actualPath = await page.evaluate(() => window.location.pathname);
          if (actualPath.replace(/\/$/, "") !== route.replace(/\/$/, "") && route !== "/") {
            throw new Error(
              `Route mismatch: requested ${route}, got ${actualPath}`,
            );
          }

          // Let React hydrate + Helmet mutate <head>.
          await sleep(renderDelay);

          // Wait (up to renderDelay again) for Helmet to publish the
          // route-specific canonical. If it never matches, we still capture
          // but we will rewrite it below.
          try {
            await page.waitForFunction(
              (expected: string) => {
                const links = Array.from(
                  document.querySelectorAll('link[rel="canonical"]'),
                );
                return links.some(
                  (l) => (l as HTMLLinkElement).href === expected,
                );
              },
              { timeout: renderDelay },
              expectedCanonical,
            );
          } catch {
            // fall through — we'll force the canonical post-capture
          }

          // Normalize <head> inside the page: keep exactly ONE canonical and
          // ensure it points to the route's own URL.
          await page.evaluate((expected: string) => {
            const links = Array.from(
              document.querySelectorAll('link[rel="canonical"]'),
            ) as HTMLLinkElement[];
            links.forEach((l) => l.parentNode?.removeChild(l));
            const link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            link.setAttribute("href", expected);
            document.head.appendChild(link);

            // og:url should match canonical
            const ogs = Array.from(
              document.querySelectorAll('meta[property="og:url"]'),
            ) as HTMLMetaElement[];
            ogs.forEach((m) => m.parentNode?.removeChild(m));
            const og = document.createElement("meta");
            og.setAttribute("property", "og:url");
            og.setAttribute("content", expected);
            document.head.appendChild(og);
          }, expectedCanonical);

          const html = await page.content();

          // Sanity log
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          console.log(
            `  ✅ ${route} → "${titleMatch ? titleMatch[1] : "?"}" | canonical=${expectedCanonical}`,
          );

          rendered.set(route, html);
          await page.close();
        } catch (err) {
          console.error(`  ❌ ${route}:`, (err as Error).message);
        }
      }

      await browser.close();
      server.close();

      // Write all captured HTML AFTER browser closed, so nothing the
      // preview server returned can have been a previously-written
      // route file.
      for (const [route, html] of rendered) {
        const filePath =
          route === "/"
            ? resolve(distDir, "index.html")
            : resolve(distDir, route.replace(/^\//, ""), "index.html");
        const dir = resolve(filePath, "..");
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(filePath, html, "utf-8");
      }

      console.log(`\n✨ Pre-rendering complete (${rendered.size}/${routes.length} routes).\n`);
    },
  };
}

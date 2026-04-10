// ============================================================
// vite-plugin-prerender.ts
//
// Drop-in Vite plugin that pre-renders your SPA routes to static
// HTML at build time. This solves the #1 SEO problem: Googlebot
// and social crawlers seeing an empty <div id="root">.
//
// SETUP:
//   1. npm install puppeteer --save-dev
//   2. Copy this file to your project root
//   3. Add to vite.config.ts (see bottom of this file)
//
// HOW IT WORKS:
//   After Vite builds, this plugin spins up a local server,
//   visits each route with Puppeteer, captures the rendered HTML,
//   and writes it as a static file. Crawlers get real content.
//   React hydrates on top seamlessly.
// ============================================================

import type { Plugin } from "vite";
import { resolve } from "path";
import { writeFileSync, mkdirSync, existsSync } from "fs";

interface PrerenderOptions {
  routes: string[];
  /** ms to wait for page to settle before capturing (default: 2000) */
  renderDelay?: number;
}

export default function prerender(options: PrerenderOptions): Plugin {
  const { routes, renderDelay = 2000 } = options;

  return {
    name: "vite-plugin-prerender",
    enforce: "post",
    apply: "build",

    async closeBundle() {
      console.log("\n🔄 Pre-rendering", routes.length, "routes...\n");

      // Dynamic import so puppeteer is only needed at build time
      const puppeteer = await import("puppeteer");
      const { createServer } = await import("http");
      const handler = await import("serve-handler" as any);

      const distDir = resolve(process.cwd(), "dist");

      // Serve the built dist folder
      const server = createServer((req, res) => {
        return (handler as any).default(req, res, {
          public: distDir,
          rewrites: [{ source: "**", destination: "/index.html" }],
        });
      });

      await new Promise<void>((res) => server.listen(4173, res));
      console.log("  📡 Preview server running on :4173");

      const browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      for (const route of routes) {
        try {
          const page = await browser.newPage();
          await page.goto(`http://localhost:4173${route}`, {
            waitUntil: "networkidle0",
            timeout: 15000,
          });

          // Wait for React to render content
          await page.waitForTimeout(renderDelay);

          const html = await page.content();

          // Write the static HTML
          const filePath =
            route === "/"
              ? resolve(distDir, "index.html")
              : resolve(distDir, route.slice(1), "index.html");

          const dir = resolve(filePath, "..");
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

          writeFileSync(filePath, html, "utf-8");
          console.log(`  ✅ ${route}`);

          await page.close();
        } catch (err) {
          console.error(`  ❌ ${route}:`, (err as Error).message);
        }
      }

      await browser.close();
      server.close();
      console.log("\n✨ Pre-rendering complete!\n");
    },
  };
}

// ============================================================
// USAGE IN vite.config.ts:
//
// import prerender from "./vite-plugin-prerender";
//
// export default defineConfig({
//   plugins: [
//     react(),
//     // ... other plugins
//     prerender({
//       routes: [
//         "/",
//         "/music",
//         "/about",
//         "/press",
//         "/booking",
//         "/blog",
//         "/nft",
//         "/who-is-mr-cap",
//         "/south-park-coalition",
//         "/houston-hip-hop-history",
//         "/biography",
//         "/videos",
//         "/live",
//         "/new-releases",
//         "/bet-on-her",
//         "/press-kit",
//         "/for-media",
//         "/links",
//         "/mr-cap-discography",
//         "/legacy",
//         "/innovation",
//         "/art-of-ism",
//         "/merch",
//         "/opk",
//         "/self-love",
//         "/privacy",
//       ],
//     }),
//   ],
// });
// ============================================================

// ============================================================
// vite-plugin-prerender.ts
//
// Pre-renders SPA routes to static HTML at build time so crawlers
// and social-preview bots see real route-specific HTML (title,
// meta description, canonical, JSON-LD) instead of an empty
// <div id="root">. React hydrates on top after load.
// ============================================================

import type { Plugin } from "vite";
import { resolve } from "path";
import { writeFileSync, mkdirSync, existsSync } from "fs";

interface PrerenderOptions {
  routes: string[];
  /** ms to wait for the page to settle before capturing (default 2000). */
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

      const puppeteer = await import("puppeteer");
      const { createServer } = await import("http");
      const handler = await import("serve-handler" as any);

      const distDir = resolve(process.cwd(), "dist");

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

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      for (const route of routes) {
        try {
          const page = await browser.newPage();
          await page.goto(`http://localhost:4173${route}`, {
            waitUntil: "networkidle0",
            timeout: 20000,
          });

          // Let React hydrate, Helmet mutate <head>, and the prerender script run.
          await sleep(renderDelay);

          const html = await page.content();

          const filePath =
            route === "/"
              ? resolve(distDir, "index.html")
              : resolve(distDir, route.replace(/^\//, ""), "index.html");

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

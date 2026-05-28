import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
// prerender plugin removed — Node-only deps (puppeteer) were breaking the ESM config evaluation

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // we use our own public/manifest.json
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/storage\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "gcs-assets",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
    // ── PRE-RENDER for SEO ──────────────────────────────────
    // Build-time only: Puppeteer visits each route and writes
    // a static HTML file with the rendered head + body. Crawlers
    // get real per-route HTML; React hydrates on top in browsers.
    mode === "production" && prerender({
      origin: "https://mrcap1.com",
      renderDelay: 4500,
      routes: [
        "/",
        "/about",
        "/press",
        "/booking",
        "/blog",
        "/nft",
        "/who-is-mr-cap",
        "/south-park-coalition",
        "/houston-hip-hop-history",
        "/biography",
        "/videos",
        "/live",
        "/new-releases",
        "/bet-on-her",
        "/press-kit",
        "/for-media",
        "/links",
        "/legacy",
        "/innovation",
        "/art-of-ism",
        "/merch",
        "/opk",
        "/self-love",
        "/privacy",
        "/discography",
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ── CHUNK SPLITTING ─────────────────────────────────────
    // Separates vendor libs from your app code so returning
    // visitors get cached vendor bundles even when you ship updates.
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React + Router (rarely changes)
          "vendor-react": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-helmet-async",
          ],
          // Animation libraries
          "vendor-animation": [
            "framer-motion",
            "gsap",
          ],
          // UI framework + Data & state (merged to avoid circular deps)
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@tanstack/react-query",
            "@supabase/supabase-js",
            "zustand",
          ],
          // Charts (only loaded on pages that use them)
          "vendor-charts": [
            "recharts",
          ],
        },
      },
    },
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// vite-plugin-pwa removed — its auto-registered service worker was
// caching old HTML/JS and causing the Lovable preview (and returning
// visitors) to see stale builds. public/sw.js is now a kill-switch
// worker that unregisters itself and clears the old Workbox caches.

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Pre-render plugin removed for build stability. Google's JS rendering
    // handles per-route Helmet tags; JSON-LD is in the SPA shell.

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

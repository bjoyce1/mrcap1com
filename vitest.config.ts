import { defineConfig } from "vitest/config";
import path from "path";

// Unit tests only (the SEO layer). Kept apart from vite.config.ts so tests don't load app plugins.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});

// Fetch the live catalog the SEO pages are built from: public tracks and albums from
// Supabase, and blog posts and press entries from Sanity (through the sanity-query
// edge function). Used two ways:
//   1. by the build (vite.config.ts), which tries this first and falls back to the snapshot;
//   2. on its own, to refresh the committed snapshot:  node scripts/seo-catalog.mjs
// Every fetch has a timeout, and a failure returns null rather than throwing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TRACK_FIELDS = "id,slug,title,artist,featured_artists,album_id,track_number,release_year,duration,cover_art_url,explicit,isrc,spotify_url,apple_music_url,credits,producers,writers,created_at";
const ALBUM_FIELDS = "id,slug,title,artist,release_year,cover_art_url,description,track_count,created_at";

async function getJson(url, init, ms = 8000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Returns { tracks, albums, blogPosts, pressEntries, fetchedAt }; any part that failed is null. */
export async function fetchCatalog(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const rest = (table, fields, order) =>
    getJson(`${url}/rest/v1/${table}?select=${fields}&is_public=eq.true&order=${order}`, { headers });
  const sanity = async (template) => {
    const data = await getJson(`${url}/functions/v1/sanity-query`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ template }),
    });
    return data && !data.error && Array.isArray(data.result) ? data.result : null;
  };
  const [tracks, albums, blogPosts, pressEntries] = await Promise.all([
    rest("tracks", TRACK_FIELDS, "release_year.desc.nullslast,created_at.desc"),
    rest("albums", ALBUM_FIELDS, "release_year.desc"),
    sanity("blog-posts"),
    sanity("press-entries"),
  ]);
  return { tracks, albums, blogPosts, pressEntries, fetchedAt: new Date().toISOString() };
}

/** Reads VITE_* values from .env files, the way Vite does, without needing Vite. */
function readEnv(root) {
  const env = { ...process.env };
  for (const name of [".env", ".env.local", ".env.production"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
      if (m && !(m[1] in process.env)) env[m[1]] = m[2];
    }
  }
  return env;
}

// Run directly: refresh src/seo/catalog-snapshot.json
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const out = path.join(root, "src/seo/catalog-snapshot.json");
  const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
  const fresh = await fetchCatalog(readEnv(root));
  if (!fresh) {
    console.error("No Supabase URL or key found in .env; snapshot left unchanged.");
    process.exit(1);
  }
  // keep the previous value for anything that failed this time
  const merged = Object.fromEntries(
    Object.entries(fresh).map(([k, v]) => [k, v ?? prev[k] ?? null]),
  );
  fs.writeFileSync(out, JSON.stringify(merged, null, 1) + "\n");
  const n = (v) => (Array.isArray(v) ? v.length : "failed");
  console.log(
    `snapshot written: ${n(fresh.tracks)} tracks, ${n(fresh.albums)} albums, ${n(fresh.blogPosts)} Sanity blog posts, ${n(fresh.pressEntries)} Sanity press entries`,
  );
}

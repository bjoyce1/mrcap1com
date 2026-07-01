import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BASE = "https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/api-v1";

const endpoints = [
  { method: "GET", path: "/music/albums", scope: "read:music", desc: "List all public albums." },
  { method: "GET", path: "/music/albums/:slug", scope: "read:music", desc: "Single album with tracklist." },
  { method: "GET", path: "/music/tracks", scope: "read:music", desc: "List tracks (filter: ?year=2023)." },
  { method: "GET", path: "/music/tracks/:slug", scope: "read:music", desc: "Single track detail." },
  { method: "GET", path: "/events", scope: "read:events", desc: "Upcoming events." },
  { method: "POST", path: "/fans", scope: "admin:fans", desc: "Add a fan/newsletter signup." },
  { method: "POST", path: "/analytics/event", scope: "admin:analytics", desc: "Ingest an analytics event." },
];

export default function ApiDocs() {
  useEffect(() => { document.title = "Mr. CAP API — Developer Docs"; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container max-w-4xl mx-auto pt-32 pb-24 px-4">
        <div className="text-xs font-mono uppercase tracking-widest text-primary/70">Catalog · Developer API</div>
        <h1 className="font-display text-4xl md:text-6xl mt-2 mb-4">Mr. CAP API v1</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-8">
          One JSON API for the entire Mr. CAP catalog: music, press, blog, merch, NFTs, events.
          Get a key from the <a href="/admin/api" className="text-primary underline">admin panel</a>.
        </p>

        <Card className="p-6 mb-8 space-y-2">
          <div className="text-xs font-mono uppercase text-muted-foreground">Base URL</div>
          <code className="block font-mono text-sm bg-background p-3 rounded break-all">{BASE}</code>
          <div className="text-xs font-mono uppercase text-muted-foreground pt-2">Auth</div>
          <code className="block font-mono text-sm bg-background p-3 rounded">
            Authorization: Bearer mck_live_…
          </code>
          <p className="text-xs text-muted-foreground pt-1">
            Or use the header <code className="font-mono">x-api-key</code>.
          </p>
        </Card>

        <h2 className="font-display text-2xl mb-4">Endpoints</h2>
        <div className="space-y-3 mb-8">
          {endpoints.map((e) => (
            <Card key={e.path + e.method} className="p-4 flex items-start gap-4">
              <Badge variant={e.method === "GET" ? "secondary" : "default"} className="font-mono">
                {e.method}
              </Badge>
              <div className="flex-1">
                <code className="font-mono text-sm">{e.path}</code>
                <div className="text-xs text-muted-foreground mt-1">{e.desc}</div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">{e.scope}</Badge>
            </Card>
          ))}
        </div>

        <h2 className="font-display text-2xl mb-4">Example</h2>
        <Card className="p-6">
          <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
{`curl "${BASE}/music/albums" \\
  -H "Authorization: Bearer mck_live_YOUR_KEY"

# Response
{
  "data": [
    { "id": "…", "slug": "art-of-ism", "title": "…", "release_year": 2024, "cover_art_url": "…" }
  ],
  "meta": { "count": 10 }
}`}
          </pre>
        </Card>

        <h2 className="font-display text-2xl mb-4 mt-8">JavaScript client</h2>
        <Card className="p-6">
          <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
{`import { createMrCapClient } from "@/lib/mrcapApi";

const api = createMrCapClient({ key: import.meta.env.VITE_MRCAP_API_KEY });
const { data: albums } = await api.music.albums();`}
          </pre>
        </Card>

        <div className="mt-12 p-6 border border-primary/30 rounded-lg bg-primary/5">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Rate limits</div>
          <p className="text-sm text-muted-foreground">
            Default 60 requests/minute per key. Higher limits available on request.
            All requests are logged; abuse causes automatic revocation.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

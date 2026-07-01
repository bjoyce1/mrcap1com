import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Copy, Trash2, Plus, Key } from "lucide-react";
import Navigation from "@/components/Navigation";

const ALL_SCOPES = [
  "read:music",
  "read:press",
  "read:blog",
  "read:merch",
  "read:nfts",
  "read:events",
  "admin:fans",
  "admin:analytics",
  "admin:webhooks",
  "*",
];

interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  owner_site: string | null;
  scopes: string[];
  rate_limit_per_min: number;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

const generateKey = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `mck_live_${rand}`;
};

async function sha256Hex(input: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminApi() {
  const { user, isAdmin, loading } = useAuth();
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [name, setName] = useState("");
  const [ownerSite, setOwnerSite] = useState("");
  const [scopes, setScopes] = useState<string[]>(["read:music"]);
  const [rateLimit, setRateLimit] = useState(60);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchKeys = async () => {
    const { data } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setKeys(data as ApiKeyRow[]);
  };

  useEffect(() => { if (isAdmin) fetchKeys(); }, [isAdmin]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/auth?redirect=/admin/api" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const toggleScope = (s: string) => {
    setScopes((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast({ title: "Name required", variant: "destructive" });
    setCreating(true);
    const raw = generateKey();
    const hash = await sha256Hex(raw);
    const { error } = await supabase.from("api_keys").insert({
      name: name.trim(),
      key_hash: hash,
      key_prefix: raw.slice(0, 16),
      owner_site: ownerSite.trim() || null,
      scopes,
      rate_limit_per_min: rateLimit,
      created_by: user.id,
    });
    setCreating(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewKey(raw);
    setName(""); setOwnerSite(""); setScopes(["read:music"]); setRateLimit(60);
    fetchKeys();
  };

  const revoke = async (id: string) => {
    if (!confirm("Revoke this key? Callers will immediately lose access.")) return;
    await supabase.from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", id);
    fetchKeys();
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container max-w-5xl mx-auto pt-32 pb-24 px-4 space-y-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary/70">Archive · API</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2">API Keys</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Issue keys to your partner sites and integrations. Base URL:{" "}
            <code className="text-primary font-mono text-xs">
              https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/api-v1
            </code>
          </p>
        </div>

        {newKey && (
          <Card className="p-6 border-primary/40 bg-primary/5">
            <div className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Save this key — shown once</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-background rounded font-mono text-sm break-all">{newKey}</code>
              <Button size="sm" onClick={() => copy(newKey)}><Copy className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setNewKey(null)}>Dismiss</Button>
            </div>
          </Card>
        )}

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <h2 className="font-display text-xl">Create Key</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Art of ISM site" />
            </div>
            <div>
              <Label>Owner site (optional)</Label>
              <Input value={ownerSite} onChange={(e) => setOwnerSite(e.target.value)} placeholder="theartofism.com" />
            </div>
            <div>
              <Label>Rate limit / min</Label>
              <Input type="number" value={rateLimit} onChange={(e) => setRateLimit(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>Scopes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_SCOPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleScope(s)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition ${
                    scopes.includes(s)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            <Key className="w-4 h-4 mr-2" /> {creating ? "Creating…" : "Generate Key"}
          </Button>
        </Card>

        <div>
          <h2 className="font-display text-xl mb-4">Active Keys ({keys.length})</h2>
          <div className="space-y-3">
            {keys.length === 0 && (
              <p className="text-muted-foreground text-sm">No keys yet.</p>
            )}
            {keys.map((k) => (
              <Card key={k.id} className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="font-medium">{k.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {k.key_prefix}…  ·  {k.owner_site || "no site"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {k.scopes.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px] font-mono">{s}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {k.rate_limit_per_min}/min
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {k.last_used_at ? `used ${new Date(k.last_used_at).toLocaleDateString()}` : "never used"}
                </div>
                {k.revoked_at ? (
                  <Badge variant="destructive">Revoked</Badge>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => revoke(k.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

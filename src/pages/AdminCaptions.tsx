import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Check, Copy, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

type Captions = { instagram: string; tiktok: string; x: string };
const LABELS: Record<keyof Captions, string> = { instagram: "Instagram caption", tiktok: "TikTok caption", x: "X post" };

export default function AdminCaptions() {
  const { user, isAdmin, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("https://mrcap1.com/music");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState<Captions | null>(null);
  const [copied, setCopied] = useState<string>("");

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/auth" replace />;

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: fnError } = await supabase.functions.invoke("social-captions", { body: { title, details, link } });
    setBusy(false);
    if (fnError || data?.error) {
      let msg = data?.error as string | undefined;
      if (!msg && fnError && "context" in fnError) {
        try { msg = (await (fnError as { context: Response }).context.json())?.error; } catch { /* ignore */ }
      }
      setError(msg || "Could not generate captions.");
      return;
    }
    setCaptions(data.captions);
  };

  const copy = async (key: keyof Captions) => {
    if (!captions) return;
    await navigator.clipboard.writeText(captions[key]);
    setCopied(key);
    toast.success(`${LABELS[key]} copied`);
    window.setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Release Caption Studio</h1>
        <p className="text-muted-foreground mb-8">Enter a release and get distinct Instagram, TikTok and X posts, each with its own tracked link.</p>

        <form onSubmit={generate} className="space-y-5 rounded-3xl bg-card/40 p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
          <div className="space-y-2">
            <Label htmlFor="title">Release title</Label>
            <Input id="title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bet On Her" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Song details</Label>
            <Textarea id="details" maxLength={2000} rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Features, vibe, story behind it, release date..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Music link</Label>
            <Input id="link" type="url" required value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="rounded-full gap-2">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {busy ? "Writing..." : captions ? "Write new versions" : "Generate posts"}
          </Button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </form>

        {captions && (
          <div className="mt-8 space-y-4">
            {(Object.keys(LABELS) as (keyof Captions)[]).map((k) => (
              <section key={k} className="rounded-3xl bg-card/40 p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">{LABELS[k]}</h2>
                  <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => copy(k)}>
                    {copied === k ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === k ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{captions[k]}</p>
                {k === "x" && <p className="mt-2 text-xs text-muted-foreground">{captions.x.length} characters</p>}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

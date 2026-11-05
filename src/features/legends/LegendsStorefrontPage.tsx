import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowUpRight, Crown, Search, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { VAULT, isOwned, loadVault, type VaultItem, type VaultState } from "./vault";
import { symbolUrl } from "./motion";
import VaultCheckout from "./VaultCheckout";
import SpendAccountPanel from "./SpendAccountPanel";

type Category = "all" | "legend" | "skin" | "title";
const LABELS = { legend: "Legend", skin: "Cabinet skin", title: "Player title", song: "Song" };

export default function LegendsStorefrontPage({ spend = false }: { spend?: boolean }) {
  const { user, loading } = useAuth();
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<VaultState | null>(null);
  const [error, setError] = useState(false);
  const [checkout, setCheckout] = useState<VaultItem | null>(null);
  const [note, setNote] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setState(null); setError(false); setCheckout(null);
    if (user) loadVault(user.id).then((data) => { if (active) setState(data); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [user?.id]);
  const items = VAULT.filter((item) => item.kind !== "song" && (category === "all" || item.kind === category) && `${item.name} ${item.detail}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <main className="min-h-screen bg-background px-4 pt-28 pb-32 md:px-8">
    <Helmet><title>{spend ? "SPC Legends Spend" : "SPC Legends Storefront"} | Mr. CAP Legacy</title><meta name="description" content="Browse SPC Legends, cabinet skins and player titles with prices and descriptions. Buy through PayPal and manage your unlocks in the Vault." /><meta name="robots" content="noindex" /></Helmet>
    <div className="mx-auto max-w-6xl">
      <header className="space-y-5 pb-10">
        <Button asChild variant="link" className="px-0"><Link to="/legends/vault"><ArrowLeft className="h-4 w-4 mr-2" />Back to the Vault</Link></Button>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-primary text-xs uppercase tracking-widest mb-3">South Park Coalition</p><h1 className="font-serif text-4xl md:text-5xl">{spend ? "SPC Legends Spend" : "SPC Legends Storefront"}</h1></div>
          <Button asChild variant="secondary"><Link to="/legends"><ArrowUpRight className="mr-2 h-4 w-4" />Play SPC Legends</Link></Button>
        </div>
        <p className="text-muted-foreground max-w-2xl">Legends for your reels. Looks for your cabinet. A title of your own.</p>
      </header>
      {!spend && <Button asChild variant="secondary" className="mb-8"><Link to="/legends/spend">Your balance and purchase history</Link></Button>}
      {spend && user && <SpendAccountPanel key={user.id} userId={user.id} revision={revision} onUpdated={setState} onResume={(itemId) => { const item = VAULT.find((entry) => entry.id === itemId); if (item) setCheckout(item); }} />}
      {spend && !loading && !user && <div className="mb-8 space-y-3"><p className="text-muted-foreground">Sign in to see your balances and purchase history.</p><Button asChild><Link to="/auth" state={{ returnTo: "/legends/spend" }}>Sign in</Link></Button></div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <Tabs value={category} onValueChange={(value) => setCategory(value as Category)}><TabsList className="w-full sm:w-auto"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="legend">Legends</TabsTrigger><TabsTrigger value="skin">Skins</TabsTrigger><TabsTrigger value="title">Titles</TabsTrigger></TabsList></Tabs>
        <div className="relative sm:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search storefront" placeholder="Search the storefront" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" /></div>
      </div>
      {error && <p role="alert" className="text-destructive mb-5">Your owned items could not load. Refresh before purchasing.</p>}
      {note && <p role="status" className="text-primary mb-5">{note}</p>}
      {checkout && user && <div className="mb-8"><VaultCheckout key={`${user.id}:${checkout.id}`} item={checkout} userId={user.id} onClose={() => { setCheckout(null); setRevision((value) => value + 1); }} onPaid={(updated) => { setState(updated); setNote(`${checkout.name} unlocked. Manage it in the Vault.`); setCheckout(null); setRevision((value) => value + 1); }} /></div>}
      <p className="text-xs text-muted-foreground mb-4">{items.length} items</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const owned = state && isOwned(item, state);
          const price = `$${((item.priceCents ?? 0) / 100).toFixed(2)}`;
          const Icon = item.kind === "skin" ? Sparkles : Crown;
          return <article key={item.id} className="bg-card rounded-lg overflow-hidden flex flex-col shadow-lg">
            {item.artist ? <img src={symbolUrl(item.artist)} alt={item.name} className="aspect-[4/5] w-full object-contain bg-muted" loading="lazy" /> : <div className="aspect-[4/5] flex flex-col items-center justify-center gap-5 px-5 bg-muted text-primary"><Icon className="h-16 w-16" strokeWidth={1} /><span className="font-serif text-2xl text-center text-foreground">{item.name}</span></div>}
            <div className="p-5 flex flex-col flex-1"><p className="text-xs text-muted-foreground uppercase tracking-widest">{LABELS[item.kind]}</p><h2 className="font-serif text-xl mt-2">{item.name}</h2><p className="text-sm text-muted-foreground mt-3 flex-1">{item.detail}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6"><span className="text-primary tabular-nums font-medium">{price} <span className="text-xs">USD</span></span>
                {owned ? <Button asChild size="sm" variant="secondary"><Link to={`/legends/vault#${item.id}`}>Owned<ArrowUpRight className="ml-2 h-3 w-3" /></Link></Button> : !user && !loading ? <Button asChild size="sm"><Link to="/auth" state={{ returnTo: spend ? "/legends/spend" : "/legends/storefront" }}>Sign in to buy</Link></Button> : <Button size="sm" disabled={!state || loading || !!checkout || error} onClick={() => { setCheckout(item); window.scrollTo({ top: 0, behavior: "instant" }); }}><ShoppingBag className="mr-2 h-3 w-3" />Buy {price}</Button>}
              </div>
            </div>
          </article>;
        })}
      </div>
      {!items.length && <div className="py-16 text-center"><p className="text-muted-foreground">No items match your search.</p><Button variant="link" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</Button></div>}
      <p className="text-xs text-muted-foreground mt-10 max-w-3xl">Mr. CAP is the starter Legend. Owned Legends join your account reel pool and change symbol odds. Skins and titles are cosmetic. Purchases never spend XP or coins. Virtual items have no cash redemption value.</p>
    </div>
  </main>;
}
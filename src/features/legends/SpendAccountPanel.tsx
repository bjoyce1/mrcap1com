import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { loadVault, VAULT, type VaultState } from "./vault";
import { loadProfile } from "./account";
import { totalSpins } from "./balance";
import { confirmedSpendCents, type SpendPurchase } from "./spend-history";

export default function SpendAccountPanel({ userId, revision, onUpdated, onResume }: { userId: string; revision: number; onUpdated: (state: VaultState) => void; onResume: (itemId: string) => void }) {
  const [rows, setRows] = useState<SpendPurchase[]>([]);
  const [totals, setTotals] = useState<{ coins: number; xp: number; spins: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [updated, setUpdated] = useState<string>("");
  useEffect(() => {
    let active = true;
    let reading = false;
    const read = async () => {
      if (reading || document.hidden) return;
      reading = true; setBusy(true);
      try {
        const [vault, profile, purchases] = await Promise.all([loadVault(userId), loadProfile(userId), supabase.from("legends_vault_purchases").select("id,item_id,amount_cents,currency,status,created_at,paid_at,paypal_order_id").eq("user_id", userId).order("created_at", { ascending: false })]);
        if (purchases.error) throw purchases.error;
        if (!active) return;
        setRows(purchases.data ?? []); setTotals({ coins: vault.coins, xp: vault.xp, spins: totalSpins(profile.balance) });
        onUpdated(vault); setError(false); setUpdated(new Date().toLocaleTimeString());
      } catch { if (active) setError(true); }
      finally { reading = false; if (active) setBusy(false); }
    };
    void read();
    const timer = window.setInterval(read, 15000);
    window.addEventListener("focus", read);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", read); };
  }, [userId, revision, refresh, onUpdated]);
  const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  return <section className="mb-10 space-y-6" aria-label="Live balances and purchase history">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Your account</h2><Button variant="secondary" size="sm" disabled={busy} onClick={() => setRefresh((value) => value + 1)}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-muted rounded-lg p-5">
      {[['Coins', totals?.coins.toLocaleString()], ['Total XP', totals?.xp.toLocaleString()], ['Available spins', totals?.spins.toLocaleString()], ['Vault spending', totals ? money(confirmedSpendCents(rows)) : undefined]].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p><p className="text-2xl text-primary tabular-nums mt-2">{value ?? "..."}</p></div>)}
    </div>
    <p role="status" className="text-xs text-muted-foreground">{error ? "Account updates could not load. Refresh before purchasing." : updated ? `Updated ${updated}. No stored cash balance; each purchase is paid through PayPal.` : "Loading account..."}</p>
    <div className="space-y-4"><h3 className="font-serif text-xl">Purchase history</h3>
      {!rows.length && totals && <p className="text-sm text-muted-foreground">No Vault purchases yet.</p>}
      {rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 bg-card rounded-lg p-4">
        <div><p className="font-medium">{VAULT.find((item) => item.id === row.item_id)?.name ?? row.item_id}</p><p className="text-xs text-muted-foreground mt-1">{new Date(row.paid_at ?? row.created_at).toLocaleString()} · {row.status === "paid" ? "Paid and unlocked" : row.status === "failed" ? "Checkout failed" : "Awaiting payment confirmation"}</p></div>
        <div className="flex flex-wrap items-center gap-3"><span className="tabular-nums text-primary">{money(row.amount_cents)}</span>{row.status === "created" && row.paypal_order_id && <Button size="sm" variant="secondary" onClick={() => onResume(row.item_id)}>Resume checkout</Button>}{row.status === "paid" && <Button asChild size="sm" variant="secondary"><Link to={`/legends/vault#${row.item_id}`}>View unlock</Link></Button>}</div>
      </div>)}
    </div>
  </section>;
}
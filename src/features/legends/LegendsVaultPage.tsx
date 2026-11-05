import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { symbolUrl } from "./motion";
import VaultCheckout from "./VaultCheckout";
import { reelOdds } from "../../../supabase/functions/_shared/legends/reel-access";
import { VAULT, isOwned, loadVault, readLook, redeem, saveLook, vaultSongUrl, type Look, type VaultItem, type VaultState } from "./vault";

const fmt = (n: number) => n.toLocaleString();
const SECTIONS: { kind: VaultItem["kind"]; title: string }[] = [
  { kind: "legend", title: "Unlock Legends" },
  { kind: "skin", title: "Cabinet Skins" },
  { kind: "title", title: "Player Titles" },
  { kind: "song", title: "Song Unlocks" },
];
const MSG: Record<string, string> = {
  owned: "You already own this.", not_enough: "Not enough coins yet. Keep spinning.",
  signed_out: "Please sign in again.", failed: "Something went wrong. Try again.",
};

export default function LegendsVaultPage() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<VaultState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [look, setLook] = useState<Look>(readLook());
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<VaultItem | null>(null);
  const odds = state ? reelOdds(state) : [];

  useEffect(() => { if (user) loadVault(user.id).then(setState).catch(() => setNote(MSG.failed)); }, [user]);
  useEffect(() => () => audio.current?.pause(), []);

  const buy = async (item: VaultItem) => {
    setBusy(item.id); setNote("");
    const r = await redeem(item.id);
    setBusy(null);
    if ("error" in r) return setNote(MSG[r.error]);
    setState((s) => s && { ...s, ...r });
    setNote(`${item.name} unlocked.`);
  };
  const equip = (item: VaultItem) => {
    const key = item.kind === "skin" ? "skin" : "title";
    const next = { ...look, [key]: look[key] === item.id ? undefined : item.id };
    setLook(next); saveLook(next);
  };
  const play = (item: VaultItem) => {
    audio.current?.pause();
    if (playing === item.id) return setPlaying(null);
    const url = vaultSongUrl(item.name);
    if (!url) return;
    audio.current = new Audio(url);
    audio.current.onended = () => setPlaying(null);
    audio.current.play().catch(() => setNote(MSG.failed));
    setPlaying(item.id);
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-28 md:px-8">
      <Helmet>
        <title>SPC Legends Vault | Legends, Skins and Titles</title>
        <meta name="description" content="Buy Legends, cabinet skins and player titles for $0.99 USD each. Unlock album songs with earned coins. Virtual items have no resale or cash redemption value." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <Link to="/legends" className="text-sm text-muted-foreground hover:text-primary">Back to the game</Link>
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">The Vault</h1>
          <Button asChild variant="secondary"><Link to="/legends/storefront">Browse the storefront</Link></Button>
          <p className="max-w-2xl text-muted-foreground">Legends, skins and titles are $0.99 USD each. Mr. CAP is your starter. Only owned Legends appear on account reels; buying one changes symbol odds. Song unlocks use earned coins. Purchases never lower your XP or rank. Virtual items and coins cannot be exchanged for cash.</p>
        </header>

        {!loading && !user ? (
          <div className="rounded-xl bg-card p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
            <p className="text-foreground">Sign in to purchase Vault items or spend earned coins.</p>
            <Button asChild className="mt-4"><Link to="/auth" state={{ returnTo: "/legends/vault" }}>Sign in</Link></Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-6 rounded-xl bg-card p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
              <div><div className="text-xs uppercase tracking-widest text-muted-foreground">Coins</div><div className="tabular-nums text-3xl text-primary">{state ? fmt(state.coins) : "..."}</div></div>
              <div><div className="text-xs uppercase tracking-widest text-muted-foreground">Total XP</div><div className="tabular-nums text-xl text-foreground">{state ? fmt(state.xp) : "..."}</div></div>
              {note && <p role="status" className="text-sm text-foreground">{note}</p>}
            </div>
            {checkout && user && <VaultCheckout key={`${user.id}:${checkout.id}`} item={checkout} userId={user.id} onClose={() => setCheckout(null)} onPaid={(updated) => { setState(updated); setNote(`${checkout.name} unlocked. Payment confirmed.`); setCheckout(null); }} />}
            {SECTIONS.map((sec) => (
              <section key={sec.kind} className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground">{sec.title}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {VAULT.filter((i) => i.kind === sec.kind).map((item) => {
                    const owned = !!state && isOwned(item, state);
                    const equipped = look.skin === item.id || look.title === item.id;
                    return (
                      <div key={item.id} id={item.id} className="scroll-mt-28 flex flex-col rounded-xl bg-card p-5 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
                        <div className="flex items-center gap-3">
                          {item.artist && <img src={symbolUrl(item.artist)} alt="" className="h-12 w-12 rounded-md object-cover" loading="lazy" />}
                          <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
                        </div>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.detail}</p>
                        {item.artist && state && <p className="mt-2 text-sm text-primary">{owned ? `Reel eligible · ${((odds.find((entry) => entry.id === item.artist)?.probability ?? 0) * 100).toFixed(2)}% per position` : "Locked · 0% on account reels"}</p>}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="tabular-nums text-primary">{item.priceCents !== undefined ? `$${(item.priceCents / 100).toFixed(2)} USD` : `${fmt(item.cost)} coins`}</span>
                          {!owned ? (
                            <Button size="sm" disabled={!state || busy !== null || checkout !== null || (item.priceCents === undefined && state.coins < item.cost)} onClick={() => item.priceCents !== undefined ? setCheckout(item) : buy(item)}>
                              {busy === item.id ? "Unlocking..." : item.priceCents !== undefined ? "Buy $0.99" : "Unlock"}
                            </Button>
                          ) : item.kind === "song" ? (
                            <Button size="sm" variant="secondary" onClick={() => play(item)}>{playing === item.id ? "Stop" : "Play"}</Button>
                          ) : item.kind === "legend" ? (
                            <span className="text-sm text-muted-foreground">Reel unlocked</span>
                          ) : (
                            <Button size="sm" variant={equipped ? "default" : "secondary"} aria-pressed={equipped} onClick={() => equip(item)}>{equipped ? "Equipped" : "Equip"}</Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  );
}

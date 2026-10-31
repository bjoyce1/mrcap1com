import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { routeSeo } from "@/seo/routes";
import { capturePack, loadProfile, startCheckout } from "./account";
import type { Balance } from "./balance";
import { loadStorePayPal, readApprovedOrder, saveApprovedOrder } from "./storeCheckout";
import type { StorePayPalButtons } from "./storeCheckout";
import "@fontsource/russo-one/400.css";
import "./store.css";

export default function LegendsStore() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingOrder, setPendingOrder] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const buyerRef = useRef(user?.id);
  buyerRef.current = user?.id;
  const captureBusy = useRef(false);

  useEffect(() => {
    let active = true;
    setBalance(null); setCheckout(false); setSuccess(false); setMessage(""); setAgeConfirmed(false);
    setPendingOrder(user ? readApprovedOrder(user.id) : null);
    if (!user) { setBalanceLoading(false); return; }
    setBalanceLoading(true);
    void loadProfile(user.id).then(profile => { if (active) setBalance(profile.balance); })
      .catch(() => { if (active) setMessage("Your balance could not load. Refresh before buying spins."); })
      .finally(() => { if (active) setBalanceLoading(false); });
    return () => { active = false; };
  }, [user?.id]);

  const confirm = useCallback(async (orderID: string, buyer: string) => {
    if (captureBusy.current || buyerRef.current !== buyer) return;
    captureBusy.current = true; setBusy(true); setSuccess(false);
    saveApprovedOrder(buyer, orderID); setPendingOrder(orderID);
    setMessage("Confirming your payment…");
    try {
      const result = await capturePack(orderID);
      if (buyerRef.current !== buyer) return;
      if ("error" in result) throw new Error("Payment is not confirmed yet. Retry confirmation before paying again.");
      saveApprovedOrder(buyer, null); setPendingOrder(null);
      setBalance(result.balance); setSuccess(true); setCheckout(false);
      setMessage("Payment confirmed. Your paid spin balance is updated.");
    } catch (error) {
      if (buyerRef.current === buyer) setMessage(error instanceof Error ? error.message : "Retry payment confirmation before buying again.");
    } finally { captureBusy.current = false; setBusy(false); }
  }, []);

  useEffect(() => {
    if (!checkout || !user || !container.current) return;
    const buyer = user.id;
    const element = container.current;
    let active = true;
    let buttons: StorePayPalButtons | undefined;
    setBusy(true); setMessage("Loading PayPal…");
    void loadStorePayPal().then(async sdk => {
      if (!active) return;
      buttons = sdk.Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 },
        createOrder: async () => {
          if (!active || buyerRef.current !== buyer || readApprovedOrder(buyer)) throw new Error("Confirm your previous payment first.");
          const order = await startCheckout();
          if ("error" in order) {
            const text = order.error === "not_on_sale" ? "Spin packs are currently unavailable." : order.error === "signed_out" ? "Sign in again to buy spins." : "Checkout could not start. Please try again.";
            if (active) setMessage(text);
            throw new Error(text);
          }
          return order.orderID;
        },
        onApprove: async (data: { orderID: string }) => { if (active) await confirm(data.orderID, buyer); },
        onCancel: () => { if (active) setMessage("Checkout cancelled. No spins added."); },
        onError: () => { if (active) setMessage("PayPal could not finish. If you approved payment, retry confirmation before paying again."); },
      });
      await buttons.render(element);
      if (active) setMessage("Complete your $1.00 USD payment with PayPal.");
    }).catch(error => { if (active) { setCheckout(false); setMessage(error instanceof Error ? error.message : "PayPal could not load."); } })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; void buttons?.close().catch(() => undefined); element.replaceChildren(); };
  }, [checkout, user?.id, confirm]);

  function buy() {
    if (!user) { navigate("/auth", { state: { returnTo: "/legends-store" } }); return; }
    if (!ageConfirmed || !balance || pendingOrder) return;
    setSuccess(false); setCheckout(true);
  }

  return <>
    <SEO entry={routeSeo("/legends-store")} />
    <main className="legends-store bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Button variant="ghost" asChild className="mb-8"><Link to="/legends"><ArrowLeft size={16} className="mr-2" /> Back to the game</Link></Button>
        <header className="mb-10">
          <img className="ls-wordmark" src="/games/spc-legends/ui/wordmark.webp" alt="SPC Legends" width={750} height={147} />
          <p className="mt-5 text-sm text-primary">713 MIXHOUSE ARCADE</p>
          <h1 className="ls-title mt-3">SPIN STORE</h1>
          <p className="mt-4 text-muted-foreground">Keep the mix going. Your next 25 spins are ready.</p>
        </header>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <section aria-label="25 spin pack" className="ls-pack">
            <img src="/games/spc-legends/symbols/bonus.webp" alt="713 Houston Bonus arcade symbol" className="ls-pack-art" width={480} height={500} />
            <div className="flex items-end justify-between gap-4 py-6">
              <div><h2 className="text-3xl font-bold">25 SPINS</h2><p className="mt-2 text-sm text-muted-foreground">One pack. Never expires.</p></div>
              <p className="text-4xl font-bold text-primary">$1.00<span className="mt-2 block text-right text-xs text-muted-foreground">USD</span></p>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">Packs stack in your account. Welcome spins are used first, then today’s free spins, then paid spins.</p>
          </section>
          <section aria-label="Spin pack checkout" className="py-3">
            <h2 className="text-xl font-semibold">YOUR SPIN BALANCE</h2>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {([['Welcome', balance?.welcomeLeft], ['Free today', balance?.dailyLeft], ['Paid', balance?.paidSpins]] as const).map(([label, value]) => <div key={label} className="bg-card px-3 py-5 shadow-lg rounded-md"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-3 text-3xl font-bold">{value ?? "·"}</dd></div>)}
            </dl>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">25 one-time welcome spins, then 3 free spins per Houston calendar day. Welcome and paid spins never expire.</p>
            {authLoading || balanceLoading ? <p className="mt-8 flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Loading your account…</p> : <>
              {user && <label className="mt-8 flex items-center gap-3 text-sm"><input type="checkbox" checked={ageConfirmed} disabled={busy || checkout} onChange={event => setAgeConfirmed(event.target.checked)} className="h-5 w-5 accent-primary" /> I am 18 or older</label>}
              {!checkout && !pendingOrder && <Button variant="gold" size="lg" className="mt-6 w-full" disabled={busy || (!!user && (!ageConfirmed || !balance))} onClick={buy}><ShoppingBag size={18} className="mr-2" />{user ? "BUY 25 SPINS · $1.00" : "SIGN IN TO BUY 25 SPINS"}</Button>}
              {checkout && <div ref={container} className="mt-6 min-h-40" aria-label="PayPal checkout" />}
              {pendingOrder && <Button variant="gold" className="mt-6 w-full" disabled={busy} onClick={() => { if (user) void confirm(pendingOrder, user.id); }}>{busy ? <Loader2 className="mr-2 animate-spin" size={18} /> : null}Retry payment confirmation</Button>}
            </>}
            <div role="status" aria-live="polite" className="mt-5 min-h-12 text-sm leading-6">{success && <CheckCircle2 className="mr-2 inline text-primary" size={18} />}{message}</div>
            {success && <Button asChild variant="secondary" className="mb-6 w-full"><Link to="/legends">Play your spins <ArrowRight size={16} className="ml-2" /></Link></Button>}
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck size={18} /> Payment handled by PayPal</p>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">Virtual XP only. No cash, prizes or real-world rewards. Wins do not award spins. All sales are final unless the law requires a refund.</p>
            <Button asChild variant="link" className="mt-3 px-0"><a href="mailto:music@mrcap1.com">Payment help</a></Button>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
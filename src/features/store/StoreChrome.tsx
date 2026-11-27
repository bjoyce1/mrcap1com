// The store's own frame, after makobiusa.com: an announcement bar, a white header with the store's
// departments and search and the bag, a cart drawer that hands off to the existing PayPal checkout,
// and a black footer with the newsletter. The site's dark tokens are switched to light at the root
// while a store page is open, so the checkout panel and every popup it opens match the store.
import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, Instagram, Menu, Minus, Plus, Search, ShoppingBag, X, Youtube } from "lucide-react";
import { toast } from "sonner";
import mrCapCoin from "@/assets/mr-cap-coin.webp";
import { supabase } from "@/integrations/supabase/client";
import { trackEmailSignup } from "@/components/GoogleAnalytics";
import ObfuscatedMailto from "@/components/ObfuscatedMailto";
import { useCartStore } from "@/stores/cartStore";
import { CheckoutPanel } from "@/components/merch/CheckoutPanel";
import { BRANDS, CATEGORIES, DEPARTMENTS, brandParam, money, priceLabel, useCatalog } from "./catalog";
import "./store.css";

/** Light tokens at the root while the store is open, so portaled popups (checkout, selects) match it. */
function useStoreTheme() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("st-theme");
    document.body.classList.add("st-body");
    return () => {
      document.documentElement.classList.remove("st-theme");
      document.body.classList.remove("st-body");
    };
  }, []);
}

function Logo() {
  return (
    <Link to="/merch" className="st-logo" aria-label="Mr. CAP Official Store, store home">
      <img src={mrCapCoin} alt="" width={40} height={40} />
      <span className="st-logo__word">MR. CAP</span>
      <span className="st-logo__sub">Official store</span>
    </Link>
  );
}

function SearchDialog() {
  const { data: products = [] } = useCatalog();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products.slice(0, 6);
    return products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(t)).slice(0, 8);
  }, [q, products]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
      <Dialog.Trigger className="st-icon-btn" aria-label="Search the store"><Search aria-hidden="true" /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="st-overlay" />
        <Dialog.Content className="st st-search" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Search the store</Dialog.Title>
          <form
            className="st-search__bar"
            onSubmit={(e) => { e.preventDefault(); if (results[0]) { setOpen(false); navigate(`/merch/${results[0].slug}`); } }}
          >
            <Search aria-hidden="true" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tees, hoodies, slides…" aria-label="Search products" />
            <Dialog.Close className="st-icon-btn" aria-label="Close search"><X aria-hidden="true" /></Dialog.Close>
          </form>
          <p className="st-search__head">{q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular right now"}</p>
          <ul className="st-search__list">
            {results.map((p) => (
              <li key={p.id}>
                <Link to={`/merch/${p.slug}`} onClick={() => setOpen(false)}>
                  <span className="st-search__img"><img src={p.images[0]} alt="" loading="lazy" /></span>
                  <span><strong>{p.name}</strong><small>{p.brand} · {priceLabel(p)}</small></span>
                </Link>
              </li>
            ))}
            {!results.length && <li className="st-search__none">Nothing matches “{q}”. Try “tee”, “hat” or “slides”.</li>}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CartButton() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  return (
    <button type="button" className="st-icon-btn st-bag" onClick={openCart} aria-label={count ? `Open bag, ${count} item${count === 1 ? "" : "s"}` : "Open bag"}>
      <ShoppingBag aria-hidden="true" />
      {count > 0 && <span className="st-bag__count" aria-hidden="true">{count > 9 ? "9+" : count}</span>}
    </button>
  );
}

/** The bag: a side drawer over the store; checkout is the existing PayPal + Printful panel. */
function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const [checkout, setCheckout] = useState(false);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  return (
    <>
      <Dialog.Root open={isOpen && !checkout} onOpenChange={(o) => { if (!o) closeCart(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="st-overlay" />
          <Dialog.Content className="st st-drawer" aria-describedby={undefined}>
            <div className="st-drawer__head">
              <Dialog.Title className="st-drawer__title">Your bag {items.length > 0 && <span>({items.reduce((n, i) => n + i.quantity, 0)})</span>}</Dialog.Title>
              <Dialog.Close className="st-icon-btn" aria-label="Close bag"><X aria-hidden="true" /></Dialog.Close>
            </div>
            {items.length === 0 ? (
              <div className="st-drawer__empty">
                <ShoppingBag aria-hidden="true" />
                <p>Your bag is empty.</p>
                <Dialog.Close asChild><Link to="/merch#shop" className="st-btn st-btn--dark">Shop the store</Link></Dialog.Close>
              </div>
            ) : (
              <>
                <ul className="st-drawer__items">
                  {items.map((item) => (
                    <li key={item.variantId}>
                      <span className="st-drawer__img"><img src={item.image} alt="" /></span>
                      <div className="st-drawer__info">
                        <p className="st-drawer__name">{item.name}</p>
                        {item.variantName && <p className="st-drawer__variant">{item.variantName.replace(item.name, "").replace(/^\s*\/\s*/, "") || item.variantName}</p>}
                        <div className="st-drawer__row">
                          <div className="st-qty st-qty--sm">
                            <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label={`One fewer ${item.name}`}><Minus aria-hidden="true" /></button>
                            <span aria-live="polite">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} disabled={item.quantity >= 10} aria-label={`One more ${item.name}`}><Plus aria-hidden="true" /></button>
                          </div>
                          <strong>{money(item.price * item.quantity, item.currency)}</strong>
                        </div>
                        <button type="button" className="st-drawer__remove" onClick={() => removeItem(item.variantId)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="st-drawer__foot">
                  <div className="st-drawer__total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                  <p>Shipping is calculated at checkout from your address.</p>
                  <button type="button" className="st-btn st-btn--dark st-btn--block" onClick={() => setCheckout(true)}>Checkout <ArrowRight aria-hidden="true" /></button>
                  <Dialog.Close className="st-drawer__keep">Keep shopping</Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <CheckoutPanel isOpen={checkout} onClose={() => { setCheckout(false); closeCart(); }} onBack={() => setCheckout(false)} />
    </>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="st-icon-btn st-menu-btn" aria-label="Open menu"><Menu aria-hidden="true" /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="st-overlay" />
        <Dialog.Content className="st st-menu" aria-describedby={undefined}>
          <div className="st-drawer__head">
            <Dialog.Title className="st-drawer__title">Menu</Dialog.Title>
            <Dialog.Close className="st-icon-btn" aria-label="Close menu"><X aria-hidden="true" /></Dialog.Close>
          </div>
          <nav aria-label="Store">
            {DEPARTMENTS.map((d) => <Link key={d.to} to={d.to} onClick={() => setOpen(false)}>{d.label}</Link>)}
            <Link to="/merch?b=mr-cap-x-sabet#shop" onClick={() => setOpen(false)}>Mr. CAP x Sabet</Link>
          </nav>
          <Link to="/" className="st-menu__site" onClick={() => setOpen(false)}>Back to mrcap1.com <ArrowUpRight aria-hidden="true" /></Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email, source: "merch_page" });
      if (error && error.code !== "23505") throw error;
      if (error) toast.info("You’re already on the list.");
      else { toast.success("You’re on the list."); trackEmailSignup("merch_page"); setEmail(""); }
    } catch {
      toast.error("That didn’t go through. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="st-foot">
      <div className="st-wrap st-foot__grid">
        <div className="st-foot__news">
          <h2>Stay in the loop</h2>
          <p>New drops, restocks and the music behind them, first.</p>
          <form onSubmit={subscribe}>
            <label htmlFor="st-email" className="sr-only">Email address</label>
            <input id="st-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" />
            <button type="submit" className="st-btn st-btn--light" disabled={busy}>{busy ? "Signing up…" : "Sign up"}</button>
          </form>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>{CATEGORIES.map((c) => <li key={c.id}><Link to={`/merch?c=${c.id}#shop`}>{c.label}</Link></li>)}</ul>
        </div>
        <div>
          <h3>Brands</h3>
          <ul>{BRANDS.map((b) => <li key={b}><Link to={`/merch?b=${brandParam(b)}#shop`}>{b}</Link></li>)}</ul>
          <h3 className="st-foot__gap">Help</h3>
          <ul>
            <li><ObfuscatedMailto user="music" domain="mrcap1.com" subject="Store order question">Email the team</ObfuscatedMailto></li>
            <li><Link to="/privacy">Privacy policy</Link></li>
          </ul>
        </div>
        <div>
          <h3>Mr. CAP</h3>
          <ul>
            <li><Link to="/">mrcap1.com</Link></li>
            <li><Link to="/music">Music</Link></li>
            <li><Link to="/live">Shows</Link></li>
            <li><Link to="/booking">Booking</Link></li>
          </ul>
        </div>
      </div>
      <div className="st-wrap st-foot__base">
        <Link to="/merch" className="st-foot__mark" aria-label="Store home"><img src={mrCapCoin} alt="" width={44} height={44} /></Link>
        <div className="st-foot__social">
          <a href="https://www.instagram.com/mrcapism/" target="_blank" rel="noreferrer" aria-label="Instagram (opens in a new tab)"><Instagram aria-hidden="true" /></a>
          <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noreferrer" aria-label="YouTube (opens in a new tab)"><Youtube aria-hidden="true" /></a>
          <a href="https://www.tiktok.com/@mrcapism" target="_blank" rel="noreferrer" aria-label="TikTok (opens in a new tab)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
          </a>
        </div>
        <p>Secure checkout with PayPal · Made to order and shipped to you</p>
        <p>© {new Date().getFullYear()} South Park Coalition LLC · Houston, Texas</p>
      </div>
    </footer>
  );
}

export function StoreShell({ children }: { children: ReactNode }) {
  useStoreTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="st">
      <a href="#st-main" className="st-skip">Skip to products</a>
      <p className="st-announce">
        <Link to="/merch?c=jerseys#shop">New drop: the SPC Basketball Jersey and TrapU Football Jersey <ArrowRight aria-hidden="true" /></Link>
      </p>
      <header className={`st-head ${scrolled ? "is-scrolled" : ""}`}>
        <div className="st-wrap st-head__row">
          <MobileMenu />
          <Logo />
          <nav className="st-nav" aria-label="Store">
            {DEPARTMENTS.map((d) => <Link key={d.to} to={d.to}>{d.label}</Link>)}
          </nav>
          <div className="st-head__tools">
            <Link to="/" className="st-head__site">mrcap1.com <ArrowUpRight aria-hidden="true" /></Link>
            <SearchDialog />
            <CartButton />
          </div>
        </div>
      </header>
      <main id="st-main">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

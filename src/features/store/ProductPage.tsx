// /merch/:slug, a product page after makobiusa.com's: breadcrumb, the gallery beside a sticky buy
// panel (color swatches, size buttons, quantity, add to bag), details below, related products, and
// a bar that keeps the price and the button on screen once the panel scrolls away.
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, Minus, Plus, Truck } from "lucide-react";
import ObfuscatedMailto from "@/components/ObfuscatedMailto";
import { usePlayerStore } from "@/stores/playerStore";
import { StoreShell } from "./StoreChrome";
import { ProductRail } from "./ProductCard";
import { addVariant, brandParam, categoryLabel, money, priceLabel, useCatalog, type StoreProduct } from "./catalog";

function Gallery({ product, image, onPick }: { product: StoreProduct; image: string; onPick: (src: string) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const zoom = (e: PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div className="st-gallery">
      <div ref={stage} className="st-gallery__stage" onPointerMove={zoom}>
        <img key={image} src={image} alt={product.name} width={800} height={800} />
      </div>
      {product.images.length > 1 && (
        <ul className="st-gallery__thumbs" aria-label="More views">
          {product.images.map((src, i) => (
            <li key={src}>
              <button type="button" aria-pressed={src === image} onClick={() => onPick(src)} aria-label={`View ${i + 1} of ${product.images.length}`}>
                <img src={src} alt="" loading="lazy" width={800} height={800} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BuyPanel({ product }: { product: StoreProduct }) {
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(product.images[0]);
  const [nudge, setNudge] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);
  const [barOn, setBarOn] = useState(false);
  const player = usePlayerStore((s) => s.isPlayerVisible && !!s.currentTrack);

  const needsSize = product.sizes.length > 0 && !size;
  const variant = product.variants.find((v) => (!product.colors.length || v.color === color) && (!product.sizes.length || v.size === size));
  const price = variant?.price ?? product.priceFrom;
  const sizeOk = (s: string) => product.variants.some((v) => v.size === s && (!product.colors.length || v.color === color));

  // the bar shows once the real button has scrolled above the screen
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBarOn(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pickColor = (name: string) => {
    setColor(name);
    const img = product.colors.find((c) => c.name === name)?.image;
    if (img) setImage(img);
    if (size && !product.variants.some((v) => v.color === name && v.size === size)) setSize(null);
  };

  const add = () => {
    if (needsSize || !variant) {
      setNudge(true);
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizesRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus({ preventScroll: true });
      return;
    }
    addVariant(product, variant, qty);
    setNudge(false);
  };

  const cta = needsSize ? "Select a size" : `Add to bag · ${money(price * qty, product.currency)}`;

  return (
    <div className="st-pdp__grid">
      <Gallery product={product} image={image} onPick={(src) => {
        setImage(src);
        const c = product.colors.find((x) => x.image === src);
        if (c) pickColor(c.name);
      }} />

      <div className="st-buy">
        <div className="st-buy__card">
          <Link to={`/merch?b=${brandParam(product.brand)}#shop`} className="st-buy__brand">{product.brand}</Link>
          <h1 className="st-buy__name">{product.name}</h1>
          <p className="st-buy__price">{variant ? money(price, product.currency) : priceLabel(product)}</p>
          {product.blank && <p className="st-buy__lede">Printed on the {product.blank}, made to order for you.</p>}

          {product.colors.length > 0 && (
            <fieldset className="st-opt">
              <legend>Color: <strong>{color}</strong></legend>
              <div className="st-swatches">
                {product.colors.map((c) => (
                  <button key={c.name} type="button" aria-pressed={c.name === color} onClick={() => pickColor(c.name)} aria-label={c.name} title={c.name}>
                    <img src={c.image} alt="" loading="lazy" width={800} height={800} />
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className={`st-opt ${nudge && needsSize ? "is-nudged" : ""}`}>
              <legend>Size: <strong>{size ?? "Select"}</strong></legend>
              <div ref={sizesRef} className="st-sizes">
                {product.sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={s === size} disabled={!sizeOk(s)} onClick={() => { setSize(s); setNudge(false); }}>{s}</button>
                ))}
              </div>
              {nudge && needsSize && <p className="st-opt__msg" role="alert">Choose a size to add this to your bag.</p>}
            </fieldset>
          )}

          <div className="st-buy__row">
            <div className="st-qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="One fewer"><Minus aria-hidden="true" /></button>
              <span aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10} aria-label="One more"><Plus aria-hidden="true" /></button>
            </div>
            <button ref={buyRef} type="button" className="st-btn st-btn--dark st-btn--grow" onClick={add}>{cta}</button>
          </div>

          <ul className="st-perks">
            <li><Truck aria-hidden="true" /><span><strong>Made to order</strong>Printed for you, then shipped. Shipping is calculated at checkout.</span></li>
            <li><Lock aria-hidden="true" /><span><strong>Secure checkout</strong>Pay with PayPal or card through PayPal.</span></li>
          </ul>
        </div>

        <div className="st-acc">
          <details open>
            <summary>Product details</summary>
            <ul>
              <li>{product.brand}, {categoryLabel(product.category).toLowerCase()}.</li>
              {product.blank && <li>Printed on the {product.blank}.</li>}
              {product.colors.length > 1 && <li>Available in {product.colors.length} colors: {product.colors.map((c) => c.name).join(", ")}.</li>}
              {product.sizes.length > 0 && <li>Sizes {product.sizes[0]} to {product.sizes[product.sizes.length - 1]}.</li>}
            </ul>
          </details>
          <details>
            <summary>Shipping</summary>
            <p>Every piece is made to order once you check out, then shipped to the address you enter. Shipping is calculated at checkout before you pay.</p>
          </details>
          <details>
            <summary>Questions</summary>
            <p>Need a size answer or help with an order? <ObfuscatedMailto user="music" domain="mrcap1.com" subject={`Store question: ${product.name}`}>Email the team</ObfuscatedMailto> and include your order number if you have one.</p>
          </details>
        </div>
      </div>

      <div className={`st-bar ${barOn ? "is-on" : ""} ${player ? "has-player" : ""}`} aria-hidden={!barOn}>
        <div className="st-wrap st-bar__row">
          <img src={image} alt="" width={800} height={800} />
          <div className="st-bar__info">
            <p>{product.name}</p>
            <span>{money(price, product.currency)}{variant?.label ? ` · ${variant.label}` : ""}</span>
          </div>
          <button type="button" className="st-btn st-btn--dark" onClick={add} tabIndex={barOn ? 0 : -1}>{needsSize ? "Select a size" : "Add to bag"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data: products = [], isLoading, isError, refetch } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const same = others.filter((p) => p.category === product.category || p.brand === product.brand);
    return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 8);
  }, [products, product]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const url = `https://mrcap1.com/merch/${slug}`;
  const ld = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.currency,
      lowPrice: product.priceFrom.toFixed(2),
      highPrice: product.priceTo.toFixed(2),
      offerCount: product.variants.length,
      url,
    },
  };

  return (
    <StoreShell>
      {product && (
        <Helmet>
          <title>{`${product.name} | Mr. CAP Official Store`}</title>
          <meta name="description" content={`${product.name} from ${product.brand}, ${priceLabel(product).toLowerCase()}. Made to order from the Mr. CAP Official Store.`} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={`${product.name} | Mr. CAP Official Store`} />
          <meta property="og:image" content={product.images[0]} />
          <meta property="og:url" content={url} />
          <script type="application/ld+json">{JSON.stringify(ld)}</script>
        </Helmet>
      )}

      <div className="st-wrap st-pdp">
        <nav className="st-crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/merch">Store</Link></li>
            {product && <li><Link to={`/merch?c=${product.category}#shop`}>{categoryLabel(product.category)}</Link></li>}
            <li aria-current="page">{product?.name ?? (isLoading ? "Loading" : "Not found")}</li>
          </ol>
        </nav>

        {isLoading && <div className="st-pdp__grid st-pdp__loading" aria-busy="true"><span /><span /></div>}
        {isError && (
          <div className="st-empty"><p>This product didn’t load.</p><button type="button" className="st-btn st-btn--dark" onClick={() => refetch()}>Try again</button></div>
        )}
        {!isLoading && !isError && !product && (
          <div className="st-empty"><p>That product isn’t in the store anymore.</p><Link to="/merch#shop" className="st-btn st-btn--dark">Shop the store</Link></div>
        )}
        {product && <BuyPanel key={product.id} product={product} />}
      </div>

      {product && related.length > 0 && (
        <section className="st-section" aria-labelledby="st-related-title">
          <div className="st-wrap">
            <div className="st-section__head"><h2 id="st-related-title">You may also like</h2></div>
            <ProductRail products={related} label="related products" />
          </div>
        </section>
      )}
    </StoreShell>
  );
}

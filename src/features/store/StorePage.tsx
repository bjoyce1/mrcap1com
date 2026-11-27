// /merch: the store home, after makobiusa.com. A lookbook hero, what's new, the departments as big
// image tiles, a marquee, the Trap University story, then the whole catalog with filters and sort.
import { useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";
import trapUniversityLogo from "@/assets/trap-university-logo.webp";
import leatherJacket from "@/assets/trap-university/leather-jacket.webp";
import whiteHoodie from "@/assets/trap-university/white-hoodie.webp";
import croppedHoodie from "@/assets/trap-university/cropped-hoodie.webp";
import backpack from "@/assets/trap-university/backpack.webp";
import { StoreShell } from "./StoreChrome";
import { ProductCard, ProductRail } from "./ProductCard";
import { BRANDS, CATEGORIES, brandParam, categoryLabel, useCatalog, type StoreProduct } from "./catalog";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "low", label: "Price, low to high" },
  { id: "high", label: "Price, high to low" },
];

/** departments shown as tiles, each pictured by one of its own products */
const TILES = [
  { id: "tees", label: "Tees", prefer: "oversized" },
  { id: "hoodies", label: "Hoodies & sweats", prefer: "crop hoodie" },
  { id: "headwear", label: "Headwear", prefer: "snapback" },
  { id: "footwear", label: "Footwear", prefer: "(black)" },
] as const;

function CardSkeletons({ n }: { n: number }) {
  return <>{Array.from({ length: n }, (_, i) => <li key={i} className="st-skel" aria-hidden="true"><span /><i /><i /></li>)}</>;
}

export default function StorePage() {
  const { data: products = [], isLoading, isError, refetch } = useCatalog();
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const cat = params.get("c") ?? "all";
  const brand = params.get("b") ?? "all";
  const sort = params.get("sort") ?? "featured";

  const newest = useMemo(() => [...products].sort((a, b) => b.id - a.id), [products]);
  const newIds = useMemo(() => new Set(newest.slice(0, 2).map((p) => p.id)), [newest]);
  const present = useMemo(() => CATEGORIES.filter((c) => products.some((p) => p.category === c.id)), [products]);
  const tiles = useMemo(() => TILES.map((t) => {
    const inCat = products.filter((p) => p.category === t.id);
    const pick = inCat.find((p) => p.name.toLowerCase().includes(t.prefer)) ?? inCat[0];
    return { ...t, img: pick?.images[0], count: inCat.length };
  }).filter((t) => t.img), [products]);

  const shown = useMemo(() => {
    let list: StoreProduct[] = products.filter((p) => (cat === "all" || p.category === cat) && (brand === "all" || brandParam(p.brand) === brand));
    if (sort === "new") list = [...list].sort((a, b) => b.id - a.id);
    if (sort === "low") list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "high") list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
    return list;
  }, [products, cat, brand, sort]);

  // a department link lands on its section: scroll once the products it points at have loaded
  useEffect(() => {
    if (!hash || isLoading) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash, isLoading, cat, brand]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const brandName = BRANDS.find((b) => brandParam(b) === brand);
  const heading = brandName ?? (cat === "all" ? "Shop all" : categoryLabel(cat));

  return (
    <StoreShell>
      <SEO entry={routeSeo("/merch")} />

      <section className="st-hero" aria-labelledby="st-hero-title">
        <div className="st-wrap st-hero__grid">
          <div className="st-hero__copy">
            <h1 id="st-hero-title"><span>Wear the ISM.</span><span>Rep the legacy.</span></h1>
            <p>Limited drops from the house of CAP. Home of Trap University, the South Park Coalition line and Mr. CAP x Sabet.</p>
            <div className="st-actions">
              <Link to="#shop" className="st-btn st-btn--dark">Shop the store <ArrowRight aria-hidden="true" /></Link>
              <Link to="#new" className="st-btn st-btn--line">New in</Link>
            </div>
          </div>
          <div className="st-hero__looks">
            <Link to="/merch?c=outerwear#shop" className="st-look st-look--tall" aria-label="Shop outerwear">
              <img src={leatherJacket} alt="Trap University bomber jacket, worn" width={1920} height={1920} {...{ fetchpriority: "high" }} />
              <span>Outerwear</span>
            </Link>
            <Link to="/merch?c=hoodies#shop" className="st-look" aria-label="Shop hoodies and sweats">
              <img src={whiteHoodie} alt="Trap University hoodie, worn" width={1920} height={1920} />
              <span>Hoodies</span>
            </Link>
            <Link to="/merch?c=hoodies#shop" className="st-look" aria-label="Shop the crop hoodie">
              <img src={croppedHoodie} alt="Trap University lady crop hoodie, worn" width={1000} height={1000} />
              <span>Crop hoodie</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="new" className="st-section" aria-labelledby="st-new-title">
        <div className="st-wrap">
          <div className="st-section__head">
            <h2 id="st-new-title">New in</h2>
            <Link to="/merch?sort=new#shop" className="st-link">View all <ArrowRight aria-hidden="true" /></Link>
          </div>
          {isLoading ? <ul className="st-grid"><CardSkeletons n={4} /></ul> : <ProductRail products={newest.slice(0, 8)} newIds={newIds} label="new products" />}
        </div>
      </section>

      <section className="st-section st-section--tight" aria-labelledby="st-dept-title">
        <div className="st-wrap">
          <h2 id="st-dept-title" className="sr-only">Shop by department</h2>
          <ul className="st-tiles">
            {tiles.map((t) => (
              <li key={t.id}>
                <Link to={`/merch?c=${t.id}#shop`} className="st-tile">
                  <span className="st-tile__media"><img src={t.img} alt="" loading="lazy" width={800} height={800} /></span>
                  <span className="st-tile__label">{t.label}</span>
                  <span className="st-tile__cta">{t.count} piece{t.count === 1 ? "" : "s"} · Shop now <ArrowRight aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="st-marquee" aria-hidden="true">
        <div>{Array.from({ length: 2 }, (_, k) => <span key={k}>Wear the ISM ✦ Rep the legacy ✦ Trap University ✦ South Park Coalition ✦ Made to order ✦ </span>)}</div>
      </div>

      <section className="st-story" aria-labelledby="st-story-title">
        <div className="st-wrap st-story__grid">
          <div className="st-story__img"><img src={backpack} alt="Trap University all-over print backpack" loading="lazy" width={1920} height={1920} /></div>
          <div className="st-story__copy">
            <img src={trapUniversityLogo} alt="" className="st-story__logo" width={1920} height={986} loading="lazy" />
            <h2 id="st-story-title">Trap University</h2>
            <p>Exclusive streetwear designed for the culture. Limited drops, unlimited drip.</p>
            <Link to="/merch?b=trap-university#shop" className="st-btn st-btn--dark">Shop Trap University <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section id="shop" className="st-section st-shop" aria-labelledby="st-shop-title">
        <div className="st-wrap">
          <div className="st-section__head">
            <h2 id="st-shop-title">{heading}</h2>
            {!isLoading && <p className="st-count">{shown.length} product{shown.length === 1 ? "" : "s"}</p>}
          </div>
          <div className="st-filters">
            <div className="st-chips" role="group" aria-label="Department">
              {[{ id: "all", label: "All" }, ...present].map((c) => (
                <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setParam("c", c.id)}>{c.label}</button>
              ))}
            </div>
            <div className="st-selects">
              <label>
                <span className="sr-only">Brand</span>
                <select value={brand} onChange={(e) => setParam("b", e.target.value)}>
                  <option value="all">All brands</option>
                  {BRANDS.map((b) => <option key={b} value={brandParam(b)}>{b}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort</span>
                <select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>
          {isError ? (
            <div className="st-empty">
              <p>The store didn’t load.</p>
              <button type="button" className="st-btn st-btn--dark" onClick={() => refetch()}>Try again</button>
            </div>
          ) : (
            <ul className="st-grid">
              {isLoading ? <CardSkeletons n={8} /> : shown.map((p) => <li key={p.id}><ProductCard product={p} isNew={newIds.has(p.id)} /></li>)}
            </ul>
          )}
          {!isLoading && !isError && !shown.length && (
            <div className="st-empty">
              <p>Nothing in {heading.toLowerCase()} right now.</p>
              <button type="button" className="st-btn st-btn--line" onClick={() => setParams(new URLSearchParams(), { replace: true })}>See everything</button>
            </div>
          )}
        </div>
      </section>
    </StoreShell>
  );
}

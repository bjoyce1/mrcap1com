// A product in a grid or a row: the garment on a warm studio card, brand, name, price, its colors.
// One-color pieces get quick-add sizes on hover, straight into the bag.
import { useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { addVariant, priceLabel, type StoreProduct } from "./catalog";

export function ProductCard({ product, isNew = false, eager = false }: { product: StoreProduct; isNew?: boolean; eager?: boolean }) {
  const second = product.colors[1]?.image ?? product.images[1];
  const quick = product.colors.length <= 1 && product.variants.length > 0;

  return (
    <article className="st-card">
      <Link to={`/merch/${product.slug}`} className="st-card__link">
        <span className={`st-card__media ${second ? "has-alt" : ""}`}>
          <img src={product.images[0]} alt={product.name} loading={eager ? "eager" : "lazy"} width={800} height={800} />
          {second && <img className="st-card__alt" src={second} alt="" loading="lazy" width={800} height={800} />}
          {isNew && <span className="st-badge">New</span>}
        </span>
        <span className="st-card__brand">{product.brand}</span>
        <span className="st-card__name">{product.name}</span>
        <span className="st-card__price">{priceLabel(product)}</span>
      </Link>
      {product.colors.length > 1 && (
        <span className="st-card__colors" aria-label={`${product.colors.length} colors`}>
          {product.colors.slice(0, 4).map((c) => <span key={c.name} title={c.name} style={{ "--sw": `url("${c.image}")` } as CSSProperties} />)}
          {product.colors.length > 4 && <small>+{product.colors.length - 4}</small>}
        </span>
      )}
      {quick && (
        <div className="st-card__quick" aria-label={`Quick add ${product.name}`}>
          {product.sizes.length ? (
            product.sizes.map((s) => {
              const v = product.variants.find((x) => x.size === s)!;
              return <button key={s} type="button" onClick={() => addVariant(product, v)} aria-label={`Add ${product.name}, size ${s}`}>{s}</button>;
            })
          ) : (
            <button type="button" className="st-card__quick-one" onClick={() => addVariant(product, product.variants[0])}>
              <Plus aria-hidden="true" /> Quick add
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/** A row of products that scrolls sideways, with arrows on desktop and a swipe on phones. */
export function ProductRail({ products, newIds, label }: { products: StoreProduct[]; newIds?: Set<number>; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const page = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div className="st-rail">
      <button type="button" className="st-rail__arrow is-prev" onClick={() => page(-1)} aria-label={`Previous ${label}`}><ChevronLeft aria-hidden="true" /></button>
      <ul ref={ref} aria-label={label}>
        {products.map((p, i) => <li key={p.id}><ProductCard product={p} isNew={newIds?.has(p.id)} eager={i < 4} /></li>)}
      </ul>
      <button type="button" className="st-rail__arrow is-next" onClick={() => page(1)} aria-label={`Next ${label}`}><ChevronRight aria-hidden="true" /></button>
    </div>
  );
}

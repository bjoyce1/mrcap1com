// The store catalog: Printful sync products turned into what a shopper picks from (brand, category,
// colors, sizes, one price per variant). Variant names arrive as "Product / Color / Size",
// "Product / Size" or "Product / Color"; colors can themselves hold slashes ("Red / Black / Black").
import { useQuery } from "@tanstack/react-query";
import { fetchPrintfulProducts, type PrintfulProduct } from "@/lib/printful";
import { useCartStore } from "@/stores/cartStore";

export interface StoreVariant {
  id: number;
  color: string | null;
  size: string | null;
  price: number;
  currency: string;
  image: string;
  label: string;
}

export interface StoreColor {
  name: string;
  image: string;
}

export interface StoreProduct {
  id: number;
  slug: string;
  name: string;
  brand: Brand;
  category: CategoryId;
  priceFrom: number;
  priceTo: number;
  currency: string;
  colors: StoreColor[];
  sizes: string[];
  variants: StoreVariant[];
  images: string[];
  /** the blank it is printed on, as Printful names it */
  blank: string;
}

export const BRANDS = ["Trap University", "South Park Coalition", "Mr. CAP x Sabet"] as const;
export type Brand = (typeof BRANDS)[number];

export const CATEGORIES = [
  { id: "jerseys", label: "Jerseys", match: ["jersey"] },
  { id: "tees", label: "Tees", match: ["t-shirt", "tee"] },
  { id: "tops", label: "Crop tops", match: ["crop top"] },
  { id: "hoodies", label: "Hoodies & sweats", match: ["hoodie", "sweatshirt"] },
  { id: "outerwear", label: "Outerwear", match: ["jacket", "bomber"] },
  { id: "headwear", label: "Headwear", match: ["cap", "hat", "snapback", "beanie"] },
  { id: "footwear", label: "Footwear", match: ["slides"] },
  { id: "bags", label: "Bags", match: ["backpack", "bag"] },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? "Shop all";

const SIZE_ORDER = ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const isSize = (s: string) => /^(\d?X{0,2}S|M|\d?X{0,2}L|\d{1,2}(\.5)?)$/i.test(s);
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s.toUpperCase());
  return i >= 0 ? i : 100 + parseFloat(s);
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const slugify = (s: string) =>
  clean(s).toLowerCase().replace(/[’']/g, "").replace(/\+/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function brandOf(name: string): Brand {
  const n = name.toLowerCase();
  if (n.includes("sabet")) return "Mr. CAP x Sabet";
  if (/\bspc\b/.test(n)) return "South Park Coalition";
  return "Trap University";
}

function categoryOf(name: string): CategoryId {
  const n = name.toLowerCase();
  // crop tops before tees and hoodies, so "Crop Hoodie" stays a hoodie and "Crop Top" a top
  if (n.includes("crop top")) return "tops";
  return (CATEGORIES.find((c) => c.match.some((m) => n.includes(m)))?.id ?? "tees") as CategoryId;
}

function toProduct(p: PrintfulProduct): StoreProduct {
  const rawName = p.sync_product.name;
  const variants: StoreVariant[] = (p.sync_variants ?? [])
    .filter((v) => !v.is_ignored)
    .map((v) => {
      const rest = v.name.startsWith(rawName) ? v.name.slice(rawName.length) : v.name;
      const parts = rest.split(" / ").map((s) => s.trim()).filter(Boolean);
      const size = parts.length && isSize(parts[parts.length - 1]) ? parts.pop()! : null;
      const color = parts.length ? parts.join(" / ") : null;
      const image =
        v.files?.find((f) => f.type === "preview")?.preview_url || v.product?.image || p.sync_product.thumbnail_url;
      return {
        id: v.id,
        color,
        size,
        price: parseFloat(v.retail_price) || 0,
        currency: v.currency || "USD",
        image,
        label: [color, size].filter(Boolean).join(" / "),
      };
    });

  const colors: StoreColor[] = [];
  for (const v of variants) if (v.color && !colors.some((c) => c.name === v.color)) colors.push({ name: v.color, image: v.image });
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean) as string[])].sort((a, b) => sizeRank(a) - sizeRank(b));
  const images = [...new Set([p.sync_product.thumbnail_url, ...variants.map((v) => v.image)].filter(Boolean))];
  const prices = variants.map((v) => v.price).filter((x) => x > 0);
  const blank = (p.sync_variants?.[0]?.product?.name ?? "").replace(/\s*\([^)]*\)\s*$/, "");

  return {
    id: p.sync_product.id,
    slug: slugify(rawName),
    name: clean(rawName),
    brand: brandOf(rawName),
    category: categoryOf(rawName),
    priceFrom: prices.length ? Math.min(...prices) : 0,
    priceTo: prices.length ? Math.max(...prices) : 0,
    currency: variants[0]?.currency ?? "USD",
    colors,
    sizes,
    variants,
    images,
    blank,
  };
}

/** Same-named products (three "Crop Top"s) keep their own address by carrying their id. */
function withUniqueSlugs(products: StoreProduct[]) {
  const counts = new Map<string, number>();
  products.forEach((p) => counts.set(p.slug, (counts.get(p.slug) ?? 0) + 1));
  return products.map((p) => ((counts.get(p.slug) ?? 0) > 1 ? { ...p, slug: `${p.slug}-${p.id}` } : p));
}

export function useCatalog() {
  return useQuery({
    queryKey: ["store-catalog"],
    queryFn: async () => withUniqueSlugs((await fetchPrintfulProducts()).filter((p) => !p.sync_product.is_ignored).map(toProduct)),
    staleTime: 5 * 60 * 1000,
  });
}

export const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

export const priceLabel = (p: StoreProduct) =>
  p.priceTo > p.priceFrom ? `From ${money(p.priceFrom, p.currency)}` : money(p.priceFrom, p.currency);

export const DEPARTMENTS = [
  { label: "Shop all", to: "/merch#shop" },
  { label: "New in", to: "/merch#new" },
  { label: "Tees", to: "/merch?c=tees#shop" },
  { label: "Hoodies & sweats", to: "/merch?c=hoodies#shop" },
  { label: "Headwear", to: "/merch?c=headwear#shop" },
  { label: "Footwear", to: "/merch?c=footwear#shop" },
  { label: "Trap University", to: "/merch?b=trap-university#shop" },
  { label: "SPC", to: "/merch?b=south-park-coalition#shop" },
];

export const brandParam = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Adds to the bag; adding opens the bag, which is the confirmation. */
export function addVariant(product: StoreProduct, variant: StoreVariant, quantity = 1) {
  useCartStore.getState().addItem({
    productId: product.id,
    variantId: variant.id,
    name: product.name,
    variantName: variant.label,
    price: variant.price,
    currency: variant.currency,
    image: variant.image,
  }, quantity);
}

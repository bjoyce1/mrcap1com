import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2, Package } from "lucide-react";

export const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts(50);
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const filters = [
    { id: "all", label: "Show All" },
    { id: "apparel", label: "Apparel" },
    { id: "accessories", label: "Accessories" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center py-24 border border-dashed border-border/50 rounded-xl bg-secondary/10">
            <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
            <h3 className="font-mono text-xl font-medium mb-3">No products found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently stocking up. Check back soon for exclusive Mr. CAP merchandise, or tell us what products you'd like to see!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-mono text-sm transition-all duration-300 border ${
                activeFilter === filter.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-secondary/30 text-foreground border-border/50 hover:border-border hover:bg-secondary/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.node.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

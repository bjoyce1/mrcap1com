import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchPrintfulProducts, PrintfulProduct } from "@/lib/printful";
import { PrintfulProductCard } from "./PrintfulProductCard";
import { PrintfulProductModal } from "./PrintfulProductModal";
import { MerchCategoryTabs } from "./MerchCategoryTabs";

export const PrintfulProductGrid = () => {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PrintfulProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProducts = await fetchPrintfulProducts();
        setProducts(fetchedProducts);
        if (fetchedProducts.length === 0) {
          setError("No products found in your Printful store.");
        }
      } catch (err) {
        console.error("Error loading Printful products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Category keyword map for filtering Printful products by name
  const categoryKeywords: Record<string, string[]> = {
    tshirts: ["t-shirt", "tee", "tshirt"],
    hoodies: ["hoodie", "sweatshirt", "pullover", "crop hoodie"],
    caps: ["cap", "hat", "beanie", "bucket hat"],
    bags: ["bag", "tote", "backpack"],
    drinkware: ["mug", "cup", "tumbler", "bottle", "drinkware"],
  };

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => {
        const name = p.sync_product.name.toLowerCase();
        const keywords = categoryKeywords[activeCategory] || [];
        return keywords.some((kw) => name.includes(kw));
      });

  const handleProductSelect = (product: PrintfulProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">{error}</p>
            <p className="text-sm text-muted-foreground/70">
              Make sure you have products synced in your Printful store.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <MerchCategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <section className="py-16 px-6 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Community favorites and new arrivals.
            </p>
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.sync_product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <PrintfulProductCard
                    product={product}
                    onSelect={handleProductSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <PrintfulProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
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
          setError('No products found in your Printful store.');
        }
      } catch (err) {
        console.error('Error loading Printful products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

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
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
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
      {/* Category Tabs */}
      <MerchCategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <section className="py-16 px-6 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Community favorites and new arrivals.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.sync_product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <PrintfulProductCard product={product} onSelect={handleProductSelect} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Modal */}
      <PrintfulProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};
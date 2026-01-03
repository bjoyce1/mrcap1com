import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import { fetchPrintfulProducts, PrintfulProduct } from "@/lib/printful";
import { PrintfulProductCard } from "./PrintfulProductCard";
import { PrintfulProductModal } from "./PrintfulProductModal";
export const PrintfulProductGrid = () => {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PrintfulProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    return <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading Printful products...</p>
          </div>
        </div>
      </section>;
  }
  if (error) {
    return <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">{error}</p>
            <p className="text-sm text-muted-foreground/70">
              Make sure you have products synced in your Printful store.
            </p>
          </div>
        </div>
      </section>;
  }
  return <>
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Printful Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">TRAP UNIVERSITY</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              High-quality custom merchandise printed and shipped on demand.
            </p>
          </motion.div>

          {/* Products Grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map(product => <motion.div key={product.sync_product.id} variants={{
            hidden: {
              opacity: 0,
              y: 20
            },
            visible: {
              opacity: 1,
              y: 0
            }
          }}>
                <PrintfulProductCard product={product} onSelect={handleProductSelect} />
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Product Modal */}
      <PrintfulProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>;
};
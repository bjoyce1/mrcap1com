import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { PrintfulProduct, getProductImage, getLowestPrice } from "@/lib/printful";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface PrintfulProductCardProps {
  product: PrintfulProduct;
  onSelect: (product: PrintfulProduct) => void;
}

export const PrintfulProductCard = ({ product, onSelect }: PrintfulProductCardProps) => {
  const { addItem } = useCartStore();
  const imageUrl = getProductImage(product);
  const price = getLowestPrice(product);
  const variantCount = product.sync_variants?.length || 0;
  const firstVariant = product.sync_variants?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (variantCount > 1) {
      // Open modal for variant selection
      onSelect(product);
      return;
    }

    if (firstVariant) {
      addItem({
        productId: product.sync_product.id,
        variantId: firstVariant.id,
        name: product.sync_product.name,
        variantName: firstVariant.name,
        price: parseFloat(firstVariant.retail_price),
        currency: firstVariant.currency || 'USD',
        image: imageUrl,
      });
      toast.success("Added to cart", {
        description: product.sync_product.name,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      className="group bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-[#111111] relative">
        <img
          src={imageUrl}
          alt={product.sync_product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Variant count badge */}
        {variantCount > 1 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium">
            {variantCount} options
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {variantCount > 1 ? 'Select Options' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-sm sm:text-base text-foreground mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {product.sync_product.name}
        </h3>
        
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {price.currency === 'USD' ? '$' : price.currency}{price.amount}
        </p>
      </div>
    </motion.div>
  );
};

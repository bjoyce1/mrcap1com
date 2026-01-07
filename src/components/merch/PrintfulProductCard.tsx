import { motion } from "framer-motion";
import { PrintfulProduct, getProductImage, getLowestPrice } from "@/lib/printful";

interface PrintfulProductCardProps {
  product: PrintfulProduct;
  onSelect: (product: PrintfulProduct) => void;
}

export const PrintfulProductCard = ({ product, onSelect }: PrintfulProductCardProps) => {
  const imageUrl = getProductImage(product);
  const price = getLowestPrice(product);
  const variantCount = product.sync_variants?.length || 0;

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

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add to Cart
          </span>
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

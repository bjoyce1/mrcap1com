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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-muted/20 relative">
        <img
          src={imageUrl}
          alt={product.sync_product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Variant count badge */}
        {variantCount > 1 && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-background/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
            {variantCount} options
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.sync_product.name}
        </h3>
        
        <p className="text-base sm:text-lg md:text-xl font-bold text-primary">
          {price.currency === 'USD' ? '$' : price.currency} {price.amount}
          {variantCount > 1 && <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">+</span>}
        </p>
      </div>
    </motion.div>
  );
};

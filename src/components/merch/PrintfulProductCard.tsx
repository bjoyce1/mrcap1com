import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PrintfulProduct, getProductImage, getLowestPrice } from "@/lib/printful";
import { Button } from "@/components/ui/button";

interface PrintfulProductCardProps {
  product: PrintfulProduct;
}

export const PrintfulProductCard = ({ product }: PrintfulProductCardProps) => {
  const imageUrl = getProductImage(product);
  const price = getLowestPrice(product);
  const variantCount = product.sync_variants?.length || 0;

  // For Printful, we'll link to their checkout or a product detail page
  const handleViewProduct = () => {
    // You could implement a product detail modal or page here
    console.log('View product:', product.sync_product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
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
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {variantCount} options
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.sync_product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            {price.currency === 'USD' ? '$' : price.currency} {price.amount}
            {variantCount > 1 && <span className="text-sm font-normal text-muted-foreground ml-1">+</span>}
          </p>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewProduct}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

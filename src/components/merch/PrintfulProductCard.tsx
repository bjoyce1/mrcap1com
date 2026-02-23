import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
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
        currency: firstVariant.currency || "USD",
        image: imageUrl,
      });
      toast.success("Added to cart", {
        description: product.sync_product.name,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      className="group relative flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#1a1a1a] rounded-2xl overflow-hidden mb-6 shadow-xl border border-white/5 group-hover:border-red-500/30 transition-colors duration-500">
        {/* Variant badge */}
        {variantCount > 1 && (
          <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full tracking-widest">
            {variantCount} options
          </div>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={product.sync_product.name}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex flex-col items-center justify-end p-6 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] flex justify-center items-center gap-2 transform transition-all duration-300 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
          >
            <ShoppingBag className="w-4 h-4" />
            {variantCount > 1 ? "Select Options" : "Quick Add"}
          </button>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white uppercase tracking-widest cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-red-400 transition-colors text-foreground">
            {product.sync_product.name}
          </h3>
          <span className="text-lg font-mono font-medium text-neutral-300 whitespace-nowrap">
            {price.currency === "USD" ? "$" : price.currency}
            {price.amount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

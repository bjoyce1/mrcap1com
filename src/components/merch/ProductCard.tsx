import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  
  const firstImage = node.images?.edges?.[0]?.node;
  const firstVariant = node.variants?.edges?.[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center"
    });
  };

  return (
    <Link 
      to={`/merch/${node.handle}`}
      className="group block"
    >
      <div className="relative aspect-square bg-secondary/30 rounded-lg overflow-hidden border border-border/30 transition-all duration-300 hover:border-border/60 hover:bg-secondary/50">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-muted-foreground text-sm">No image</span>
          </div>
        )}
        
        {/* Quick add button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 rounded-full bg-foreground text-background hover:bg-foreground/90"
          onClick={handleAddToCart}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-3 space-y-1">
        <h3 className="font-mono text-sm font-medium truncate group-hover:text-primary transition-colors">
          {node.title}
        </h3>
        <p className="font-mono text-sm text-muted-foreground">
          ${parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

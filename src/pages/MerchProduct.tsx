import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CartDrawer } from "@/components/merch/CartDrawer";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, ShopifyProduct, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Minus, Plus, ShoppingCart } from "lucide-react";

const MerchProduct = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setIsLoading(true);
      const data = await fetchProductByHandle(handle);
      setProduct(data);
      if (data?.node.variants?.edges?.[0]) {
        setSelectedVariant(data.node.variants.edges[0].node.id);
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.node.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    const cartItem: CartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.node.title} x ${quantity}`,
      position: "top-center"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono font-bold mb-4">Product not found</h1>
          <Link to="/merch">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Merch
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { node } = product;
  const images = node.images?.edges || [];
  const variants = node.variants?.edges || [];
  const currentVariant = variants.find(v => v.node.id === selectedVariant)?.node;
  const price = currentVariant?.price || node.priceRange.minVariantPrice;

  return (
    <>
      <Helmet>
        <title>{node.title} | Mr. CAP Merch</title>
        <meta name="description" content={node.description || `Shop ${node.title} from Mr. CAP's official merch store.`} />
        <meta property="og:title" content={`${node.title} | Mr. CAP Merch`} />
        <meta property="og:description" content={node.description || `Shop ${node.title} from Mr. CAP's official merch store.`} />
        {images[0]?.node.url && <meta property="og:image" content={images[0].node.url} />}
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <div className="fixed top-24 right-6 z-50">
          <CartDrawer />
        </div>

        <main className="pt-24 pb-20">
          <div className="container">
            {/* Back button */}
            <Link to="/merch" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Merch
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="aspect-square bg-secondary/30 rounded-xl overflow-hidden border border-border/30 mb-4">
                  {images[selectedImage]?.node.url ? (
                    <img
                      src={images[selectedImage].node.url}
                      alt={images[selectedImage].node.altText || node.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? "border-primary" : "border-border/30 hover:border-border"
                        }`}
                      >
                        <img
                          src={img.node.url}
                          alt={img.node.altText || `${node.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:py-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{node.title}</h1>
                
                <p className="text-2xl font-mono font-bold mb-6">
                  ${parseFloat(price.amount).toFixed(2)}
                </p>

                {node.description && (
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {node.description}
                  </p>
                )}

                {/* Variant options */}
                {node.options?.map((option) => (
                  option.values.length > 1 && (
                    <div key={option.name} className="mb-6">
                      <label className="block font-mono text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => {
                          const optionValue = variant.node.selectedOptions.find(o => o.name === option.name)?.value;
                          if (!optionValue) return null;
                          
                          return (
                            <button
                              key={variant.node.id}
                              onClick={() => setSelectedVariant(variant.node.id)}
                              disabled={!variant.node.availableForSale}
                              className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${
                                selectedVariant === variant.node.id
                                  ? "bg-foreground text-background border-foreground"
                                  : variant.node.availableForSale
                                    ? "border-border/50 hover:border-border"
                                    : "border-border/30 text-muted-foreground/50 cursor-not-allowed"
                              }`}
                            >
                              {optionValue}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                ))}

                {/* Quantity */}
                <div className="mb-8">
                  <label className="block font-mono text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-mono text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to cart */}
                <Button
                  size="lg"
                  className="w-full font-mono uppercase tracking-wider"
                  onClick={handleAddToCart}
                  disabled={!currentVariant?.availableForSale}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {currentVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
                </Button>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MerchProduct;

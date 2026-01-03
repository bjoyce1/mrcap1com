import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Truck, Loader2 } from "lucide-react";
import { z } from "zod";
import { PrintfulProduct, getProductImage, getLowestPrice } from "@/lib/printful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PrintfulProductModalProps {
  product: PrintfulProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const shippingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  address1: z.string().trim().min(1, "Address is required").max(200),
  address2: z.string().max(200).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state_code: z.string().max(10).optional(),
  country_code: z.string().length(2, "Country code must be 2 characters"),
  zip: z.string().trim().min(1, "ZIP code is required").max(20),
  phone: z.string().max(20).optional(),
});

export const PrintfulProductModal = ({ product, isOpen, onClose }: PrintfulProductModalProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'select' | 'shipping' | 'confirm'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state_code: '',
    country_code: 'US',
    zip: '',
    phone: '',
  });

  if (!product) return null;

  const variants = product.sync_variants || [];
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  const images = variants.length > 0 
    ? variants.map(v => v.files?.find(f => f.type === 'preview')?.preview_url || v.product?.image).filter(Boolean)
    : [getProductImage(product)];

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleContinueToShipping = () => {
    if (!selectedVariantId && variants.length > 1) {
      toast.error("Please select a variant");
      return;
    }
    // Auto-select first variant if only one exists or none selected
    if (!selectedVariantId && variants.length >= 1) {
      setSelectedVariantId(variants[0].id);
    }
    setStep('shipping');
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    const result = shippingSchema.safeParse(shippingInfo);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('printful-checkout', {
        body: {
          items: [{
            sync_variant_id: selectedVariant?.id,
            quantity,
          }],
          shipping: result.data,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        toast.success("Order placed successfully!", {
          description: `Order #${data.order?.id} has been created.`,
        });
        setStep('confirm');
      } else {
        throw new Error(data?.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error("Failed to place order", {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setQuantity(1);
    setSelectedVariantId(null);
    setShippingInfo({
      name: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state_code: '',
      country_code: 'US',
      zip: '',
      phone: '',
    });
    onClose();
  };

  const price = selectedVariant 
    ? parseFloat(selectedVariant.retail_price) 
    : parseFloat(getLowestPrice(product).amount);
  const currency = selectedVariant?.currency || 'USD';
  const totalPrice = (price * quantity).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-6 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[calc(100%-3rem)] md:max-w-4xl md:max-h-[85vh] bg-background rounded-2xl overflow-hidden z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">
                {step === 'select' && 'Select Options'}
                {step === 'shipping' && 'Shipping Information'}
                {step === 'confirm' && 'Order Confirmed'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {step === 'select' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted/20">
                      <img
                        src={images[selectedImage] || getProductImage(product)}
                        alt={product.sync_product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              selectedImage === idx ? 'border-primary' : 'border-transparent'
                            }`}
                          >
                            <img src={img as string} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{product.sync_product.name}</h3>
                      <p className="text-3xl font-bold text-primary">
                        {currency === 'USD' ? '$' : currency}{totalPrice}
                      </p>
                    </div>

                    {/* Variant Selection */}
                    {variants.length > 1 && (
                      <div className="space-y-2">
                        <Label>Select Option</Label>
                        <Select
                          value={selectedVariantId?.toString() || variants[0]?.id.toString()}
                          onValueChange={(val) => setSelectedVariantId(parseInt(val))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {variants.map((variant) => (
                              <SelectItem key={variant.id} value={variant.id.toString()}>
                                {variant.name} - ${parseFloat(variant.retail_price).toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleContinueToShipping}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Continue to Checkout
                    </Button>
                  </div>
                </div>
              )}

              {step === 'shipping' && (
                <div className="max-w-md mx-auto flex flex-col h-full">
                  <div className="bg-muted/20 rounded-lg p-4 mb-4 flex-shrink-0">
                    <div className="flex gap-4">
                      <img
                        src={getProductImage(product)}
                        alt={product.sync_product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.sync_product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedVariant?.name} × {quantity}
                        </p>
                        <p className="font-semibold text-primary">${totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pb-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => handleShippingChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={shippingInfo.address1}
                        onChange={(e) => handleShippingChange('address1', e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={shippingInfo.address2}
                        onChange={(e) => handleShippingChange('address2', e.target.value)}
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        placeholder="Houston"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state_code">State</Label>
                      <Input
                        id="state_code"
                        value={shippingInfo.state_code}
                        onChange={(e) => handleShippingChange('state_code', e.target.value)}
                        placeholder="TX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={shippingInfo.zip}
                        onChange={(e) => handleShippingChange('zip', e.target.value)}
                        placeholder="77001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country_code">Country *</Label>
                      <Select
                        value={shippingInfo.country_code}
                        onValueChange={(val) => handleShippingChange('country_code', val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border flex-shrink-0">
                    <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your order has been submitted successfully. You'll receive a confirmation email shortly.
                  </p>
                  <Button onClick={handleClose}>
                    Continue Shopping
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

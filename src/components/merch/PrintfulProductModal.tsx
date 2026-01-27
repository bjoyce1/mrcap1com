import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Truck, Loader2, ChevronLeft, CreditCard } from "lucide-react";
import { z } from "zod";
import { PrintfulProduct, getProductImage, getLowestPrice } from "@/lib/printful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";

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

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PrintfulProductModal = ({ product, isOpen, onClose }: PrintfulProductModalProps) => {
  const { addItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'select' | 'shipping' | 'payment' | 'confirm'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonsRef = useRef<HTMLDivElement>(null);
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

  // Derive variants and selectedVariant early for use in effects
  const variants = product?.sync_variants || [];
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  // Fetch PayPal client ID on mount
  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('paypal-checkout?action=client-id');
        if (!error && data?.clientId) {
          setPaypalClientId(data.clientId);
        }
      } catch (err) {
        console.error('Failed to fetch PayPal client ID:', err);
      }
    };
    fetchPayPalClientId();
  }, []);

  // Load PayPal SDK when entering payment step
  useEffect(() => {
    if (step !== 'payment' || !paypalClientId || paypalLoaded) return;

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      if (window.paypal) {
        setPaypalLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => toast.error('Failed to load PayPal');
    document.body.appendChild(script);
  }, [step, paypalClientId, paypalLoaded]);

  // Render PayPal buttons when SDK is loaded
  useEffect(() => {
    if (step !== 'payment' || !paypalLoaded || !window.paypal || !paypalButtonsRef.current || !product) return;

    // Clear any existing buttons
    paypalButtonsRef.current.innerHTML = '';

    const price = selectedVariant 
      ? parseFloat(selectedVariant.retail_price) 
      : parseFloat(getLowestPrice(product).amount);
    const totalAmount = (price * quantity).toFixed(2);

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      },
      createOrder: async () => {
        try {
          const { data, error } = await supabase.functions.invoke('paypal-checkout?action=create', {
            body: {
              amount: totalAmount,
              currency: 'USD',
              description: `${product?.sync_product.name} x ${quantity}`,
            },
          });

          if (error || !data?.orderId) {
            throw new Error(error?.message || 'Failed to create PayPal order');
          }

          return data.orderId;
        } catch (err) {
          console.error('PayPal createOrder error:', err);
          toast.error('Failed to initialize payment');
          throw err;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        setIsLoading(true);
        try {
          // Capture the PayPal payment
          const { data: captureData, error: captureError } = await supabase.functions.invoke('paypal-checkout?action=capture', {
            body: { orderId: data.orderID },
          });

          if (captureError || captureData?.status !== 'COMPLETED') {
            throw new Error('Payment capture failed');
          }

          // Now create the Printful order
          const validatedShipping = shippingSchema.parse(shippingInfo);
          const { data: orderData, error: orderError } = await supabase.functions.invoke('printful-checkout', {
            body: {
              items: [{
                sync_variant_id: selectedVariant?.id,
                quantity,
              }],
              shipping: validatedShipping,
            },
          });

          if (orderError || !orderData?.success) {
            throw new Error(orderError?.message || orderData?.error || 'Failed to create order');
          }

          toast.success("Order placed successfully!", {
            description: `Order #${orderData.order?.id} has been created.`,
          });
          setStep('confirm');
        } catch (err) {
          console.error('Payment/Order error:', err);
          toast.error("Failed to complete order", {
            description: err instanceof Error ? err.message : 'Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast.error('Payment failed. Please try again.');
      },
      onCancel: () => {
        toast.info('Payment cancelled');
      },
    }).render(paypalButtonsRef.current);
  }, [step, paypalLoaded, product, quantity, selectedVariant, shippingInfo]);

  if (!product) return null;

  const images = variants.length > 0 
    ? variants.map(v => v.files?.find(f => f.type === 'preview')?.preview_url || v.product?.image).filter(Boolean)
    : [getProductImage(product)];

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!selectedVariantId && variants.length > 1) {
      toast.error("Please select a variant");
      return;
    }
    const variantToAdd = selectedVariant || variants[0];
    if (variantToAdd && product) {
      addItem({
        productId: product.sync_product.id,
        variantId: variantToAdd.id,
        name: product.sync_product.name,
        variantName: variantToAdd.name,
        price: parseFloat(variantToAdd.retail_price),
        currency: variantToAdd.currency || 'USD',
        image: getProductImage(product),
      }, quantity);
      toast.success("Added to cart", {
        description: `${product.sync_product.name} x${quantity}`,
      });
      handleClose();
    }
  };

  const handleContinueToShipping = () => {
    if (!selectedVariantId && variants.length > 1) {
      toast.error("Please select a variant");
      return;
    }
    if (!selectedVariantId && variants.length >= 1) {
      setSelectedVariantId(variants[0].id);
    }
    setStep('shipping');
  };

  const handleContinueToPayment = () => {
    const result = shippingSchema.safeParse(shippingInfo);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }
    setStep('payment');
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
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

  const handleBack = () => {
    if (step === 'shipping') setStep('select');
    else if (step === 'payment') setStep('shipping');
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

          {/* Right-side panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[520px] lg:w-[600px] bg-background z-50 flex flex-col shadow-2xl border-l border-border/50"
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                {(step === 'shipping' || step === 'payment') && (
                  <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                )}
                <h2 className="text-lg font-mono uppercase tracking-wider">
                  {step === 'select' && 'Select Options'}
                  {step === 'shipping' && 'Shipping'}
                  {step === 'payment' && 'Payment'}
                  {step === 'confirm' && 'Confirmed'}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {step === 'select' && (
                <div className="p-4 sm:p-6 space-y-6">
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
                  </div>
                </div>
              )}

              {step === 'shipping' && (
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Order Summary */}
                  <div className="bg-muted/20 rounded-lg p-4">
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

                  {/* Shipping Form */}
                  <div className="grid grid-cols-2 gap-4">
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
                </div>
              )}

              {step === 'payment' && (
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Order Summary */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={getProductImage(product)}
                        alt={product.sync_product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product.sync_product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedVariant?.name} × {quantity}
                        </p>
                        <p className="font-semibold text-primary">${totalPrice}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Ship to: {shippingInfo.name}, {shippingInfo.address1}, {shippingInfo.city}, {shippingInfo.state_code} {shippingInfo.zip}
                      </p>
                    </div>
                  </div>

                  {/* PayPal Buttons */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Select Payment Method
                    </h3>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-muted-foreground">Processing payment...</span>
                      </div>
                    ) : !paypalLoaded ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <span className="ml-3 text-muted-foreground">Loading payment options...</span>
                      </div>
                    ) : (
                      <div ref={paypalButtonsRef} className="min-h-[150px]" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Your payment is securely processed by PayPal. You can pay with your PayPal account or credit/debit card.
                  </p>
                </div>
              )}

              {step === 'confirm' && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your payment was successful and your order has been submitted. You'll receive a confirmation email shortly.
                    </p>
                    <Button onClick={handleClose}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            {step !== 'confirm' && step !== 'payment' && (
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-border/50 bg-background space-y-3">
                {step === 'select' && (
                  <>
                    <Button 
                      size="lg" 
                      className="w-full font-mono uppercase tracking-wider"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Add to Cart - ${totalPrice}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full font-mono uppercase tracking-wider"
                      onClick={handleContinueToShipping}
                    >
                      Buy Now
                    </Button>
                  </>
                )}
                {step === 'shipping' && (
                  <Button 
                    size="lg"
                    className="w-full font-mono uppercase tracking-wider"
                    onClick={handleContinueToPayment} 
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Continue to Payment - ${totalPrice}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

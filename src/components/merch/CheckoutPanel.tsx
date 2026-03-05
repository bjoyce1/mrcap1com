import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Truck, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface CheckoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
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

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
];

export const CheckoutPanel = ({ isOpen, onClose, onBack }: CheckoutPanelProps) => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonsRef = useRef<HTMLDivElement>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
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

  const subtotal = getSubtotal();

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
    if (step !== 'payment' || !paypalLoaded || !window.paypal || !paypalButtonsRef.current || items.length === 0) return;

    // Clear any existing buttons
    paypalButtonsRef.current.innerHTML = '';

    const totalAmount = subtotal.toFixed(2);
    const itemDescriptions = items.map(i => `${i.name} x${i.quantity}`).join(', ');

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
              description: itemDescriptions.substring(0, 127),
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
              items: items.map(item => ({
                sync_variant_id: item.variantId,
                quantity: item.quantity,
              })),
              shipping: validatedShipping,
            },
          });

          if (orderError || !orderData?.success) {
            throw new Error(orderError?.message || orderData?.error || 'Failed to create order');
          }

          setOrderId(orderData.order?.id);
          toast.success("Order placed successfully!");
          clearCart();
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
  }, [step, paypalLoaded, items, subtotal, shippingInfo, clearCart]);

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

  const handleBack = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else {
      onBack();
    }
  };

  const handleClose = () => {
    setStep('shipping');
    onClose();
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 shadow-[0_4px_12px_hsl(0_0%_0%/0.2)]">
        <div className="flex items-center gap-3">
          {step !== 'confirm' && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-lg font-mono uppercase tracking-wider">
            {step === 'shipping' && 'Shipping'}
            {step === 'payment' && 'Payment'}
            {step === 'confirm' && 'Order Confirmed'}
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {step === 'shipping' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/20 rounded-xl p-4 space-y-3">
              <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Order Summary</h3>
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variantName} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-3 flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Shipping Address</span>
              </div>
              
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
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={shippingInfo.country_code}
                    onValueChange={(val) => handleShippingChange('country_code', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/20 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated by carrier</span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Summary */}
            <div className="bg-muted/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Shipping to:</p>
              <p className="text-sm font-medium">
                {shippingInfo.name}<br />
                {shippingInfo.address1}{shippingInfo.address2 && `, ${shippingInfo.address2}`}<br />
                {shippingInfo.city}, {shippingInfo.state_code} {shippingInfo.zip}<br />
                {countries.find(c => c.code === shippingInfo.country_code)?.name}
              </p>
            </div>

            {/* PayPal Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Payment Method</span>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div ref={paypalButtonsRef} className="min-h-[150px]">
                  {!paypalLoaded && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading payment options...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Your order has been placed successfully.
              </p>
              {orderId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              You'll receive an email confirmation with tracking information once your order ships.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {step === 'shipping' && (
        <div className="flex-shrink-0 p-4 sm:p-6 bg-background shadow-[0_-4px_24px_hsl(0_0%_0%/0.3)]">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleContinueToPayment}
          >
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="max-h-[95vh]">
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

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

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col shadow-[0_0_40px_hsl(0_0%_0%/0.5)]"
          >
            <Content />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

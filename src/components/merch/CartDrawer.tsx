import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CheckoutPanel } from "./CheckoutPanel";

export const CartDrawer = () => {
  const { items, isOpen, openCart, closeCart, removeItem, updateQuantity, getItemCount, getSubtotal } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const isMobile = useIsMobile();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  const handleCloseAll = () => {
    setShowCheckout(false);
    closeCart();
  };

  const CartContent = () => (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Add some items to get started</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.variantId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 bg-muted/20 rounded-xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.variantName}</p>
                  <p className="font-semibold text-primary mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.variantId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="flex-shrink-0 p-4 sm:p-6 space-y-4 bg-background shadow-[0_-4px_24px_hsl(0_0%_0%/0.3)]">
          <div className="flex items-center justify-between text-lg">
            <span className="font-medium">Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleCheckout}
          >
            Checkout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );

  // Show checkout panel instead of cart
  if (showCheckout && isOpen) {
    return (
      <>
        {TriggerButton}
        <CheckoutPanel 
          isOpen={showCheckout} 
          onClose={handleCloseAll}
          onBack={handleBackToCart}
        />
      </>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="shadow-[0_4px_12px_hsl(0_0%_0%/0.2)]">
            <DrawerTitle className="font-mono uppercase tracking-wider">
              Shopping Cart ({itemCount})
            </DrawerTitle>
          </DrawerHeader>
          <CartContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        {TriggerButton}
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="flex-shrink-0 p-4 sm:p-6 shadow-[0_4px_12px_hsl(0_0%_0%/0.2)]">
          <SheetTitle className="font-mono uppercase tracking-wider">
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
};

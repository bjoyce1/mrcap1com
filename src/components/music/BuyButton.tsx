import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { usePurchasesStore } from "@/stores/purchasesStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/components/GoogleAnalytics";

interface BuyButtonProps {
  itemType: "track" | "album";
  itemId: string;
  title: string;
  priceCents: number;
  albumId?: string | null;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  fullWidth?: boolean;
}

// PayPal SDK requires a client ID at script load. Using sandbox 'test' is safe — the
// real client id is enforced server-side when creating the order. Visitors still see
// PayPal's UI; only confirmed payments via our edge function will be honored.
const PAYPAL_CLIENT_ID = "sb"; // sandbox shim; real ID lives server-side

const BuyButton = ({
  itemType,
  itemId,
  title,
  priceCents,
  albumId,
  variant = "default",
  size = "sm",
  className,
  fullWidth,
}: BuyButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ownsTrack, ownsAlbum, markOwned } = usePurchasesStore();
  const [open, setOpen] = useState(false);

  const owned = itemType === "track"
    ? ownsTrack(itemId, albumId)
    : ownsAlbum(itemId);

  const price = (priceCents / 100).toFixed(2);

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Sign in to buy",
        description: "Create a free account to purchase and download.",
      });
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpen(true);
  };

  if (owned) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={() => navigate("/library")}
      >
        <Download className="w-4 h-4 mr-2" />
        Owned — Library
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Buy {itemType === "album" ? "Album" : ""} ${price}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Buy "{title}"</DialogTitle>
            <DialogDescription>
              ${price} USD — instant download after payment.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <PayPalScriptProvider
              options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}
            >
              <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                createOrder={async () => {
                  const { data, error } = await supabase.functions.invoke(
                    "paypal-create-order",
                    { body: { item_type: itemType, item_id: itemId } },
                  );
                  if (error || !data?.orderID) {
                    toast({
                      title: "Could not start checkout",
                      description: error?.message || "Please try again.",
                      variant: "destructive",
                    });
                    throw new Error("create-order failed");
                  }
                  return data.orderID as string;
                }}
                onApprove={async (data) => {
                  const { data: cap, error } = await supabase.functions.invoke(
                    "paypal-capture-order",
                    { body: { orderID: data.orderID } },
                  );
                  if (error || !cap?.ok) {
                    toast({
                      title: "Payment failed",
                      description: error?.message || "Please try again.",
                      variant: "destructive",
                    });
                    return;
                  }
                  markOwned(itemType, itemId);
                  trackEvent("purchase", {
                    item_type: itemType,
                    item_id: itemId,
                    value: priceCents / 100,
                    currency: "USD",
                  });
                  toast({
                    title: "Purchase complete!",
                    description: "Your download is ready in your library.",
                  });
                  setOpen(false);
                  navigate("/library");
                }}
                onError={(err) => {
                  console.error(err);
                  toast({
                    title: "Checkout error",
                    description: "Please try again.",
                    variant: "destructive",
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuyButton;

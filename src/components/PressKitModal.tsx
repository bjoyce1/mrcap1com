import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpRight } from "lucide-react";
import { openPressKitPDF } from "@/content/pressKit";
import PressKitContents from "@/components/press/PressKitContents";

interface PressKitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PressKitModal = ({ open, onOpenChange }: PressKitModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-[hsl(var(--foreground)/0.1)] p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-[hsl(var(--foreground)/0.08)] px-6 pt-6 pb-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[hsl(var(--accent-gold))]">
              Official Press Kit · File No. 001
            </div>
            <DialogTitle className="font-display text-3xl md:text-4xl leading-[0.95] tracking-tight">
              Mr. CAP <span className="text-[hsl(var(--accent-gold))]">Press Kit</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-xl">
              Preview what's included, then download the full kit or grab individual assets below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="flux" className="rounded-none gap-2" onClick={openPressKitPDF}>
              <Download className="w-4 h-4" />
              Download Press Kit (PDF)
            </Button>
            <Button variant="fluxOutline" className="rounded-none gap-2" asChild>
              <Link to="/press#press-kit" onClick={() => onOpenChange(false)}>
                Full Press Kit Page <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-6 py-6">
          <PressKitContents onNavigate={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PressKitModal;

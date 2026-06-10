import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "candy-sheen text-foreground hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[hsl(var(--accent-gold)/0.4)] bg-transparent text-foreground hover:border-[hsl(var(--accent-gold)/0.8)] hover:bg-[hsl(var(--accent-gold)/0.05)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-[hsl(var(--accent-gold)/0.06)] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants used across the project
        hero: "candy-sheen text-foreground shadow-[var(--shadow-candy)] hover:shadow-[var(--shadow-candy)]",
        heroOutline: "border border-[hsl(var(--accent-gold)/0.4)] bg-transparent text-foreground hover:border-[hsl(var(--accent-gold)/0.8)] hover:bg-[hsl(var(--accent-gold)/0.05)]",
        gold: "bg-[hsl(var(--accent-gold))] text-background hover:bg-[hsl(var(--accent-gold)/0.9)] shadow-[var(--shadow-gold)]",
        glowRed: "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:border-primary",
        flux: "candy-sheen text-foreground font-medium tracking-wide",
        fluxOutline: "border border-[hsl(var(--accent-gold)/0.4)] bg-transparent text-foreground hover:bg-[hsl(var(--accent-gold)/0.05)] hover:border-[hsl(var(--accent-gold)/0.8)] font-medium",
        fluxGhost: "text-muted-foreground hover:text-foreground hover:bg-white/[0.02] font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

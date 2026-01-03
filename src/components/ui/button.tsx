import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants used across the project
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:scale-105",
        heroOutline: "border border-muted-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-foreground/5",
        gold: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 hover:shadow-accent/50",
        glowRed: "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:border-primary",
        flux: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide",
        fluxOutline: "border border-white/20 bg-white/[0.02] text-foreground hover:bg-white/[0.05] hover:border-white/30 font-medium",
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

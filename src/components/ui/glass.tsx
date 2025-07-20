
import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const glassVariants = cva(
  "backdrop-blur-md border transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20 shadow-lg",
        subtle: "bg-white/5 border-white/10 shadow-md",
        strong: "bg-white/15 border-white/30 shadow-xl",
        primary: "bg-primary/10 border-primary/20 shadow-lg shadow-primary/10",
        secondary: "bg-secondary/10 border-secondary/20 shadow-lg shadow-secondary/10",
        dark: "bg-black/20 border-white/10 shadow-lg",
      },
      surface: {
        flat: "",
        raised: "shadow-2xl",
        floating: "shadow-2xl transform hover:scale-[1.02]",
        interactive: "hover:bg-white/15 hover:border-white/30 cursor-pointer active:scale-[0.98]",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        strong: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        always: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/8 before:to-secondary/8 before:opacity-100",
      },
      blur: {
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      surface: "flat",
      glow: "none",
      blur: "md",
    },
  }
)

export interface GlassProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassVariants> {
  asChild?: boolean
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, variant, surface, glow, blur, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    
    return (
      <Comp
        className={cn(glassVariants({ variant, surface, glow, blur }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Glass.displayName = "Glass"

const GlassButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof glassVariants>
>(({ className, variant = "default", surface = "interactive", glow = "subtle", blur = "md", children, ...props }, ref) => (
  <button
    className={cn(
      glassVariants({ variant, surface, glow, blur }),
      "px-6 py-3 rounded-lg font-medium text-white/90 hover:text-white transition-colors relative z-10",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </button>
))
GlassButton.displayName = "GlassButton"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glassVariants>
>(({ className, variant = "default", surface = "raised", glow = "none", blur = "md", children, ...props }, ref) => (
  <div
    className={cn(
      glassVariants({ variant, surface, glow, blur }),
      "p-6 rounded-xl",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
))
GlassCard.displayName = "GlassCard"

export { Glass, GlassButton, GlassCard, glassVariants }

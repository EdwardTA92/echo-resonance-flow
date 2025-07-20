
import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const glassVariants = cva(
  "backdrop-blur-md border transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20 shadow-lg glass-effect",
        subtle: "bg-white/5 border-white/10 shadow-md glass-effect",
        strong: "bg-white/15 border-white/30 shadow-xl glass-effect",
        primary: "bg-primary/10 border-primary/20 shadow-lg shadow-primary/10 glass-effect",
        secondary: "bg-secondary/10 border-secondary/20 shadow-lg shadow-secondary/10 glass-effect",
        dark: "bg-black/20 border-white/10 shadow-lg glass-effect",
        bubble: "bg-white/8 border-white/15 shadow-2xl glass-bubble",
        dimensional: "bg-white/12 border-white/25 shadow-3xl glass-dimensional",
      },
      surface: {
        flat: "",
        raised: "shadow-2xl transform-gpu",
        floating: "shadow-2xl transform-gpu hover:scale-[1.02] hover:shadow-3xl",
        interactive: "hover:bg-white/15 hover:border-white/30 cursor-pointer active:scale-[0.98] transform-gpu press-effect",
        pressable: "cursor-pointer press-bubble transform-gpu hover:shadow-3xl active:shadow-inner",
        bubble: "transform-gpu bubble-surface hover:scale-[1.05] active:scale-[0.95]",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        strong: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        always: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/8 before:to-secondary/8 before:opacity-100",
        bubble: "glass-glow",
        dimensional: "dimensional-glow",
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

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassVariants> {
  size?: "sm" | "md" | "lg";
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "bubble", surface = "pressable", glow = "bubble", blur = "md", size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <button
        className={cn(
          glassVariants({ variant, surface, glow, blur }),
          sizeClasses[size],
          "rounded-lg font-medium text-white/90 hover:text-white transition-all duration-200 relative z-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
)
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

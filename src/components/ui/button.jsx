import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 active:opacity-80 touch-manipulation [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/85 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.25),0_8px_24px_-10px_hsl(var(--primary)/0.55)] hover:shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.35),0_18px_40px_-8px_hsl(var(--primary)/0.8),0_0_0_3px_hsl(var(--primary)/0.22)] hover:-translate-y-1",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85 hover:shadow-[0_14px_32px_-10px_hsl(0_72%_55%/0.6),0_0_0_3px_hsl(0_72%_55%/0.2)] hover:-translate-y-1",
        outline:
          "glass hover:bg-foreground/8 hover:border-primary/50 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.18),0_14px_30px_-12px_hsl(var(--primary)/0.4)] hover:-translate-y-1",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary hover:shadow-[0_12px_28px_-12px_hsl(0_0%_0%/0.3)] hover:-translate-y-1",
        ghost: "hover:bg-foreground/10 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
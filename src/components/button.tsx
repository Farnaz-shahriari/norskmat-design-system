import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
    // Material 3 buttons. state-layer shows hover, focus and press in the
    // label colour; disabled follows M3, on-surface at 12% and 38%.
    "state-layer inline-flex items-center justify-center gap-sm whitespace-nowrap transition-all cursor-pointer disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 label-large",
  {
    variants: {
      variant: {
        // Filled, the main action
        primary: "bg-primary text-primary-foreground disabled:bg-on-surface/12 disabled:text-on-surface/38",

        // Tonal, a filled button with less emphasis
        tonal: "bg-secondary-container text-secondary-container-foreground disabled:bg-on-surface/12 disabled:text-on-surface/38",

        // Outlined. The border stays --border by decision, the label
        // identifies the control.
        secondary: "border border-border text-primary disabled:border-on-surface/12 disabled:text-on-surface/38",

        // Text, the least important action
        tertiary: "text-primary disabled:text-on-surface/38",

        // Destructive, filled in error
        destructive: "bg-error text-error-foreground disabled:bg-on-surface/12 disabled:text-on-surface/38",

        // Ghost, a text button in the neutral colour
        ghost: "text-on-surface disabled:text-on-surface/38",
      },
      size: {
        // Default, 56px, M3 Expressive medium
        default: "h-14 px-lg rounded-[var(--radius-button)]",

        // Small, 40px, M3's standard button height
        sm: "h-10 px-md rounded-[var(--radius-button)]",
        
        // Icon button - 56px square
        icon: "w-14 h-14 rounded-full",
        
        // Small icon button - for compact UIs (48px)
        "icon-sm": "w-12 h-12 rounded-full",
        
        // Tiny icon button - for very compact UIs (40px) - use sparingly
        "icon-xs": "w-10 h-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
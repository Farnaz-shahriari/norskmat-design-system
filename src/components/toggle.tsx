"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const toggleVariants = cva(
  // Material 3 toggle button. Selected is the tonal fill, the same
  // secondary-container as a selected chip or segment.
  "state-layer inline-flex items-center justify-center gap-sm rounded-[var(--radius-button)] label-large text-on-surface-variant disabled:pointer-events-none disabled:text-on-surface/38 data-[state=on]:bg-secondary-container data-[state=on]:text-secondary-container-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:border-error whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-outline bg-transparent",
      },
      size: {
        default: "h-10 px-sm min-w-10",
        sm: "h-8 px-xs min-w-8",
        lg: "h-12 px-md min-w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };

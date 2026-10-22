import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const chipVariants = cva(
  "state-layer inline-flex items-center justify-center gap-sm whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-on-surface/12 disabled:text-on-surface/38 label-large",
  {
    variants: {
      variant: {
        assist: "bg-surface text-on-surface border border-outline",

        filter: "bg-surface text-on-surface-variant border border-outline",

        suggestion: "bg-surface text-on-surface-variant border border-outline",

        input: "bg-surface text-on-surface-variant border border-outline",
      },

      selected: {
        true:
          "bg-secondary-container text-secondary-container-foreground border-secondary-container",

        false: "",
      },

      size: {
        default: "h-8 px-4 rounded-[var(--radius-chip)]",
        sm: "h-7 px-3 rounded-[var(--radius-chip)]",
      },
    },

    defaultVariants: {
      variant: "assist",
      selected: false,
      size: "default",
    },
  }
);

function Chip({
  className,
  variant,
  selected,
  size,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  }) {
  return (
    <button
      className={cn(
        chipVariants({
          variant,
          selected,
          size,
        }),
        className
      )}
      {...props}
    >
      {leadingIcon}

      <span>{children}</span>

      {trailingIcon}
    </button>
  );
}

export { Chip, chipVariants };
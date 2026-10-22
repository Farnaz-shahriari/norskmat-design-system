import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

// Material 3 card. Outlined is the default, M3's elevated card would need a
// shadow, which this system does not use, so outlined stands in for it.
const cardVariants = cva(
  "text-on-surface flex flex-col gap-md rounded-[var(--radius-card)]",
  {
    variants: {
      variant: {
        outlined: "bg-surface border border-outline-variant",
        filled: "bg-surface-container-highest",
      },
    },
    defaultVariants: { variant: "outlined" },
  },
);

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-xs px-md pt-md has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-md",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("title-medium text-on-surface", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("body-medium text-on-surface-variant", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-md [&:last-child]:pb-md", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-sm px-md pb-md [.border-t]:pt-md", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};

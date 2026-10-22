"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Material Design 3 Switch - 52×32px container
        "group relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer rounded-full transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-(--disabled-content)",
        // Unchecked: surface-container-highest track, 2px outline border, padding 2px 8px
        "data-[state=unchecked]:bg-surface-container-highest data-[state=unchecked]:border-2 data-[state=unchecked]:border-outline data-[state=unchecked]:px-2 data-[state=unchecked]:py-0.5 data-[state=unchecked]:justify-start",
        // Checked: primary track, no border, padding 2px 4px
        "data-[state=checked]:bg-primary data-[state=checked]:border-0 data-[state=checked]:px-1 data-[state=checked]:py-0.5 data-[state=checked]:justify-end",
        "items-center",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Material Design 3 Handle, 28px while pressed
          "pointer-events-none relative block rounded-full transition-all",
          // Unchecked: 16px handle in outline, its state layer in on-surface
          "data-[state=unchecked]:h-4 data-[state=unchecked]:w-4",
          "data-[state=unchecked]:bg-outline data-[state=unchecked]:text-on-surface",
          "data-[state=unchecked]:translate-x-0",
          // Checked: 24px handle in on-primary, its state layer in primary
          "data-[state=checked]:h-6 data-[state=checked]:w-6",
          "data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary",
          "data-[state=checked]:translate-x-0",
          "group-active:h-7 group-active:w-7",
          // The M3 state layer, a 40px circle around the handle
          "before:absolute before:left-1/2 before:top-1/2 before:size-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:content-['']",
          "group-hover:before:opacity-(--state-hover) group-focus-visible:before:opacity-(--state-focus) group-active:before:opacity-(--state-pressed) group-disabled:before:opacity-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

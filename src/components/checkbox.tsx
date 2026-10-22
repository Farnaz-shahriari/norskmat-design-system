"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-2 border-outline bg-transparent data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-error size-[18px] shrink-0 rounded-[var(--radius-sm)] transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-(--disabled-content) relative before:absolute before:left-1/2 before:top-1/2 before:size-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-on-surface before:opacity-0 before:transition-opacity before:content-[''] data-[state=checked]:before:bg-primary hover:before:opacity-(--state-hover) focus-visible:before:opacity-(--state-focus) active:before:opacity-(--state-pressed) disabled:before:opacity-0",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

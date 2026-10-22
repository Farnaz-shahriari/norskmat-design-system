import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Material 3 outlined text field, 56px, 4px corners, 2px primary
        // outline on focus, error outline when aria-invalid.
        "file:text-on-surface placeholder:text-on-surface-variant selection:bg-primary selection:text-primary-foreground border-outline flex h-14 w-full min-w-0 rounded-[var(--radius-sm)] border px-md body-large text-on-surface bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:label-large hover:border-on-surface disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38",
        "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary",
        "aria-invalid:border-error aria-invalid:focus-visible:ring-error",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

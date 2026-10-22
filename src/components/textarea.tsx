import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-outline placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary aria-invalid:border-error aria-invalid:focus-visible:ring-error flex field-sizing-content min-h-14 w-full rounded-[var(--radius-sm)] border bg-transparent px-md py-md body-large text-on-surface transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

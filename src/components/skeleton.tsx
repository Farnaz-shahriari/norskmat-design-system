import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-surface-container-highest animate-pulse rounded-[var(--radius-sm)]", className)}
      {...props}
    />
  );
}

export { Skeleton };

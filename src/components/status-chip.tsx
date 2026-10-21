import { Check, CircleAlert } from "lucide-react";

import { cn } from "./utils";

/**
 * Completion state for a field, shown beside it.
 *
 * Recreated here. The original lived outside this repo and every component
 * that imported it was broken. The incomplete state is reproduced exactly
 * from the inline copies that were sitting in editable-text-field.tsx, which
 * now use this component instead of repeating the markup.
 *
 * The complete state is new. Nothing in the repo specified it, so it mirrors
 * the incomplete one and swaps the alert for a check in --primary. Change it
 * if the real design says otherwise.
 */
interface StatusChipProps {
  isComplete: boolean;
  /** Overrides the default Norwegian labels. */
  label?: string;
  className?: string;
}

export function StatusChip({ isComplete, label, className }: StatusChipProps) {
  const Icon = isComplete ? Check : CircleAlert;
  return (
    <div
      className={cn(
        "bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0",
        className,
      )}
    >
      <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
        <Icon
          className="w-[18px] h-[18px] shrink-0"
          style={{ color: isComplete ? "var(--primary)" : "var(--error)" }}
          aria-hidden="true"
        />
        <span className="label-medium text-foreground whitespace-nowrap">
          {label ?? (isComplete ? "Utfylt" : "Trenger utfylling")}
        </span>
      </div>
    </div>
  );
}

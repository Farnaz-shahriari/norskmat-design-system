import { ReactNode } from "react";
import { cn } from "./utils";

/**
 * List Item, Material 3.
 *
 * Generalizes the density and trailing content variants that already existed
 * as one off Figma exports, ListItemListItem0Density, ListItemListItem4Density,
 * across several files, never as a single reusable component. Same anatomy,
 * one component, two densities.
 *
 * default density, 56px min height, py-8, one line title, matches "0 Density".
 * compact density, tighter py-4, no fixed height, supports an overline label
 * plus a two line title or title and supporting text, matches "-4 Density".
 */

interface ListItemProps {
  density?: "default" | "compact";
  leadingIcon?: ReactNode;
  overline?: string;
  title: string;
  supportingText?: string;
  trailingText?: string;
  trailingIcon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  density = "default",
  leadingIcon,
  overline,
  title,
  supportingText,
  trailingText,
  trailingIcon,
  selected = false,
  disabled = false,
  onClick,
  className = "",
}: ListItemProps) {
  const isCompact = density === "compact";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "state-layer flex items-center gap-md w-full rounded-[var(--radius-card)] text-left transition-colors",
        "outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-(--disabled-content)",
        isCompact ? "px-md py-1" : "pl-md pr-lg py-sm min-h-14",
        selected ? "bg-secondary-container text-secondary-container-foreground" : "text-on-surface",
        className
      )}
    >
      {leadingIcon && (
        <div className="shrink-0 w-6 h-6 flex items-center justify-center">
          {leadingIcon}
        </div>
      )}

      <div className="flex-1 flex flex-col items-start text-left overflow-hidden">
        {overline && (
          <p
            className={cn(
              "label-small",
              selected ? "text-secondary-container-foreground" : "text-on-surface-variant"
            )}
          >
            {overline}
          </p>
        )}

        <p
          className={cn(
            isCompact ? "label-large" : "body-large",
            selected ? "text-secondary-container-foreground" : "text-on-surface",
            !isCompact && "line-clamp-2 w-full"
          )}
        >
          {title}
        </p>

        {supportingText && (
          <p
            className={cn(
              "body-medium mt-0.5",
              selected ? "text-secondary-container-foreground" : "text-on-surface-variant"
            )}
          >
            {supportingText}
          </p>
        )}
      </div>

      {(trailingText || trailingIcon) && (
        <div className="shrink-0 flex items-center gap-sm">
          {trailingText && (
            <span className="label-small text-on-surface-variant whitespace-nowrap">
              {trailingText}
            </span>
          )}
          {trailingIcon}
        </div>
      )}
    </button>
  );
}

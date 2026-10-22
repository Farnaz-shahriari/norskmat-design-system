"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "title-small text-on-surface",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-10 p-0 text-on-surface-variant",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-on-surface w-10 body-medium",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center body-medium focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-secondary-container [&:has([aria-selected].day-range-end)]:rounded-r-full",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-10 p-0 body-medium aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "border border-primary text-primary",
        day_outside:
          "day-outside text-on-surface-variant aria-selected:text-on-surface-variant",
        day_disabled: "text-on-surface/38",
        day_range_middle:
          "aria-selected:bg-secondary-container aria-selected:text-secondary-container-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-6", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-6", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
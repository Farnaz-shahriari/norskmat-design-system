import * as React from "react";

interface DividerWithSubtitleProps {
  subtitle: string;
  className?: string;
}

export function DividerWithSubtitle({ subtitle, className = "" }: DividerWithSubtitleProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Horizontal divider line */}
      <div className="h-px w-full bg-border" />
      
      {/* Subtitle below the line */}
      <span className="label-large text-muted-foreground">
        {subtitle}
      </span>
    </div>
  );
}

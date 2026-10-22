import * as React from "react";

interface DividerWithSubtitleProps {
  subtitle: string;
  className?: string;
}

export function DividerWithSubtitle({ subtitle, className = "" }: DividerWithSubtitleProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Horizontal divider line */}
      <div className="h-px w-full bg-outline-variant" />
      
      {/* Subtitle below the line */}
      <span className="title-small text-on-surface-variant">
        {subtitle}
      </span>
    </div>
  );
}

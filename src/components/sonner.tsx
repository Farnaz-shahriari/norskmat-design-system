"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Material 3 snackbar, inverse surface, 4px corners
          "--normal-bg": "var(--inverse-surface)",
          "--normal-text": "var(--inverse-on-surface)",
          "--normal-border": "var(--inverse-surface)",
          "--border-radius": "var(--radius-sm)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

import { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { PLATFORMS, type PlatformId } from "./platforms";
import "./preview.css";

// The theme class goes on <html>, exactly as an app does it, not only on a
// wrapper. Dialog, Select, Popover and the rest render into a portal on
// <body>, outside any wrapper, and would otherwise always come out as KSL.
function useRootTheme(id: PlatformId) {
  useEffect(() => {
    const root = document.documentElement;
    PLATFORMS.forEach((p) => root.classList.remove(`theme-${p.id}`));
    root.classList.add(`theme-${id}`);
  }, [id]);
}

const withPlatform: Decorator = (Story, context) => {
  const selected = context.globals.platform as PlatformId | "all";
  useRootTheme(selected === "all" ? "ksl" : selected);

  if (selected !== "all") {
    return (
      <div className="p-lg">
        <Story />
      </div>
    );
  }

  // All four side by side. Each column carries its own theme class, which is
  // enough for everything that renders in place. Stories for components that
  // portal, Dialog and Select, pin one platform per story instead.
  return (
    <div className="grid gap-md grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      {PLATFORMS.map((p) => (
        <section
          key={p.id}
          aria-label={p.name}
          className={`theme-${p.id} bg-background text-foreground rounded-[var(--radius-card)] border border-[var(--outline-variant)] p-md flex flex-col gap-md`}
        >
          <h2 className="label-small text-muted-foreground m-0">{p.name}</h2>
          <Story />
        </section>
      ))}
    </div>
  );
};

const preview: Preview = {
  decorators: [withPlatform],
  globalTypes: {
    platform: {
      description: "Platform theme, the .theme-<platform> class",
      toolbar: {
        title: "Platform",
        icon: "paintbrush",
        items: [
          { value: "all", title: "All four side by side" },
          ...PLATFORMS.map((p) => ({ value: p.id, title: p.name })),
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { platform: "all" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    // Fail a story on any axe violation when stories run as tests, rather
    // than only listing it in the panel.
    a11y: { test: "error" },
  },
};

export default preview;

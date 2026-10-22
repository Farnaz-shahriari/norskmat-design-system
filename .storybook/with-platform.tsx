import { useEffect } from "react";
import type { Decorator } from "@storybook/react-vite";
import { PLATFORMS, type PlatformId } from "./platforms";

// The platform decorator. Every story file lists it in its meta rather than
// preview.tsx listing it once for all of them: /design-sync renders previews
// outside Storybook and hands a preview-wide decorator a fixed context, while
// a meta decorator gets the story's own parameters. That is what lets a story
// pinned with pinPlatform() render one platform in both places.

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

export const withPlatform: Decorator = (Story, context) => {
  const selected = (context.parameters?.platform ?? context.globals?.platform ?? "all") as PlatformId | "all";
  useRootTheme(selected === "all" ? "ksl" : selected);

  if (selected !== "all") {
    // Full viewport height, so a screenshot of the story root also takes in
    // an overlay centred in the viewport.
    return (
      <div className="p-lg min-h-screen">
        <Story />
      </div>
    );
  }

  // All four side by side. Each column carries its own theme class, which is
  // enough for everything that renders in place. Open overlays portal out of
  // the columns, so their stories pin one platform each instead.
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

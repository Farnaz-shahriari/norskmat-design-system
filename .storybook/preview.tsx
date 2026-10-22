import type { Preview } from "@storybook/react-vite";
import { PLATFORMS } from "./platforms";

// The platform switcher itself is with-platform.tsx, listed in every story
// file's meta. This file only declares the toolbar it reads.
const preview: Preview = {
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

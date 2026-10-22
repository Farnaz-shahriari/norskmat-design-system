// Storybook for the component library, the real components from
// src/components rendered with the real stylesheet, in every platform theme.
//
// Stories live in stories/, not src/, because src/components is what the
// package ships and what build-barrel.mjs exports, a story file there would
// end up in the public API.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  // The stylesheet is its own preview entry, not an import in preview.tsx,
  // see preview-styles.ts for why.
  previewAnnotations: (entries = []) => [
    ...entries,
    fileURLToPath(new URL("./preview-styles.ts", import.meta.url)),
  ],
  // Compile src/styles/index.css with Tailwind on the fly, so a story always
  // shows the current tokens, not whatever dist/ was last built with.
  viteFinal: (vite) => mergeConfig(vite, { plugins: [tailwindcss()] }),
};

export default config;

// Accessibility lint for the component library, nothing else.
//
// Formatting and general code style are deliberately out of scope here,
// this config exists so a component cannot ship a click handler on a div
// with no keyboard path, an unlabelled control, or similar, without
// npm run lint:a11y saying so. Contrast is checked separately by
// scripts/check-contrast.mjs, a linter cannot see resolved colours.

import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/components/**/*.{ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
];

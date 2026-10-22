# Consuming this design system

> **The reference site is live at https://farnaz-shahriari.github.io/norskmat-design-system.** It rebuilds and redeploys on every push to `main`, so it is never out of date, and it carries a one line check you can paste into your own app's console to find every token that app gets wrong.

This repo is now an installable package, `@norskmat/design-system`. Apps reference it instead of copying files out of it, so a change here reaches every app with one `npm update`.

## Install

```bash
npm install github:Farnaz-shahriari/norskmat-design-system
```

No npm registry account, no publish step. npm clones the repo at install time and installs the pinned dependencies from `package.json`.

To pin a specific state so an app is not surprised by a change here, install a tag or commit instead of the branch,

```bash
npm install github:Farnaz-shahriari/norskmat-design-system#v1.0.0
```

## Use

Tokens, once, at the app's CSS entry point. This is the built stylesheet, so there is nothing to configure.

```css
@import "@norskmat/design-system/styles.css";
```

Then one theme class on the root element, and every color, type class, spacing and radius token resolves to that platform's values.

```html
<html class="theme-lokalmat">
```

Components, by name from the package root.

```ts
import { Button, Chip, ListItem, cn } from "@norskmat/design-system";
```

Or one at a time, if you would rather not rely on tree shaking.

```ts
import { Button } from "@norskmat/design-system/components/button";
```

Logos, by path.

```ts
import lokalmatLogo from "@norskmat/design-system/logos/lokalmat/lokalmat_logo.svg";
```

## Compiling the CSS yourself

Only needed if you want to extend the Tailwind theme. Import the source entry instead of the built file, and let your bundler see the package.

```css
@import "@norskmat/design-system/source.css";
```

Vite,

```ts
export default { optimizeDeps: { exclude: ["@norskmat/design-system"] } };
```

Next.js,

```js
module.exports = { transpilePackages: ["@norskmat/design-system"] };
```

The package ships real `.tsx` beside the generated `.d.ts`, so types work either way.

## Building the package

```bash
npm install
npm run build     # barrel, then CSS into dist/, then declarations
```

`npm run build` regenerates `src/index.ts`, compiles `src/styles/index.css` to `dist/norskmat.css` with the font files beside it, and emits declarations to `dist/`. It fails if two components export the same name, if a font url would not resolve from `dist/`, or on any type error.

## Updating## Updating## Updating

```bash
npm update @norskmat/design-system
```

That is the whole update path for tokens, components and logos together. Nothing is copied into `src/`, so there is nothing to drift.

If an app needs to change a component's behaviour, it wraps it, it does not copy and edit it. A copy is drift with extra steps.

## What is not in the package

`references/` and `platforms/` are shipped, under `skills/norsk-mat-design-system/`, but they are documentation, never read at runtime. They are the spec, they tell you which token to use, they do not enforce anything. The linting rule that would actually enforce "no raw hex, no raw px" does not exist yet.

Fonts are not shipped. Manrope loads from Google Fonts. Messina Serif and Sands are licensed webfonts, each app self-hosts its own copies until there is somewhere shared to put them, `tokens.css` falls back to Georgia in the meantime.

## Known consumer-side gaps

`sidebar.tsx` uses `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `border-sidebar-border` and `ring-sidebar-ring`, none of which exist as tokens here, and it wraps one of them in `hsl(var(--sidebar-border))`, which expects an HSL triplet where this system uses hex. It will not theme correctly until the sidebar colors are decided. See colors.md's known gaps.

Every component sizes text with the named type classes, since the Material 3 restyle (docs/m3-audit.md) none uses Tailwind's `text-*` scale, which `tokens.css` partly redefines.

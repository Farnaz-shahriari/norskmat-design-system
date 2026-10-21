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

Tokens, once, at the app's CSS entry point.

```css
@import "@norskmat/design-system/tokens.css";
```

Then one theme class on the root element, and every color, type class, spacing and radius token resolves to that platform's values.

```html
<html class="theme-lokalmat">
```

Components, by name.

```ts
import { Button } from "@norskmat/design-system/components/button";
import { Chip } from "@norskmat/design-system/components/chip";
import { cn } from "@norskmat/design-system/utils";
```

Logos, by path.

```ts
import lokalmatLogo from "@norskmat/design-system/logos/lokalmat/lokalmat_logo.svg";
```

## One required build setting

The package ships raw `.tsx`, not compiled JavaScript. That is deliberate, it keeps the files here identical to what a designer reads and what Figma produces, and it means Tailwind can see the class names. But most bundlers skip `node_modules` when transpiling, so each app has to opt this package in.

Vite,

```ts
// vite.config.ts
export default {
  optimizeDeps: { exclude: ["@norskmat/design-system"] },
};
```

Next.js,

```js
// next.config.js
module.exports = { transpilePackages: ["@norskmat/design-system"] };
```

Tailwind v4 also needs to scan the package for class names, otherwise components render unstyled,

```css
@source "../node_modules/@norskmat/design-system/skills/norsk-mat-design-system/assets/components";
```

## The reference site

Live at **https://farnaz-shahriari.github.io/norskmat-design-system**, rebuilt and redeployed by `.github/workflows/docs.yml` on every push to `main`. The linter runs first, so a push that leaves a component pointing at a token that does not exist never gets a green deploy.

`docs/index.html` is **not** committed. It is build output, and a committed copy is a copy that can lag behind the design system, which is the failure this whole repo exists to stop. To see it locally,

```bash
npm install     # first time only, pulls the build tools
npm run docs    # writes docs/index.html, docs/tokens.json, docs/audit.js
```

Edit `docs/site/main.tsx`, `docs/site/preview.tsx` and `docs/site/site.css` to change the site. Never edit `docs/index.html`.

To enable the deployment once, in the repo settings under Pages, set the source to **GitHub Actions**. Nothing else.

## Checking a live app against the system

Open any app that uses the design system, and paste this into the browser console.

```js
import("https://farnaz-shahriari.github.io/norskmat-design-system/audit.js")
```

It reports every token that app defines differently from the design system, and every token it does not define at all. It carries no values of its own, it fetches the current ones from the deployment, so it is always checking against the system as it stands rather than a snapshot.

It reads and never writes. The panel renders in a shadow root, so the app's CSS cannot restyle it and it cannot restyle the app. Safe on production.

For a test rather than a console, `docs/tokens.json` on the same host is the machine readable model, so an app can assert against it in CI.

## Updating## Updating

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

Six components (`input`, `label`, `badge`, `select`, `dialog`, `alert`) size text with Tailwind's `text-*` scale instead of the named type classes. They are not wrong, just inconsistent with the rest.

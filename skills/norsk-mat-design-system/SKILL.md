---
name: norsk-mat-design-system
description: The Norsk Mat design system, covering KSL, Nyt Norge, Spesialitet, LokalMat, Beskyttede Betegnelser, and Stiftelsen Norsk Mat. Use this whenever designing, building, reviewing, or discussing any UI for one of these platforms, colors, typography, spacing, layout, components, logos, or brand rules included. Trigger this for any request to build a screen, page, component, or UI pattern for KSL or its sibling platforms, even if the person does not say "design system" explicitly, for example "build a deviation list", "add a filter row", "what color should this button be", "make a settings page for KSL".
---

# Norsk Mat design system

One source of truth across Stiftelsen Norsk Mat's platforms, KSL, Nyt Norge, Spesialitet, LokalMat, Beskyttede Betegnelser, and the institutional Stiftelsen Norsk Mat site. Built by auditing the real KSL Foretak app codebase and the real Figma variable exports, not by guessing, see `docs/journal.md` for the full history of how every decision here was made.

## Confidence, read this first

* **KSL**, deeply audited, colors, typography, spacing, and components are all checked against the real app codebase. Treat KSL as the reference platform.
* **Nyt Norge, Spesialitet, LokalMat**, colors and typography are confirmed from real Figma variable exports, solid. Logo usage rules and component behavior are not yet confirmed beyond the public brand site, treat as provisional.
* **Beskyttede Betegnelser, Stiftelsen Norsk Mat**, logo only, no color, type, or component decisions made yet, defer to KSL's shared rules and ask before inventing anything platform specific.

**This file describes the intended system, not the current live app.** Real bugs were found in the KSL Foretak codebase during this audit, hardcoded colors, a wrong severity value, dead CSS, a dropped font. They are documented as known gaps in the relevant reference file, not silently fixed. Do not copy the app's current code as ground truth where a reference file says otherwise.

## How to use this

1. Identify the platform, KSL unless told otherwise.
2. Check `references/brand-context.md` for who the platform is for and its tone.
3. Pull colors from `references/colors.md`, shared severity and error colors first, then that platform's brand and surface colors.
4. Pull type and spacing from `references/typography.md` and `references/spacing.md`, same values for every platform except LokalMat's font family.
5. Build UI from `references/components.md` and the real component code in `src/components/`, don't hand roll something that already exists as a component.
6. Use logos from `assets/<platform>/`, check that platform's README for usage rules before placing one.

## References

* `platforms/`, reserved for anything specific to one platform that outgrows the shared reference files, currently just an outline, see `platforms/README.md`.
* `references/brand-context.md`, who each platform serves, tone, and what still needs your input.
* `references/colors.md`, shared severity and error colors, per platform brand colors, per platform surfaces, and known gaps in the live app.
* `references/typography.md`, font families per platform, type scale and named styles ranked by real usage.
* `references/spacing.md`, spacing scale, component heights, grid approach, breakpoints, page width, panel layout, radius tokens.
* `references/components.md`, full tiered audit of the shared UI library, keep as is, needs a token fix, resolved decisions, and what has been newly built.

## The reference site

Live at https://farnaz-shahriari.github.io/norskmat-design-system, rebuilt and redeployed on every push to main, so it is always current. It carries the install guide, an example screen rendered live in all four platforms side by side with a token labelling overlay, every colour token per platform, the type specimens, the spacing and radius scales, the real components running, the rules, and the open gaps.

To check whether a real app actually matches this system, paste `import("https://farnaz-shahriari.github.io/norskmat-design-system/audit.js")` into that app's console. It lists every token the app defines differently and every one it does not define at all. Use it before trusting an app as a reference for anything.

## Installing this in an app

This repo is an installable package, `@norskmat/design-system`. Apps must reference it, never copy files out of it, `npm install github:Farnaz-shahriari/norskmat-design-system`, then `@import "@norskmat/design-system/tokens.css"` and one `.theme-<platform>` class on the root element. Full setup, including the one required bundler setting, is in `docs/consuming.md` at the repo root. If you find an app that copied `tokens.css` or a component into its own `src/`, that is drift, replace it with the package import.

## Assets

* `src/styles/tokens.css`, the canonical, corrected CSS for every platform, colors, typography, spacing, and radius, one `.theme-<platform>` class each for the parts that vary, shared variables and named type classes for the parts that don't. Drop this in directly rather than trusting the live app's `globals.css`, which is missing several of these entirely, see the known gaps in colors.md, typography.md, and spacing.md.
* `src/styles/index.css`, the Tailwind entry that compiles to `dist/norskmat.css`. An app importing the built file needs no Tailwind configuration of its own.
* `src/styles/fonts/`, Manrope self hosted under the SIL Open Font License, so headings never fall back to a system sans when an external font request is blocked.
* `src/components/`, the complete, working component library, 71 files, real `.tsx` code, consumed through the package, not copied. `connected-button-group.tsx` and `list-item.tsx` are new, built for this system, not upstream Material 3. `switch.tsx`, the text input family, and `inline-editable-list-item.tsx` are corrected copies, hardcoded colors replaced with the variables from `tokens.css`. `status-chip.tsx` and `date-format.ts` were recreated after the originals were found missing. Since 2026-10-22 every component is restyled to Material 3 on its Radix + Tailwind base, see `docs/m3-audit.md` for what changed and what is still open.
* `skills/norsk-mat-design-system/assets/<platform>/`, logo files and a README per platform covering what exists, what's missing, and usage rules where confirmed. Brand assets stay with the skill, code lives in `src/`.

## Non-negotiable rules

* Use `src/styles/tokens.css` as the actual CSS, not the live app's `globals.css`, it is missing `--outline` entirely and `--outline-variant` for three platforms, and its Tailwind mapping omits the whole surface family.
* No raw hex, pixel, or radius values in new code, everything must reference a token from colors.md or spacing.md.
* Run `npm run lint:tokens` before committing a component change. It checks every component for undefined variables, raw hex, radius name collisions, size names shadowed by the spacing scale, off scale radius and spacing, and text sized outside the named scale, and fails on the first four. It exists because these rules were documentation only for months while real components rendered wrong.
* Never define `--radius-md`, `--radius-lg`, `--radius-xl` or `--radius-2xl` in tokens.css. Those are Tailwind's own radius names, and redefining one silently rewrites every `rounded-<name>` in the library. Point a component at the token it means instead.
* Never use a named size, `xs` to `2xl`, on `w`, `h`, `max-w`, `min-w`, `max-h`, `min-h`, `size` or `basis`. The spacing scale owns those names, so `max-w-lg` is 24px, not Tailwind's 32rem, which shipped Dialog, AlertDialog, Sheet, Drawer and TimePickerDropdown as slivers. Write `max-w-(--container-lg)` for a container width, `h-[var(--height-lg)]` for a component height. `lint:tokens` fails on it.
* Never copy `tokens.css` or a component file into an app's own `src/`. Install the package and import it, a copy silently stops receiving changes and nothing warns anyone.
* Kritisk, Vesentlig, Mindre alvorlig are the only three deviation tiers, and they are identical across every platform. No other orange, ever, Vesentlig is the only orange. Use `var(--vesentlig)` and `var(--mindre-alvorlig)`, never fall back to `var(--error)` for either.
* Severity is never shown by colour alone. Every place a tier appears, chip, row, badge, icon, count, carries the tier's name in text, "Kritisk", "Vesentlig" or "Mindre alvorlig", or at minimum an accessible name that says it. A red dot, an orange border or a tinted row on its own fails WCAG 1.4.1, and it fails the farmer who cannot tell the three colours apart, which is the person the tiers exist for.
* Run `npm run lint:a11y` and `npm run lint:contrast` before committing a component or token change. The first is eslint-plugin-jsx-a11y over `src/components/`, the second checks every text and control border pair in all four themes against WCAG 2.2 AA, 4.5:1 for text, 3:1 for borders and focus rings. A control's border is `--outline`, never `--border` or `--input`, those two are 1.3 to 1.7:1 and only for dividers and tracks. The one deliberate exception is Button's `secondary` variant, which keeps `--border` because its label identifies it, a field has no text to do that, so it still needs `--outline`.
* IconButton is `button.tsx`'s `size="icon"` variant, don't hand roll a new one.
* ConnectedButtonGroup and ListItem live in `src/components/`, use them instead of copying markup from an existing page.
* Manrope is the only font for KSL, Nyt Norge, Spesialitet. LokalMat uses Messina Serif and Sands once those files are actually licensed, `tokens.css` falls back to Georgia until then, don't let it silently become a generic system sans. Never reintroduce Quatro.

## Keeping this current

This skill is meant to stay open for editing as the system grows. Log every change in `docs/journal.md`, what changed, why, and which files it touched, the same pattern used to build it. If a rule here ever conflicts with something newly confirmed in Figma or the app, update the reference file and note the change in the journal, don't leave two versions of the truth sitting in the repo.

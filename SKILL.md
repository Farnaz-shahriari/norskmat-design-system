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
5. Build UI from `references/components.md` and the real component code in `assets/components/`, don't hand roll something that already exists as a component.
6. Use logos from `assets/<platform>/`, check that platform's README for usage rules before placing one.

## References

* `platforms/`, reserved for anything specific to one platform that outgrows the shared reference files, currently just an outline, see `platforms/README.md`.
* `references/brand-context.md`, who each platform serves, tone, and what still needs your input.
* `references/colors.md`, shared severity and error colors, per platform brand colors, per platform surfaces, and known gaps in the live app.
* `references/typography.md`, font families per platform, type scale and named styles ranked by real usage.
* `references/spacing.md`, spacing scale, component heights, grid approach, breakpoints, page width, panel layout, radius tokens.
* `references/components.md`, full tiered audit of the shared UI library, keep as is, needs a token fix, resolved decisions, and what has been newly built.

## Assets

* `assets/tokens.css`, the canonical, corrected CSS custom properties for every platform, one `.theme-<platform>` class each, plus the complete Tailwind `@theme` mapping. Drop this in directly rather than trusting the live app's `globals.css`, which is missing several of these variables entirely, see colors.md's known gaps.
* `assets/components/`, real, working `.tsx` component code, copy these directly into a project rather than rebuilding from the docs. `connected-button-group.tsx` and `list-item.tsx` are new, built for this system, not upstream Material 3. `switch.tsx` and the text input family are corrected copies, hardcoded colors replaced with the variables from `tokens.css`.
* `assets/<platform>/`, logo files and a README per platform covering what exists, what's missing, and usage rules where confirmed.

## Non-negotiable rules

* Use `assets/tokens.css` as the actual CSS, not the live app's `globals.css`, it is missing `--outline` entirely and `--outline-variant` for three platforms, and its Tailwind mapping omits the whole surface family.
* No raw hex, pixel, or radius values in new code, everything must reference a token from colors.md or spacing.md.
* Kritisk, Vesentlig, Mindre alvorlig are the only three deviation tiers, and they are identical across every platform. No other orange, ever, Vesentlig is the only orange. Use `var(--vesentlig)` and `var(--mindre-alvorlig)`, never fall back to `var(--error)` for either.
* IconButton is `button.tsx`'s `size="icon"` variant, don't hand roll a new one.
* ConnectedButtonGroup and ListItem live in `assets/components/`, use them instead of copying markup from an existing page.
* Manrope is the only font for KSL, Nyt Norge, Spesialitet. LokalMat uses Messina Serif and Sands once those files are actually licensed, `tokens.css` falls back to Georgia until then, don't let it silently become a generic system sans. Never reintroduce Quatro.

## Keeping this current

This skill is meant to stay open for editing as the system grows. Log every change in `docs/journal.md`, what changed, why, and which files it touched, the same pattern used to build it. If a rule here ever conflicts with something newly confirmed in Figma or the app, update the reference file and note the change in the journal, don't leave two versions of the truth sitting in the repo.

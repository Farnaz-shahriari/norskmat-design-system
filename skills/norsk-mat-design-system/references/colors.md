# Colors

Source of truth, confirmed, the Figma variables export, one JSON per platform, generated from Material 3 Theme Builder plus manual additions for deviation severity. Not the app's current CSS or `severityColors.ts`, those have real drift, see "Known gaps" at the bottom.

## Shared, semantic, same across every platform

Deviation severity and error colors are identical across KSL, Nyt Norge, Spesialitet, LokalMat. Define these once, reuse everywhere.

| Tier | Main | On main | Container | On container | CSS variable |
|---|---|---|---|---|---|
| Kritisk, error | #BA1A1A | #FFFFFF | #FFDAD6 | #410002 | `--error`, `--error-foreground`, `--error-container`, `--error-container-foreground`, already wired app wide, keep using it |
| Vesentlig | #A84300 | #FFFFFF | #FDD19F | #3D2100 | `--vesentlig`, `--vesentlig-foreground`, `--vesentlig-container`, `--vesentlig-container-foreground`, new, not yet in globals.css |
| Mindre alvorlig | #705400 | #FFFFFF | #FFEDD0 | #3D2E00 | `--mindre-alvorlig`, `--mindre-alvorlig-foreground`, `--mindre-alvorlig-container`, `--mindre-alvorlig-container-foreground`, new, not yet in globals.css |

Vesentlig and Mindre alvorlig do not have real CSS variables in the app yet, only Kritisk does, reusing `--error`. Until the two new ones are added to `globals.css`, do not fall back to `--error` for a Vesentlig or Mindre alvorlig item, that mislabels the severity. Use the hex value directly and flag it as temporary, or add the variables first.

## Platform brand colors

### KSL

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #4A671E | #FFFFFF | #EFF1E7 | #284000 |
| Secondary | #365BAE | #FFFFFF | #DAE2FF | #174295 |
| Tertiary | #005D21 | #FFFFFF | #B3F2B3 | #00531C |

### Nyt Norge

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #00319E | #FFFFFF | #DCE1FF | #0039B5 |
| Secondary | #446900 | #FFFFFF | #C3E196 | #213600 |
| Tertiary | #4D6629 | #FFFFFF | #C9E79B | #344B11 |

### Spesialitet

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #594414 | #FFFFFF | #E5DBC9 | #221700 |
| Secondary | #212222 | #FFFFFF | #424242 | #DAD8D7 |
| Tertiary | #6B5D3E | #FFFFFF | #D3C19B | #3E3217 |

### LokalMat

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #A80000 | #FFFFFF | #E69D9D | #330000 |
| Secondary | #0D310D | #FFFFFF | #B1E6B1 | #0E330E |
| Tertiary | #424242 | #FFFFFF | #E6E6E6 | #333333 |

## Surfaces and background, per platform

| Token | KSL | Nyt Norge | Spesialitet | LokalMat |
|---|---|---|---|---|
| Background | #FFFFFF | #FFFFFF | #EFEADF | #FFFFFF |
| On background | #1A1C16 | #1A1B23 | #1E1B17 | #1B1C1A |
| Surface | #FFFFFF | #FFFFFF | #EFEADF | #FFFFFF |
| On surface | #1A1C16 | #1A1B23 | #1E1B17 | #1B1C1A |
| Surface variant | #E0E4D3 | #E0E1F4 | #ECE1D1 | #DFE4DC |
| On surface variant | #44483B | #434655 | #4D463A | #434842 |
| Outline | #74796A | #747686 | #7E7669 | #737872 |
| Outline variant | #C4C8B7 | #C4C5D7 | #D0C5B6 | #C3C8C0 |
| Surface bright | #FAFAF0 | #FAF8FF | #FFF8F2 | #FBF9F6 |
| Surface dim | #DADBD1 | #D9D9E4 | #E0D9D2 | #DBDAD7 |
| Surface container lowest | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| Surface container low | #F4F4EA | #F3F2FE | #FAF2EB | #F5F3F0 |
| Surface container | #EEEEE4 | #EDEDF8 | #F4EDE5 | #EFEEEB |
| Surface container high | #E9E9DF | #E8E7F3 | #EEE7E0 | #E9E8E5 |
| Surface container highest | #E3E3D9 | #E2E1ED | #E8E1DA | #E4E2DF |

## Inverse surfaces and scrim, per platform

For the few surfaces Material 3 draws inverted, the plain tooltip, the snackbar and a slider's value label. Values are the Inverse and Scrim roles of each platform's Figma scheme, `source-tokens/`. Scrim sits behind modal dialogs and sheets at 32%, `bg-scrim/32`, it is the same black everywhere, so it lives in the shared block.

| Token | KSL | Nyt Norge | Spesialitet | LokalMat |
|---|---|---|---|---|
| Inverse surface | #2F312B | #2E3039 | #2E3039 | #30312F |
| Inverse on surface | #F1F1E7 | #F0F0FB | #F7EFE8 | #F2F0ED |
| Inverse primary | #AFD27C | #B7C4FF | #E2C387 | #FFB4A8 |
| Scrim | #000000 | #000000 | #000000 | #000000 |

Every inverse pair is checked by `npm run lint:contrast`, inverse on surface is about 11.5:1 on inverse surface, inverse primary about 7.7:1. See open gap 19 about Spesialitet's inverse surface.

## Known gaps, audited against the component library, not assumed

Run `npm run lint:tokens` from the repo root for the live version of this list. It checks every component for undefined variables, raw hex, radius name collisions, off scale radius and spacing, and text sized outside the named scale.

### Fixed

1. `--outline` did not exist as a variable anywhere, for any platform. That is why `switch.tsx` and the text input family hardcoded raw hex, there was nothing to reach for. **Fixed in `src/styles/tokens.css`** and in the components.
2. `--outline-variant` was missing for Nyt Norge, Spesialitet and LokalMat, KSL was the only platform that had it. **Fixed in `src/styles/tokens.css`.**
3. The `@theme inline` mapping was incomplete, `outline`, `outline-variant` and the entire surface family were never exposed as Tailwind classes even though the raw variables existed, so `bg-surface-variant` silently did nothing. **Fixed**, mapping is complete.
4. `src/app/utils/severityColors.ts` in the app has Vesentlig's container as `#ffddcc` / `#4a2800`, should be `#FDD19F` / `#3D2100`. Correct here, still wrong in the app.
5. `globals.css` brand and surface tokens had drifted from this file, most for LokalMat. **Resolved**, `src/styles/tokens.css` ships the correct value for every platform, use it rather than the app's copy.
6. `inline-editable-list-item.tsx` used an orphan orange, `#663C00` / `#FF9800` / `#FFF4E5`, as its warning chip. Confirmed a mistake, **fixed**, now uses the Vesentlig variables. No other orange belongs anywhere.
7. `--input-background` was referenced by a consuming app and defined nowhere. **Fixed**, aliased to `var(--background)`.
8. **The sidebar colour family did not exist.** `sidebar.tsx` needs `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border` and `--sidebar-ring`, none of which were defined, so a sidebar rendered untinted on every platform. **Fixed**, defined as aliases onto the surface family, `--surface-container-low` for the ground and the standard secondary container treatment for the selected item, and mapped into `@theme` so `bg-sidebar` generates. These are aliases, not new colours. If a sidebar should be its own distinct surface, change those six lines and nothing else.
9. **A shadow wrapped a hex value in `hsl()`.** `sidebar.tsx` had `shadow-[0_0_0_1px_hsl(var(--sidebar-border))]`, and `hsl()` around a hex is invalid CSS, so the rail handle had no outline at all. **Fixed**, wrappers dropped. Every colour in this system is hex, never wrap one in a colour function.
10. **`--radius-xl` collided with Tailwind's own radius scale.** Tailwind defines `--radius-xs/sm/md/lg/xl/2xl` itself. Declaring `--radius-xl: var(--radius-dialog)` in `:root` silently changed every `rounded-xl` in the library, which took `card.tsx` from its correct 12px to 28px with nobody editing card.tsx. **Fixed**, the alias is gone, `bottom-sheet.tsx` names `--radius-dialog` directly, and `card.tsx` and `list-item.tsx` name `--radius-card`. Note `--radius-sm` shares a name too but happens to hold the same 4px, so `rounded-sm` is unaffected, keep those values in step. Never add `--radius-md`, `--radius-lg`, `--radius-xl` or `--radius-2xl` here.
11. **Nothing enforced any of this.** `npm run lint:tokens` now does, and fails a build on undefined variables, raw hex, or a radius name collision.

12. **A bare `border` class drew in `currentColor`, and the page had no text colour or font.** Tailwind's preflight sets no border colour, so Card, Alert, Table, Accordion and Sheet edges came out near black, and text without a named class, plus everything in a Radix portal, rendered in a system font and plain black. **Fixed**, the base layer of `tokens.css` now defaults borders to `--outline-variant` and sets `font-family` and `color: var(--foreground)` on `:root` and every theme class. A control still names its own border, `border-outline`.

### Still open

13. Messina Serif and Sands, LokalMat's fonts, are not licensed or loaded anywhere. `src/styles/tokens.css` falls back to Georgia so headings do not silently drop to a generic system sans. Cannot be fixed from here, it needs the real font files.
14. **Around 40 radius usages are not on the radius tokens**, `rounded-md` in 18 files, `rounded-lg` in 10, plus `rounded-2xl`, `rounded-xs` and `rounded-[2px]`. spacing.md's rule says six values only, so these are real violations, but which token each becomes is a per component design decision, the Material 3 restyle settles most of them, docs/m3-audit.md. The linter lists them. Chip's `rounded-[8px]` and the extended FAB's `rounded-[16px]` now use `--radius-chip` and `--radius-fab`.
15. **25 components size text with Tailwind's `text-*` scale** instead of the named type classes, not six as this list previously claimed. They are almost all Radix primitives, so leaving them may be right, but it should be a decision rather than an accident.
16. **Four spacing values sit off the scale**, `max-h-[300px]` in command.tsx, `max-w-[400px]` and `max-h-[320px]` in date-picker.tsx, and `py-[14px]` in tabs.tsx. The picker maximums are arguably fine, the tab padding is not.
17. Vesentlig's main colour `#A84300` is still not wired into the live app, and one real component collapses Vesentlig and Mindre alvorlig into the same yellow icon colour. The three tier system is not fully implemented in the app UI. Different repo, this system cannot fix it.
18. Beskyttede Betegnelser and Stiftelsen Norsk Mat have logos in `assets/` but no palette and no theme class. Do not build a themed screen for either until their tokens are decided.
19. **Spesialitet's inverse surface is bluish, #2E3039, the exact value of Nyt Norge's.** Every other Spesialitet neutral is warm, and the Spesialitet palette's own Neutral 20, which Material 3 derives inverse surface from, is #33302C. It looks like a copy from Nyt Norge in the Figma scheme. `tokens.css` uses the Figma value as it stands, change it in Figma first if #33302C is right, then here.

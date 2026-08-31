# Components

Source, the 67 component files in the shared UI library (`ui.zip`), audited file by file against the token system in colors.md. Each file below is tagged by what it actually needs, not by guesswork.

## Tier 1, atomic, ready to use

No color issues found, either fully token based or purely structural with no color of its own.

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, bottom-sheet, breadcrumb, button, calendar, card, carousel, chart, checkbox, chip, collapsible, command, context-menu, dialog, divider-with-subtitle, drawer, dropdown-menu, fab, form, hover-card, input, input-otp, label, list-item, material-checkbox, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, scrolling-fab, select, separator, sheet, sidebar, skeleton, slider, sonner, table, tabs, textarea, time-picker-dropdown, time-picker, toggle, toggle-group, tooltip

`new-file.tsx` looks like a stray leftover file, empty or placeholder, worth deleting rather than carrying forward.

## Tier 2, needs a token fix, real platform bleed risk

These hardcode literal hex values instead of reading the CSS variables, meaning they will render KSL's colors even inside Nyt Norge, Spesialitet, or LokalMat, silently wrong the moment they are reused outside KSL.

* `switch.tsx`, the worst case, hardcodes three separate KSL specific colors directly, `#74796A` KSL outline, `#E3E3D9` KSL input border, `#4A671E` KSL primary green. A Nyt Norge switch would still render KSL green today.
* `editable-text-field.tsx`, `number-input-with-icon.tsx`, `text-input-field.tsx`, `text-input-with-icon.tsx`, `time-picker-with-icon.tsx`, `radio-button.tsx`, all hardcode `#44483B`, which is specifically KSL's on surface variant color, every other platform has a different value for this, so error text or helper text in these fields will look off brand outside KSL. Same files also hardcode `#BA1A1A` for error text, which is harmless since error is shared across every platform, but should still reference `var(--error)` rather than a literal value, for consistency.

Fix, in every case, swap the literal hex for the matching CSS variable, `var(--on-surface-variant)`, `var(--error)`, `var(--primary)`, `var(--outline)`, `var(--input)`.

## Tier 3, resolved

`inline-editable-list-item.tsx` hardcoded three colors that matched nothing in colors.md, `#663C00`, `#FF9800`, `#FFF4E5`. Confirmed, this was a mistake, not a real fourth tier. Replace with Vesentlig, `#A84300` main, `#FDD19F` / `#3D2100` container. No other orange belongs anywhere in the system.

## Tier 4, built

* **ConnectedButtonGroup**, `assets/components/connected-button-group.tsx`. Replaces the markup independently copy pasted into at least 7 files. Supports single select, radiogroup semantics, and multi select, checkbox group semantics, same visual pattern either way, rounded pill container, 2px gap, selected segment uses `secondary-container`, unselected uses transparent with a hover state. Sizes, `default` and `sm`.
* **ListItem**, `assets/components/list-item.tsx`, rebuilt in place of the older single variant version. Adds the `default` and `compact` densities that already existed as one off Figma exports, `0 Density` and `-4 Density`, plus an optional overline label, trailing text, trailing icon, and a selected state using `secondary-container`, matching the pattern used across `ConnectedButtonGroup` and elsewhere in the system.
* **IconButton**, kept as is, per your call. The variant already exists inside `button.tsx`, `size="icon"`, `size="icon-sm"`, `size="icon-xs"`, it is simply under used today, 16 correct usages against 42 hand rolled copies. No new component needed, the fix going forward is discipline, point new icon buttons at the existing variant rather than hand rolling another one.

## Approach for anything built from here forward

Use the open source Material 3 spec and reference implementations for anatomy and behavior only, never for color or token values, wire everything to the variables in colors.md, the same rule we used for the color audit. For ConnectedButtonGroup specifically, Google's own open source segmented button implementation is still incomplete and unmaintained upstream, so your own repeated Figma pattern was the better and more current reference, that is what got built above. Keep this pattern to avoid reintroducing the kind of drift we already found twice.

# Material 3 audit of `src/components/`

Audited 2026-10-22 on `storybook-design-sync` at `c0c1016`. The goal behind it: every component Material 3, keeping the Radix + Tailwind + cva base (restyle, not rewrite), in all four brand themes from `tokens.css`.

## Restyle status, 2026-10-22

The restyle below has been carried out: the Phase 0 foundations, then six groups. The status tables further down are the audit as it stood *before*; this section is the current state.

| Group | Components | Main changes |
|---|---|---|
| 0 Foundations | `tokens.css` | Inverse roles and scrim; state-layer and disabled opacities; `--radius-chip` and `--radius-fab`; `title-small` and `body-small`; base layer with page font, text colour and default border colour; the `state-layer` class |
| 1 Layout & info | Card, Table, Alert, Badge, Breadcrumb, Accordion | Card: outlined (default) and new `filled` variant, 16dp padding, title and description roles. Table: 56dp rows, title-small headers, selected rows tinted primary 12%. Alert: tonal containers. Badge: M3 large-badge shape used as a label. Accordion rows as list items with a state layer |
| 2 Actions | Button, Pagination, Chip, ConnectedButtonGroup, Fab, ScrollingFab, Toggle, ToggleGroup | State layers and M3 disabled everywhere. Button: new `tonal` variant, primary label on the outlined variant. Fab: M3 corner per size, no shadow, an outline-variant border on the two light variants. ConnectedButtonGroup: `--outline` border, as M3 segmented buttons and the contrast rule ask. Pagination: 40dp, active page tonal |
| 3 Navigation & selection | Tabs, ListItem, Switch, Progress, StatusChip, Slider, Separator, DividerWithSubtitle | Tabs: `tablist`/`tab` roles, `aria-selected`, arrow keys with Home and End, one Tab stop; TabLarge as M3 primary tab. Switch: 40dp halo, 28dp pressed handle. Progress: 4dp track. Slider: M3 2023 bar handle |
| 4 Forms | Label, Input, Textarea, Select trigger, Checkbox, RadioGroup, MaterialCheckbox, RadioButton, OutlinedTextField, Form, InputOTP, the six inline-edit fields | Fields are M3 outlined: 56dp, 4dp, `--outline`, 2dp primary on focus, error when invalid. Checkbox 18dp and radio 20dp with a 40dp halo. OutlinedTextField cuts its label notch from the outline (fieldset and legend) and gains `error` and `supportingText`. Faint `--border` control borders in the inline-edit fields moved to `--outline` |
| 5 Overlays | Dialog, AlertDialog, Sheet, DropdownMenu, ContextMenu, Menubar, Select menu, Popover, HoverCard, Tooltip, Sonner, Drawer, BottomSheet | 32% scrim; no shadows; dialogs 28dp on surface-container-high with headline-small; sheets with M3 corners; menus 4dp, 48dp label-large items, highlight as a 10% state layer; Tooltip is the M3 plain tooltip on inverse surface; Sonner is the M3 snackbar |
| 6 Pickers & extras | Calendar, DatePicker, DateTimePicker, TimePicker, TimePickerDropdown, TimePickerWithIcon, Sidebar, NavigationMenu, Command, Chart, Avatar, Skeleton, Resizable, ScrollArea | Picker fields as outlined fields (their 2px `--border` outline was too faint for a control), picker surfaces surface-container-high without shadows, quick picks as chips. Calendar as the M3 date grid. DatePicker's calendar button gained an accessible name |

**How each group was checked.** `lint:tokens`, `lint:a11y`, `lint:contrast`, the build and the type check, then a Storybook build with every story rendered headless and run through axe (WCAG 2.2 AA). Each run also checked controls on a too-faint border, inherited fonts, shadows and console errors, compared with a baseline taken before Group 1. Every group came back with no new problem. Across the whole run:

- **axe:** `button-name` went from 16 nodes to 0. The only rule still failing is `aria-hidden-focus` on the open Select and DropdownMenu stories, which is Radix hiding the page behind a modal menu.
- **Shadows:** component shadows in stories went from 48 to 0.
- **`lint:tokens` warnings:** 41 to 5.
- **Library scan:** shadcn role names went from 674 to 62. Those 62 are the focus-ring role, Button's outlined border kept by decision, M3's own secondary on Fab, and the Sidebar's `sidebar-*` aliases, which resolve to the surface family.
- **Raw `text-*` sizes:** 69 to none.

**Still not Material 3, deliberately or pending a decision:**

- Spesialitet's secondary-container is #424242. Every M3 "selected" state (chips, list rows, segments, the active page, Toggle) renders dark grey there. Table rows use a primary tint instead, because their content keeps its own colours.
- Badge is styled as an M3 large badge but still used as a tag. Whether it should become a count is a design call.
- ListItem keeps its 12dp corners (a design call). Sidebar keeps its compact item heights: M3 navigation drawer items are 56dp, but its collapse logic depends on the current sizes.
- The duplicates are restyled but not merged: MaterialCheckbox and Checkbox, RadioButton and RadioGroup, BottomSheet and Drawer, ScrollingFab and Fab, ConnectedButtonGroup and ToggleGroup. Merging changes APIs.
- The custom pickers still lack grid and listbox semantics, and BottomSheet still has no dialog role or focus trap. Rebasing them on Calendar and Drawer is the fix.
- Command, HoverCard, Menubar and NavigationMenu were restyled, not dropped. Dropping needs a check of the apps first.
- Claude Design is not re-synced. Every component's source changed, so the next `/design-sync` re-grades all of them. Story titles and `OpenKSL` exports are unchanged.

## Summary

68 component files (plus `utils.ts`, `use-mobile.ts`, `date-format.ts`, which have no UI).

| Status | Count | |
|---|---|---|
| M3-done | 10 | Right anatomy, sizes, shape and colour roles. What's left is the library-wide state-layer and disabled treatment, plus small fixes. |
| Partly M3 | 19 | Some M3 anatomy or roles, but shape, colour, size or elevation still off, or a custom build that duplicates a Radix one. |
| shadcn-only | 39 | Stock shadcn/ui classes, sizes and roles. 17 are used in stories; 22 are extras no story or the Theme explorer uses. |

Five findings cut across the whole library:

1. **No component has M3 state layers.** Hover is `hover:bg-muted`, `hover:bg-primary/90` or `hover:brightness-95`; disabled is `opacity-50` everywhere. M3 needs 8% hover, 10% focus and 10% pressed overlays in the content colour, and 38% content / 12% container when disabled. There are no tokens for any of it yet.
2. **The foundations are incomplete for M3.** The shape scale lacks small (8dp) and large (16dp). The colour roles lack inverse-surface, inverse-on-surface, inverse-primary and scrim. The type classes lack body-small and title-small. Details in Foundations below.
3. **shadcn colour names already resolve to M3 values, but some are used with the wrong meaning.** `tokens.css` maps `muted` to surface-container, `accent` to secondary-container, `popover` to surface-container, `card` to surface, `border` to outline-variant and `input` to surface-container-highest. Renaming is cosmetic for most, but three uses are wrong for M3:
   - Menus highlight the focused item with `accent` (secondary-container), which is M3's *selected* colour, not a focus state.
   - `bg-secondary` is M3 secondary here, so shadcn's "neutral" secondary Badge renders saturated blue in KSL and near-black in Spesialitet.
   - Skeleton pulses in `accent`, a blue tint in KSL.
4. **24 components use real shadows,** against the repo rule of borders, not shadows. They are listed under Elevation below. M3 already expresses elevation mainly through tonal surface containers, so the rule and M3 fit: tonal surface plus an `outline-variant` border, no shadow.
5. **The custom (non-Radix) components carry the a11y risk.** Tabs has no `tablist`/`tab` roles, `aria-selected` or arrow keys. BottomSheet closes on Escape but has no dialog role or focus trap. The DatePicker and TimePicker family have no grid or listbox semantics. `lint:a11y` (jsx-a11y) does not catch any of these. Restyling them is the moment to move them onto the Radix primitive or library the repo already ships.

Two corrections to the starting assumptions:

- **Tabs is not stock shadcn.** `tabs.tsx` is a custom M3 secondary-tabs build (`Tab`, `TabCompact`, `TabLarge`, `TabGroup`), visually close to M3 but without Radix.
- **Several "extras" have an M3 counterpart:** Sonner (snackbar), Carousel (carousel), Sidebar (navigation drawer), Drawer (bottom sheet), ContextMenu (menu), Calendar (date picker), Slider (slider), Toggle and ToggleGroup (icon toggle, connected button group). They are restyle candidates, not drops.

Fab, MaterialCheckbox and RadioButton look M3 but land in partly M3 below, for specific off-spec details.

## How this was checked

- Every `.tsx` file in `src/components/` was scanned for radius classes, colour roles (M3 vs shadcn vs raw), type classes vs raw `text-*`, state classes, `shadow-*` and heights. Every file whose verdict wasn't obvious from the scan was then read in full.
- M3 values are from the Material 3 spec, baseline 2023. M3 Expressive (2025) is used only where the repo already follows it: the 56dp default button, and ConnectedButtonGroup, which is M3 Expressive's connected button group.
- "Uses" is JSX occurrences in source across the 31 story files (S) and `stories/examples/theme-explorer.tsx` (E). "Not in stories" says nothing about the apps, which weren't checked. Check app imports before dropping anything.

## Foundations the restyle needs first

| M3 needs | `tokens.css` today | Gap and proposal |
|---|---|---|
| Shape scale: none, extra-small 4, small 8, medium 12, large 16, extra-large 28, full | `--radius-sm` 4, `--radius-card` 12, `--radius-dialog` 28, `--radius-button` full | Missing small (8: chips; small FAB 12 = card) and large (16: FAB, extended FAB, modal side sheet, nav drawer). Chip and Fab hardcode `rounded-[8px]` and `rounded-[16px]` today. Add component-named tokens in the repo's convention, e.g. `--radius-chip: 8px`, `--radius-fab: 16px`. Never `--radius-md/lg/xl/2xl` (SKILL.md rule). |
| State layers: hover 8%, focus 10%, pressed 10%, dragged 16%; disabled content 38%, container 12% | Nothing | Add opacity tokens and one `@utility` that paints a `::before` in `currentColor` at those opacities on `:hover`, `:focus-visible` and `:active`. Then replace `hover:bg-muted`, `hover:bg-primary/90`, `hover:brightness-*` and `opacity-50` component by component. |
| Colour roles | All core roles in all four themes: primary/secondary/tertiary/error and their containers, surface, surface-container-lowest to -highest, surface-variant, on-surface(-variant), outline, outline-variant. `*-foreground` = M3 `on-*`. | Missing inverse-surface, inverse-on-surface and inverse-primary (plain tooltip, snackbar, slider value label), and scrim. They need a value in each theme block and a `lint:contrast` pass. |
| Type roles | `headline-medium/small`, `title-large/medium`, `body-large/medium`, `label-large/medium/small/xsmall` | Missing `body-small` (12/16: supporting text, plain tooltip, floating label) and `title-small` (tabs, rich tooltip subhead, list subheaders). Two repo values differ from M3 baseline: `label-medium` is 14px (M3 12) and `title-medium` 18px (M3 16). They come from Figma; keep them and map components by role. |
| Raw `text-*` sizes | `tokens.css` redefines `--text-lg/xl/2xl/4xl` unlayered, the variables Tailwind's `text-*` utilities read | So `text-lg` in a stock component renders 22px (the repo's title-large size) with Tailwind's 1.556 line-height; DialogTitle is one. Replacing raw sizes with roles, which the restyle does anyway, removes the mix. |
| Elevation levels 0–5 | `--elevation-sm: none`; rule: borders, not shadows | Map by tonal surface: level 0 surface; level 1 surface-container-low; level 2 surface-container; level 3 surface-container-high. Add a 1px `outline-variant` border on surfaces that float without a scrim (menus, popovers, rich tooltips, FAB on content). Modals keep a 32% scrim; that's not elevation. |
| Base styles | No default border colour; no page font or body colour | Bare `border` is `currentColor` (dark) in Card, Alert, Table, Accordion and Sheet. Set a base border colour of `outline-variant`. The page font and body colour are the known library issues in `.design-sync/NOTES.md`; fix them first, since every restyled component inherits them. |
| Sizes | `--height-sm` 32, `--height-md` 40, `--height-lg` 56 | These cover chips, buttons and fields. Add `--touch-target: 48px` for checkbox, radio, switch, icon buttons and chips, whose visible size is smaller than M3's 48dp target. |
| Focus indicator | 2px `--ring` (primary) with offset, from the WCAG pass | M3 specifies 3dp secondary. Keep primary: it passed `lint:contrast` in all four themes. Any change re-runs it. |

## Status by component

### M3-done (10)

| Component | M3 counterpart | Uses | What's missing |
|---|---|---|---|
| Button | Common buttons (filled, outlined, text) and icon buttons | S 28 (8 files) · E 3 | State layers (hover is `bg-primary/90`, `bg-muted`); disabled `opacity-50`; no tonal (secondary-container) variant; label is `label-medium` (same 14px values as M3 label-large). Icon sizes 56/48/40 vs M3's 40dp button in a 48dp target. Default 56dp is M3 Expressive "medium", `sm` 40dp is M3 "small". `secondary` keeps `--border` by decision. |
| Chip | Assist / filter chip | S 7 · E 3 | 32dp, outline border and secondary-container selected are right. Radius is raw `rounded-[8px]` (needs a token). State layers; disabled; `sm` 28dp is not an M3 size. |
| ConnectedButtonGroup | M3 Expressive connected button group / segmented button | S 3 · E 2 | 40dp, full radius, 2dp gap, secondary-container + check, label-large are right. State layers; disabled. Container border is `--outline-variant` where M3 segmented and our control-border rule say `--outline`; check. `sm` 36dp is off-scale. Long labels overflow below ~300px (known). |
| DividerWithSubtitle | Divider with subheader | — | Divider uses `border` (= outline-variant) by alias name. M3 subheader is title-small on-surface-variant; this uses label-large. |
| ListItem | List item | S 5 · E 2 | 56dp one-line, body-large headline, label-small overline and secondary-container selected are right. State layers; supporting text is `label-medium` (M3 body-medium); default padding 24dp (M3 16dp leading). Every row has 12dp corners: M3 rows are square except in segmented lists, a design call. No 72/88dp two/three-line heights. |
| OutlinedTextField | Outlined text field | S 1 | 56dp, 4dp, `--outline`, primary focus, body-large input and floating label are right. The label notch is painted `bg-background`, wrong on any other surface. Floating label should be body-small. No hover outline (on-surface), error state or supporting text. Disabled is `opacity-50` + `bg-muted` (M3: no fill, 38%/12%). Focus is a 1px border plus 1.5px ring, not a 2dp border. |
| Separator | Divider | — | 1px `bg-border` (= outline-variant). Only the role name; no inset variants. |
| StatusChip | No exact counterpart; closest is a non-interactive assist chip | S 4 · E 2 | 32dp, 18dp icon, primary-container and status by icon + text are right. Radius is `var(--radius)` 4dp (M3 chip 8dp). `text-foreground` alias. |
| Switch | Switch | S 1 · E 1 | 52×32 track, outline/primary roles and 16/24dp handle are right. Missing: 40dp state-layer halo, 28dp pressed handle, disabled 12%/38% (now `opacity-50`), optional icons. The handle is `bg-white` and should be the on-primary token. |
| Tabs | Secondary tabs (`Tab`, `TabCompact`), primary-like (`TabLarge`) | S 1 · E 2 | 48dp, 2dp primary indicator and on-surface / on-surface-variant labels are right. **Not Radix: no `tablist`/`tab` roles, `aria-selected` or arrow keys.** Move onto `@radix-ui/react-tabs` when restyling. Primary-tab indicator should be 3dp, content-width, with a primary label. Label role title-small; state layers; `TabCompact` 40dp is off-scale; no divider under the row. |

### Partly M3 (19)

| Component | M3 counterpart | Uses | What's missing |
|---|---|---|---|
| Card | Card: outlined / filled (elevated maps to outlined under our rule) | S 25 · E 19 | 12dp via `--radius-card` is right. Bare `border` renders `currentColor`, should be outline-variant. `bg-card` alias; no filled variant (surface-container-highest); CardTitle and CardDescription have no type role (title-medium, body-medium); 24dp padding and gaps vs M3 16dp. |
| Fab | FAB, extended FAB | S 14 · E 1 | Sizes 40/56/96 and the primary, primary-container, secondary, tertiary and surface colours are right. Icon FAB is a circle (M3: 12/16/28dp by size); extended uses raw `rounded-[16px]`. Hardcoded rgba shadow (level 3) breaks borders-not-shadows. Hover and press use `brightness()` filters; disabled `opacity-50`; default variant `primary` (M3 default primary-container). |
| ScrollingFab | Extended FAB collapsing on scroll | — | `rounded-full` (M3 16dp), `shadow-lg`, label-medium (M3 label-large). Duplicates Fab `extended`; fold it in. |
| MaterialCheckbox | Checkbox | — | Custom over a native input. 20px box (M3 18dp), 4dp corner (M3 2dp), unselected border `foreground` (M3 on-surface-variant), check `text-white` (on-primary), no 40dp state layer or 48dp target, disabled `opacity-50`. Duplicates the Radix Checkbox; fold its look into `checkbox.tsx`. |
| RadioButton | Radio button | — | 20dp ring in on-surface-variant is right. Selected fills the whole circle primary with an on-primary dot (M3: primary ring, 10dp primary dot, hollow between). References `text-on-secondary-container`, which doesn't exist. No state layer. Duplicates the Radix RadioGroup; fold it in. |
| Progress | Linear progress indicator | S 1 · E 1 | Primary indicator and full radius are right. 8dp track (M3 4dp); track `primary/20` (M3 secondary-container); no stop indicator or gap; no circular variant. |
| Pagination | No M3 equivalent; built on Button | S 58 | Page links use Button `size="icon"`, 56dp circles (use 40dp). The active page is outlined `secondary` (use secondary-container, like a selected segment). Ellipsis `size-9`; prev/next 56dp tall. |
| BottomSheet | Modal bottom sheet | — | 28dp top corners, handle and title-large are right. `bg-background` (M3 surface-container-low); `shadow-lg`; scrim `black/40` (M3 32%); handle 40×4 (M3 32×4 on-surface-variant). Escape closes it (from the WCAG pass), but there's **no `role="dialog"`, `aria-modal` or focus trap**; rebuild on the vaul Drawer or Radix Dialog. |
| DatePicker | Date picker (docked / modal) | S 1 | Type roles and primary selection are right. Radii are Tailwind `rounded-lg/2xl` (8/16px) not tokens (M3: 28dp modal, 40dp day circles); 41 uses of shadcn aliases (`foreground`, `muted`, `border`, `muted-foreground`); `shadow-2xl`. **No grid semantics.** Rebase on `calendar.tsx` (react-day-picker), which has them. Trailing text overflows narrow fields (known). |
| DateTimePicker | Date + time picker | — | Same issues as DatePicker. |
| TimePicker | Time picker | — | Same aliases, radii and shadow. M3's time picker is a dial or 96×80dp time-selector cells in display-large; ours is a scrolling list. No listbox semantics. |
| TimePickerDropdown | Time picker (menu form) | — | `--radius-dialog` is right; `shadow-2xl`; `background`/`border` aliases. |
| TimePickerWithIcon | Time input field | — | 650 lines: 30× `rounded-lg`, 44× `foreground`, 30× `border`, 21× `bg-muted`, 3× `shadow-2xl`. |
| TextInputField | No direct counterpart: inline-edit row with M3 type | S 1 · E 1 | body-large / label-small, radius tokens and the 40dp full-radius icon button are right. Icon hover fills primary-container instead of a state layer. The edit field is always `border-2 border-primary` (M3: 1dp outline, 2dp primary on focus). Figma-export markup (absolute insets, `content-stretch`). Label collapses beside the chip below ~290px (known). |
| TextInputWithIcon | Same family | — | Same as TextInputField. |
| NumberInputWithIcon | Same family | — | Same as TextInputField. |
| EditableTextField | Same family | — | Same as TextInputField. |
| ClickToEditTextarea | Same family | — | Same, plus `background`/`border`/`muted` aliases. |
| InlineEditableListItem | List item + inline edit | — | label-small/body roles and Vesentlig/error tokens are right. `muted`/`accent` aliases; arbitrary `text-[var(--…)]` classes; hover `bg-muted`. |

### shadcn-only, used in stories (17)

| Component | M3 counterpart | Uses | What's missing |
|---|---|---|---|
| Table | No M3 equivalent | S 48 · E 16 | `text-sm` everywhere; header `h-10` font-medium; rows `hover:bg-muted/50`, selected `bg-muted`; bare `border-b` (`currentColor`). Restyle: body-medium cells; title-small header in on-surface-variant; outline-variant dividers; secondary-container selected; 52–56dp rows; state layer. |
| Accordion | No M3 equivalent (M2 expansion panel) | S 30 | `rounded-md`, `text-sm font-medium`, `hover:underline`, bare `border-b`. Restyle as list rows: 56dp trigger, body-large/title-medium, on-surface-variant chevron, outline-variant divider, state layer. |
| Breadcrumb | No M3 equivalent | S 33 · E 7 | `text-sm text-muted-foreground`, `hover:text-foreground`. Restyle: body-medium on-surface-variant links, on-surface current page, separators in on-surface-variant. |
| Alert | No M3 equivalent (transient messages are snackbars) | S 15 · E 3 | `rounded-lg` (8px, no token), bare `border`, `bg-card`, `text-sm`; destructive only recolours text. Restyle: 12dp, tonal containers (error-container, vesentlig-container, primary-container…), title-small title, body-medium text, outline-variant border. |
| Badge | Two meanings: a count or dot is an M3 badge; a tag is a chip | S 12 (2 files) · E 1 | `rounded-md`, `text-xs font-medium`. `secondary` is M3 secondary (blue in KSL, near-black in Spesialitet); `destructive` uses `text-white`. M3 badge: error/on-error, full radius, 6dp dot or 16dp with label-small. Decide whether Badge is the count or the tag; StatusChip already covers tags. |
| Label | No M3 component (text-field label) | S 8 (8 files) · E 1 | `text-sm font-medium`, disabled `opacity-50`. Restyle: label-large or body-small by context; disabled 38%. |
| AlertDialog | Basic dialog | S 9 | `rounded-lg` 8px (M3 28dp, `--radius-dialog`); `bg-background` (M3 surface-container-high); `shadow-lg`; scrim `black/50` (M3 32%); title `text-lg` (renders 22px) → headline-small; description `text-sm` muted → body-medium on-surface-variant. |
| Dialog | Basic dialog; full-screen dialog on mobile | S 8 | As AlertDialog. The close button uses `rounded-xs opacity-70` and `data-[state=open]:bg-accent`; make it an icon Button. |
| Sheet | Modal side sheet; bottom sheet when `side="bottom"` | S 8 | `bg-background` (M3 surface-container-low); `shadow-lg`; scrim `black/50`; no corners (M3: 16dp on the inner edge for side, 28dp top for bottom); title `font-semibold` → title-large. The close button highlights with `bg-secondary`, M3 secondary blue. |
| Select | Exposed dropdown menu (outlined field + menu) | S 8 | Trigger 36dp, `rounded-md`, `text-sm` → 56dp outlined field, 4dp, body-large. Content: same fixes as DropdownMenu. `shadow-md`. |
| DropdownMenu | Menu | S 7 | `rounded-md` (M3 4dp); `bg-popover` (= surface-container, right value); `shadow-md`; items `text-sm py-1.5`, ~32dp (M3 label-large, 48dp); focus `bg-accent` reads as selected (M3: 10% state layer). Keep the destructive variant, in error. |
| Checkbox | Checkbox | S 4 (3 files) | Radix, keep. 16px box (M3 18dp), `--radius-sm` 4dp (M3 2dp), `shadow-xs`, no 40dp state layer or 48dp target, `opacity-50`. Absorb MaterialCheckbox's look. |
| Tooltip | Plain tooltip | S 4 | `bg-primary` (M3 inverse-surface, which needs adding), `rounded-md` (M3 4dp), `text-xs` (M3 body-small), arrow (M3 plain tooltips have none). |
| Popover | No M3 equivalent (closest: menu surface or rich tooltip) | S 3 | `rounded-md`, `bg-popover`, `shadow-md`. Restyle: surface-container, 12dp, 1px outline-variant border, body-medium. |
| RadioGroup | Radio button | S 2 | Radix, keep. 16px (M3 20dp), `shadow-xs`, no state layer. Absorb RadioButton's look. |
| Textarea | Outlined text field, multi-line | S 2 (2 files) | `rounded-md`, `text-base md:text-sm`, 3px `ring/50` focus. → 4dp, body-large, 16dp padding, 2dp primary focus border; keep the `--outline` border. |
| Input | Outlined text field | S 1 | 36dp (M3 56), `rounded-md` 6px (M3 4dp), `text-base md:text-sm`, 3px `ring/50` focus. Match OutlinedTextField, or make Input the bare field OutlinedTextField wraps. |

### shadcn-only extras, not in stories (22)

| Component | M3 counterpart | Recommendation | What's missing / why |
|---|---|---|---|
| Sonner | Snackbar | **Restyle** | inverse-surface / inverse-on-surface, 4dp, body-medium, label-large action in inverse-primary. Needs the inverse tokens. |
| Sidebar | Navigation drawer (and rail) | **Restyle**, last: largest file, 726 lines | Already aliases the surface family. Items 56dp; secondary-container full-radius active indicator; label-large; modal drawer surface-container-low with 16dp end corners. Remove `shadow-sm` and the ring-shadows. |
| Drawer (vaul) | Bottom sheet | **Restyle**, and make it the only bottom sheet | Gives drag and dialog semantics. Port BottomSheet's 28dp top, handle and title, then retire BottomSheet. |
| ContextMenu | Menu | **Restyle** with DropdownMenu (one shared menu class set) | Same issues as DropdownMenu. Right-click is desktop-only; check app use. |
| Calendar (react-day-picker) | Date picker grid | **Restyle**, as the base for the M3 date picker | Accessible grid and keyboard handling. 40dp day circles; primary selected; 1dp primary ring for today; body-large days. `accent` and `rounded-md` today. |
| Slider | Slider | **Restyle** | Track is already 16px. Inactive track `bg-muted` → secondary-container; 16px circle handle → M3 4×44dp bar; inverse-surface value label; drop `shadow-sm`. |
| ToggleGroup | Connected button group | **Keep as the behaviour base** | Radix roving focus and arrow keys. Rebuild ConnectedButtonGroup's look on it, then retire one of the two. |
| Toggle | Icon button, toggle | **Restyle** | Radix Toggle gives `aria-pressed`. Use Button's icon sizes and colours with a selected state. |
| Carousel | Carousel | **Keep**; restyle when first used | 28dp item corners, 8dp gaps, nav via icon Buttons. |
| Avatar | None (M3 lists use 40dp avatars) | **Keep, restyle** | Fallback `bg-muted` → primary-container / on-primary-container; title-medium initials. |
| Skeleton | None | **Keep, restyle** | `bg-accent` (a blue tint in KSL) → surface-container-highest; radius from a token. |
| InputOTP | None | **Keep** if sign-in uses it, else drop | Cells as outlined fields: 4dp, `--outline`, body-large, primary focus. |
| Form (react-hook-form) | None | **Keep** | FormMessage → body-small in error; FormDescription → body-small on-surface-variant. |
| Chart (recharts) | None | **Keep** | Tooltip box `rounded-lg shadow-xl` → surface-container + outline-variant border + body-small; series colours from tokens only. |
| Resizable | None (M3 Expressive pane drag handle) | **Keep** for split panes | Handle: outline-variant divider, 4×48dp grip in on-surface-variant. |
| ScrollArea | None | **Keep** | Thumb `bg-border`; leave, or `--outline` for visibility. |
| AspectRatio | None (behaviour only) | **Keep** as is | — |
| Collapsible | None (behaviour only) | **Keep** as is | — |
| Command (cmdk) | None (closest: search view) | **Drop** unless an app has a command palette | If kept: input as an M3 search bar (56dp, full, surface-container-high). |
| HoverCard | None (closest: rich tooltip) | **Drop** | Hover-only content can't be reached on touch screens. Use Popover or a rich tooltip. |
| Menubar | None | **Drop** | A desktop application menu bar; not a pattern these apps use. |
| NavigationMenu | None (M3 navigation is bar, rail or drawer) | **Drop** unless a website uses it | — |

Any drop: check app imports first, then remove the file, its export in `src/index.ts`, and its dependency (cmdk, etc.).

### Elevation: components with real shadows

AlertDialog, BottomSheet, Chart, Checkbox, ContextMenu, DatePicker, DateTimePicker, Dialog, DropdownMenu, Fab, HoverCard, Menubar, NavigationMenu, Popover, RadioGroup, ScrollingFab, Select, Sheet, Sidebar, Slider, TimePicker, TimePickerDropdown, TimePickerWithIcon, ToggleGroup.

`shadow-[var(--elevation-sm)]` in StatusChip and the text-input family resolves to `none` and is fine.

## Suggested restyle order

Ordered by appearances in the Theme explorer first, then stories. Cheap wins with high story counts ride along.

0. **Foundations** (`tokens.css` + base layer): base border colour, page font and body colour, `--radius-chip` / `--radius-fab`, state-layer utility and disabled opacities, inverse and scrim roles in all four themes, `body-small` / `title-small`. Run `lint:contrast`. The only visible change is fixed borders and fonts.
1. **Card** (E 19 · S 25): border colour, filled variant, title and description roles, 16dp padding.
2. **Table** (E 16 · S 48): roles, dividers, selected and hover states.
3. **Button** (E 3, 8 story files), then **Pagination** (S 58): state layers, disabled, tonal variant; then pagination sizes and the active page.
4. **Breadcrumb** (E 7 · S 33).
5. **Alert** (E 3 · S 15): tonal containers per tier, keeping the text label for severity.
6. **Badge** (E 1 · S 12): decide count vs tag first.
7. **Accordion** (S 30).
8. **Tabs** (E 2): move onto Radix Tabs, add the primary-tab indicator. This fixes an a11y gap, so don't leave it late.
9. **State layers on the M3-done components in the explorer:** Chip, ListItem, StatusChip (+ 8dp), ConnectedButtonGroup, Switch, Fab (shape + drop the shadow), Progress, TextInputField.
10. **Forms:** Label, Input, Textarea, Select trigger, Checkbox (absorbs MaterialCheckbox), RadioGroup (absorbs RadioButton), OutlinedTextField fixes.
11. **Overlays, one surface spec:** Dialog + AlertDialog, Sheet, DropdownMenu + Select content + ContextMenu, Popover, Tooltip (needs inverse tokens).
12. **Pickers and sheets:** DatePicker family onto Calendar; BottomSheet merged into Drawer; the TextInputField family.
13. **Extras:** Sonner, Slider, Toggle / ToggleGroup, Avatar, Skeleton, InputOTP, Chart tooltip, Carousel, Sidebar; then the drops.

## Guardrails for the restyle

- **Restyle class strings only.** Keep every Radix primitive, `data-slot`, `aria-*`, `aria-hidden` and the `focus-visible` rings from the WCAG pass. Where a component isn't Radix and lacks semantics, moving it onto the Radix primitive is part of its restyle: Tabs → `@radix-ui/react-tabs`, BottomSheet → Drawer or Dialog, ConnectedButtonGroup → ToggleGroup. MaterialCheckbox and RadioButton retire into Checkbox and RadioGroup.
- **Control borders stay `--outline`.** M3's outlined field, checkbox and radio already use outline. Non-control borders (cards, dividers, menus) use outline-variant. Button `secondary` stays on `--border` by decision.
- **Severity never by colour alone.** Kritisk / Vesentlig / Mindre alvorlig keep their text; Vesentlig stays the only orange.
- **All four themes.** New roles need a value in every theme block. Check M3 "selected = secondary-container" in Spesialitet: there secondary-container is #424242 with light text, so selected chips, list rows, segments and nav items will turn dark grey. That's a design call to confirm.
- **Every component change:** `npm run lint:tokens`, `lint:a11y`, `lint:contrast`; Storybook in all four themes; then a Claude Design re-sync. Story source changes re-grade that component. Renaming an `OpenKSL` story breaks its overlay card (`.design-sync/NOTES.md`).
- **Log each wave** in `docs/journal.md`.

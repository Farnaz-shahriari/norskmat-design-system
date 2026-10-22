# Norsk Mat design system, conventions

The rules anything generated against this design system has to follow.
Derived from the non-negotiable rules in
`skills/norsk-mat-design-system/SKILL.md`, which stays the source of truth.
Change a rule there first, then here, and log it in `docs/journal.md`, so the
repo never holds two versions of it.

## Platforms and themes

One codebase, four themed platforms. The platform is picked by one class on
the root element, nothing else changes.

| Platform    | Class               | Who it is for                    |
|-------------|---------------------|----------------------------------|
| KSL         | `.theme-ksl`        | Farmers, a work tool. The default |
| Nyt Norge   | `.theme-nyt-norge`  | Consumers, an origin label       |
| Spesialitet | `.theme-spesialitet`| Producers, certification         |
| LokalMat    | `.theme-lokalmat`   | Marketplace, producers and buyers|

```html
<html class="theme-nyt-norge">
```

* Put the class on `<html>`, not on a wrapper. Dialog, Select, Popover,
  Tooltip and the other Radix components render into a portal on `<body>`,
  outside any wrapper, and would come out in KSL colours.
* With no class at all, `:root` is KSL.
* A theme class swaps the brand, surface and outline colours and the font
  family. Severity, error, type scale, spacing, heights and radius are shared
  and identical on every platform, never vary them per theme.
* Switching platform at runtime is swapping that one class, remove the old
  `theme-*`, add the new one.
* To show platforms side by side in one page, give each region its own
  `theme-<platform>` class. That works for everything that renders in place,
  not for portalled content, see above.
* Beskyttede Betegnelser and Stiftelsen Norsk Mat have logos but no palette
  and no theme class. Do not build themed screens for them.
* LokalMat's fonts, Messina Serif and Sands, are not licensed yet.
  `tokens.css` falls back to Georgia. That is a known gap, not a bug.

## Non-negotiable rules

* Use `src/styles/tokens.css` as the actual CSS, not the live app's
  `globals.css`, it is missing `--outline` entirely and `--outline-variant`
  for three platforms, and its Tailwind mapping omits the whole surface
  family.
* No raw hex, pixel, or radius values in new code, everything must reference
  a token from `colors.md` or `spacing.md`.
* Run `npm run lint:tokens` before committing a component change. It fails on
  undefined variables, raw hex, radius name collisions, and size names
  shadowed by the spacing scale.
* Never define `--radius-md`, `--radius-lg`, `--radius-xl` or `--radius-2xl`
  in tokens.css. Those are Tailwind's own radius names, and redefining one
  silently rewrites every `rounded-<name>` in the library. Point a component
  at the token it means instead, `--radius-sm`, `--radius-button`,
  `--radius-card` or `--radius-dialog`.
* Never use a named size, `xs` to `2xl`, on `w`, `h`, `max-w`, `min-w`,
  `max-h`, `min-h`, `size` or `basis`. The spacing scale owns those names, so
  `max-w-lg` is 24px, not Tailwind's 32rem. Write `max-w-(--container-lg)`
  for a container width, `h-[var(--height-lg)]` for a component height.
* Never copy `tokens.css` or a component file into an app's own `src/`.
  Install the package and import it, a copy silently stops receiving changes.
* Kritisk, Vesentlig, Mindre alvorlig are the only three deviation tiers,
  identical on every platform. No other orange, ever, Vesentlig is the only
  orange. Use `var(--vesentlig)` and `var(--mindre-alvorlig)`, never fall
  back to `var(--error)` for either.
* Severity is never shown by colour alone. Every place a tier appears, chip,
  row, badge, icon, count, carries the tier's name in text, "Kritisk",
  "Vesentlig" or "Mindre alvorlig", or at minimum an accessible name that
  says it. WCAG 1.4.1.
* Run `npm run lint:a11y` and `npm run lint:contrast` before committing a
  component or token change. Text needs 4.5:1, control borders and focus
  rings 3:1, in all four themes.
* A control's border is `--outline`, never `--border` or `--input`, those are
  1.3 to 1.7:1 and only for dividers and tracks. The one deliberate
  exception is Button's `secondary` variant, which keeps `--border` because
  its label identifies it.
* IconButton is `button.tsx`'s `size="icon"` variant, do not hand roll one.
* ConnectedButtonGroup and ListItem live in `src/components/`, use them
  instead of copying markup from an existing page.
* Manrope is the only font for KSL, Nyt Norge and Spesialitet. Never
  reintroduce Quatro.

## Component API traps

Not style preferences, each of these already shipped a bug.

* Button's variants are `primary`, `secondary`, `tertiary`, `destructive` and
  `ghost`. There is no `outline`, the outlined button is `secondary`. An
  unknown variant makes cva fall back to `primary`, filled, with no error.
* Borders, never shadows, for structural separation, a deliberate deviation
  from Material 3's elevation model (`references/spacing.md`).
  `--elevation-sm` resolves to `none` on purpose.
* Nothing in `src/components/` imports from outside that folder.
  `lint:tokens` enforces it.

## Where to see it

`npm run storybook` renders the real components in every theme, with the
axe accessibility panel. The Platform toolbar switches the root class, "All
four side by side" is the default.

## Building with it in Claude Design

Components are on `window.NorskmatDesignSystem` and carry their own styling.
`styles.css` is precompiled: a Tailwind class that isn't listed below or used
by a component does nothing. Style your own layout with these, and with
inline `var(--*)` styles for anything else.

* **Root.** `theme-<platform>` on `<html>`, then `bg-background text-foreground`
  and `style={{ fontFamily: "var(--font-family)" }}` on the app root. The
  stylesheet sets no page font yet, so without that line any text that has no
  type class falls back to the system sans.
* **Type.** `headline-medium headline-small title-large title-medium
  body-large body-medium label-large label-medium label-small label-xsmall`.
  Never Tailwind `text-sm`/`text-lg` sizes.
* **Colour.** `bg-background bg-surface bg-surface-variant
  bg-surface-container-low bg-muted bg-card bg-primary bg-primary-container
  bg-secondary-container bg-error bg-error-container`, `text-foreground
  text-muted-foreground text-primary text-error`, `border-outline
  border-outline-variant`. Severity: `bg-[var(--error)]`,
  `bg-[var(--vesentlig)]`, `bg-[var(--mindre-alvorlig)]` with the matching
  `text-[var(--<tier>-foreground)]`, always with the tier name in text.
* **Layout.** `flex flex-col flex-row flex-wrap grid items-center items-start
  justify-between justify-center w-full min-w-0 shrink-0 grow flex-1`,
  spacing `gap-xs gap-sm gap-md gap-lg p-md p-lg px-md`. Anything else:
  `style={{ gap: "var(--space-xl)", borderRadius: "var(--radius-card)" }}`.
* **Where to look.** `styles.css` and `_ds_bundle.css` for every token and
  class; each component's `<Name>.d.ts` for props and `<Name>.prompt.md` for
  usage.

```jsx
const { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, Badge, Button } = window.NorskmatDesignSystem;

<div className="bg-background text-foreground flex flex-col gap-md p-lg" style={{ fontFamily: "var(--font-family)" }}>
  <Card className="w-full max-w-[360px]">
    <CardHeader>
      <CardTitle className="title-medium">Avvik 2026-114</CardTitle>
      <CardDescription>Journal for plantevernmidler mangler</CardDescription>
      <CardAction>
        <Badge className="bg-[var(--error)] text-[var(--error-foreground)]">Kritisk</Badge>
      </CardAction>
    </CardHeader>
    <CardContent className="body-medium">Frist 15. november 2026.</CardContent>
  </Card>
  <Button variant="secondary">Lukk avvik</Button>
</div>
```

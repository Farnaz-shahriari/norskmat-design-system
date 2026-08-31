# Spacing and Layout

This file defines the spacing scale, grid approach, breakpoints, layout rules, and panel structure for the design system. It is based on Material 3 foundations, adapted to match the patterns already used in the live application.

## Spacing scale

Base unit, 4px

| Token | Value | Use |
|---|---|---|
| space-xs | 4px | icon to text gap, tight inline spacing |
| space-sm | 8px | default inline grouping, the most common gap |
| space-md | 16px | form and header groupings, default component padding |
| space-lg | 24px | page gutter, section separation, card padding |
| space-xl | 40px | major layout split, like two column question cards |
| space-2xl | 48px | large section breaks, optional, reserve for big vertical gaps |

Rules

- All spacing values must come from this scale, no raw pixel values in code
- Do not use half step values like 6px, 10px, or 14px, if a component seems to need one, round to the nearest token instead
- If a bracketed pixel value like px, sixteen px, already matches a token like space-md, always use the token, never the raw bracket value

## Component height scale

| Token | Value | Use |
|---|---|---|
| height-sm | 32px | chips, small selects, avatars |
| height-md | 40px | standard buttons |
| height-lg | 56px | nav items, tab bar, top bar, table style rows, pill buttons |

## Grid approach

- No twelve column grid, no container or gutter system
- Layout is pane based and flexbox first, following Material 3's canonical layouts, list detail, supporting pane, and feed
- CSS grid is allowed only for even, evenly sized card rows, like a deviation counter grid, not for full page layout

## Breakpoints

Aligned to Material 3 window size classes

| Name | Range | Notes |
|---|---|---|
| compact | under 600px | single pane, mobile top bar instead of side nav |
| medium | 600px to 839px | single pane still recommended, limited width |
| expanded | 840px to 1199px | two panes possible, side nav appears |
| large | 1200px to 1599px | full desktop layout |
| extra large | 1600px and above | widest layout, right rail and extra panes visible |

Rules

- All breakpoints in the app must map to one of these five names, no inline arbitrary numbers like nine hundred or one thousand three hundred ninety nine
- Fix the known one pixel bug, where one breakpoint sits one pixel off another, both should align to the same value, thirteen ninety nine becomes fourteen hundred

## Page width rule

Pick one rule and apply it everywhere, do not mix

- Chosen rule, cap all page content at a max width of 1680px, centered, with a page gutter of space-lg, twenty four px, on each side
- Apply this to every page, dashboard, list views, and workspace views, no exceptions

## Layout structure, panes

Based on Material 3's supporting pane and list detail patterns

- Navigation pane, fixed width, full height, collapsible to a narrow icon only state, hidden below the expanded breakpoint and replaced by a mobile top bar
- List or checklist pane, fixed width, own scroll area, hidden below the medium breakpoint
- Main content pane, flexible width, takes remaining space, own scroll area
- Supporting or detail pane, fixed width, appears on the side at large and extra large sizes, at smaller sizes its content relocates inline into the main content pane instead of simply hiding

Rules

- Only the main content pane is flexible, all other panes use fixed widths
- Each region owns its own scroll area, there is no single page level scroll
- When a pane cannot fit, prefer relocating its content into the main pane over hiding it completely, this preserves access to information at every screen size

## Structural separation

- Use one pixel borders to separate regions, nav, panels, headers, tab bars
- Do not use shadows or elevation for structural separation, this is an intentional deviation from Material 3's elevation model, keep it consistent going forward

## Radius

| Token | Value | Use |
|---|---|---|
| radius-sm | 4px | inputs, small surfaces |
| radius-button | 100px | pill shaped buttons |
| radius-card | 12px | cards |
| radius-dialog | 28px | dialogs, modals |

Rule, every rounded corner in the app must use one of these four tokens, no raw bracket values like rounded eight, rounded sixteen, or rounded one thousand, these should all be replaced with the matching token above

## Summary of decisions

- Spacing, kept the app's existing working scale, gave it names, removed the half step exceptions
- Grid, chose panes over a column grid, matching both the app and Material 3's own layout model
- Breakpoints, renamed to Material 3's compact, medium, expanded, large, extra large, fixed the one pixel bug
- Page width, one consistent max width rule across all pages
- Panels, formalized using Material 3's supporting pane logic, fixed width side panes, flexible main pane, relocate instead of hide
- Borders vs elevation, kept borders as the separator, documented as an intentional choice, not an oversight
- Radius, kept existing tokens, removed raw duplicate values

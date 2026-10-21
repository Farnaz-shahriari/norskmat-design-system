# Handoff

Where this repo stands, and what to do next. Written for a fresh Claude Code
session picking up the work.

Full history is in `docs/journal.md`, phase by phase. This file is only the
current state and the next moves.

## Read this first

**Nothing has been pushed.** Three commits sit on a local branch,
`design-sync-setup`, and the remote has never heard of it. `origin/main` is
still at `d02bba0`. Everything below exists only on this machine.

```bash
git branch --show-current   # design-sync-setup
git log --oneline -3
git push -u origin design-sync-setup
```

## What this repo is, four things at once

| It is | Via | Entry point |
|---|---|---|
| An npm package | `package.json` | `src/index.ts` |
| A Claude Code plugin | `.claude-plugin/` | `skills/norsk-mat-design-system/SKILL.md` |
| A reference website | `npm run docs` | `docs/index.html`, deployed by CI |
| The design system itself | | `src/styles/tokens.css` |

Changing one usually means checking the others. The three scripts in
`scripts/` all read from `src/`.

## Layout

```
src/components/          71 .tsx and .ts files, the library
src/styles/tokens.css    every token, four platform themes
src/styles/index.css     Tailwind entry, compiles to dist/norskmat.css
src/styles/fonts/        Manrope, self hosted, SIL OFL 1.1
src/index.ts             GENERATED, do not edit
skills/norsk-mat-design-system/
  SKILL.md               the skill the plugin ships
  references/*.md        colors, typography, spacing, components, brand
  assets/<platform>/     logos only; code lives in src/
docs/site/               source of the reference site
scripts/                 build-docs, build-barrel, build-css, extract-tokens, lint-tokens
.github/workflows/       lint, build and deploy the site on push to main
```

Build output is gitignored and must never be committed: `dist/`,
`docs/index.html`, `docs/tokens.json`, `docs/audit.js`, `docs/artifact.html`.

## Commands

```bash
npm install
npm run build        # barrel, then CSS into dist/, then tsc declarations
npm run lint:tokens  # 0 errors expected, 41 warnings are known and listed below
npm run docs         # rebuilds the reference site
```

`npm run build` must stay at zero errors. It fails on a duplicate export name,
on a font url that would not resolve from `dist/`, and on any type error.

## Rules that already caught real bugs

Not style preferences. Each of these exists because breaking it shipped a bug.

* **Never define `--radius-md`, `--radius-lg`, `--radius-xl` or `--radius-2xl`
  in tokens.css.** Those are Tailwind's own names. Defining one in `:root`
  silently rewrites every `rounded-<name>` in the library. It already took
  `card.tsx` from its correct 12px to 28px with nobody editing card.tsx.
* **`Button` has no `outline` variant.** It is called `secondary`. Passing
  `outline` makes cva fall back to `primary`, so the button renders filled
  instead of outlined, silently. This was live in four components.
* **Nothing in `src/components/` may import from outside that folder.** The
  folder is what the package ships. `lint:tokens` enforces it.
* **No raw hex, and no orange but Vesentlig.** Two components invented their
  own orange before the rule existed.
* **Borders, never shadows, for structural separation.** Deliberate deviation
  from Material 3.

## Known gaps, still open

Run `npm run lint:tokens` for the live list. Summarised in
`skills/norsk-mat-design-system/references/colors.md`.

* **LokalMat's fonts are not licensed.** Messina Serif and Sands exist
  nowhere. Georgia is the stand in. Needs real files, cannot be fixed in code.
* **~40 radius usages are off the four tokens**, `rounded-md` in 18 files,
  `rounded-lg` in 10. Real violations of spacing.md, but which of the four
  each becomes is a per component design decision.
* **25 components size text with Tailwind's `text-*`** instead of the named
  type classes. Almost all Radix primitives, so leaving them may be right,
  but make it a decision.
* **Four spacing values off the scale.** Three are picker maximums and
  arguably fine, `py-[14px]` in tabs.tsx is not.
* **Beskyttede Betegnelser and Stiftelsen Norsk Mat have no palette.** Logos
  only, no theme class. Do not build a themed screen for either.
* **The live KSL app still has wrong severity colours.** Different repo.

## What is done, steps 1 and 2

1. **Cleanup.** Deleted `_to_delete/`. Fixed five imports in three components
   that pointed at files outside the repo, broken since the library was first
   copied in. Recreated `status-chip.tsx` and `date-format.ts`. Added an
   import resolution check to `lint:tokens` so it cannot recur.
2. **Buildable package.** Moved to `src/`, generated barrel, `package.json`
   exports and types, Tailwind build to `dist/`, tsc declarations, self
   hosted Manrope. Verified by packing, installing into a clean React 18
   project and strict type checking an app against the package root.

## Next, step 3, the Claude Design sync

This is the part that could not be done from the cloud session, and can be
done here.

```bash
/design-login    # once, authorizes design-system access
/design-sync
```

Unknowns worth checking rather than assuming:

* Whether `/design-sync` generates the per component preview HTML itself, or
  expects it to exist. If it expects it, the pieces are here already, the
  docs build compiles Tailwind over the real components and renders them, so
  reuse `scripts/build-docs.mjs` rather than starting over.
* A Claude Design project's type is **immutable at creation**. Pushing into a
  regular project never makes it a design system project.
* The sync is incremental, one component at a time, never a wholesale replace.

## Also waiting on a push

* **GitHub Pages.** `.github/workflows/docs.yml` deploys the reference site on
  every push to `main`. One manual step after the first push: repo settings,
  Pages, set source to **GitHub Actions**.
* **The plugin.** `/plugin marketplace add Farnaz-shahriari/norskmat-design-system`
  only works once the repo is pushed.
* **The drift checker.** The one line that checks a live app against the
  system fetches its values from the Pages deployment, so it starts working
  after Pages is live.

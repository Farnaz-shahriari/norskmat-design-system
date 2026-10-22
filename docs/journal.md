# Project journal

This file logs how the Norsk mat design system skill was built, step by step, together with Claude. Every phase gets an entry here, what we decided, why, what is still open, and which files it produced.

## Phase 0, foundation
Date, folder structure created, empty placeholders for all files, journal started.
Files produced,
- SKILL.md
- docs/journal.md
- references/brand-context.md
- references/colors.md
- references/typography.md
- references/spacing.md
- references/components.md
- platforms/.gitkeep
- assets/.gitkeep

## Phase 1, audit of old sources
Status, in progress. Confirmed five platforms exist, Nyt Norge, KSL, Lokalmat.no, Spesialitet, Beskyttede Betegnelser, plus the institutional Stiftelsen Norsk Mat, using stiftelsennorskmat.no, ksl.no, nytnorge.no, designguide.norskmat.no. Real focus has been KSL. Figma slides presentation could not be read, the connector only supports Design and Make files, not Slides.
Files produced, none directly, informed brand-context.md below.

## Phase 2, shared vs platform specific rules
Status, not formally started, but findings are accumulating from phases 3 and 4 below. So far confirmed shared across all platforms, font family and type scale, deviation severity colors, error color. Confirmed platform specific, brand colors, primary, secondary, tertiary, surface and background tones, logos, and for LokalMat specifically, font family too, Messina Serif and Sands instead of Manrope.
Files produced, none yet, this phase will formalize the pattern once more of the system is documented.

## Phase 3, colors
Status, done. Source of truth confirmed by you as the Figma variable JSON exports, one per platform, generated from Material 3 Theme Builder. Cross checked against the live KSL Foretak app codebase and found real drift, documented as known gaps rather than silently fixed, since this skill describes the design system, it does not patch the app. Confirmed deviation severity and error colors are identical across all four platforms, semantic, shared. Confirmed real bugs, the Vesentlig deviation container color is wrong in the app's severityColors.ts, the Vesentlig main color is not wired into the UI at all, and globals.css has dead, unused deviation container variables that do not match the JSON.
Files produced,
- references/colors.md, shared severity colors, per platform brand colors, per platform surfaces, and a known gaps section
- references/source-tokens/ksl_tokens.json
- references/source-tokens/lokalmat_tokens.json
- references/source-tokens/nytnorge_tokens.json
- references/source-tokens/spesialitet_tokens.json, raw Figma variable exports kept for future reference

Also received, full KSL Foretak app codebase (KSL_Foretak__main_July___3_.zip), used for this audit and for phase 4 below, not yet copied into the skill itself, decide later if a trimmed reference copy belongs in the repo or just informs the docs.

## Phase 4, typography
Status, done. The design system guideline once called for a second heading font, Quatro, which was never actually loaded anywhere and caused visible inconsistency, since about 130 places in the codebase hardcoded it directly and silently fell back to a generic system font. You confirmed this and removed Quatro, Manrope is now the only font for KSL, Nyt Norge, Spesialitet. LokalMat is the one platform that differs, Messina Serif and Sands, confirmed by you directly, not yet present in any codebase since that platform has not been built. Type scale and named styles ranked by real usage frequency counted directly from the KSL Foretak app codebase, not guesswork, body and label sizes dominate, headline sizes barely appear.
Files produced,
- references/typography.md, font families per platform, type scale ranked by real usage, named styles ranked by real usage, and the resolved Quatro gap documented so it does not get reintroduced.

## Phase 5, spacing
Status, done. Scale, grid approach, breakpoints, page width, panel structure, and radius tokens defined, based on Material 3 foundations adapted to match the app's existing working patterns rather than replacing them. Fixed a known one pixel breakpoint bug, 1399 versus 1400, and formalized borders over elevation as an intentional, documented choice rather than an oversight.
Files produced,
- references/spacing.md, spacing scale, component height scale, grid approach, breakpoints, page width rule, panel layout structure, structural separation rule, radius tokens, and a summary of decisions

## Phase 6, components
Status, done. Audited all 67 files in the shared UI library file by file against colors.md. Confirmed real platform bleed bugs, switch.tsx hardcodes three literal KSL colors instead of variables, six form field files hardcode KSL's on surface variant color directly. Found one undocumented color, inline-editable-list-item.tsx, confirmed by you as a mistake, resolved as Vesentlig, no new tier. Built the two confirmed missing components, ConnectedButtonGroup and ListItem with density and trailing content variants, based on your own repeated Figma patterns rather than the open source Material 3 library, since Google's own segmented button implementation is unmaintained upstream. IconButton kept as is per your call, the primitive already exists, it is simply under used. Note for later, KSL app bar logo sizing does not follow the 250px brand minimum, real component rules will need their own smaller minimum, see assets/ksl/README.md.
Files produced,
- references/components.md, full tiered audit, keep as is, needs token fix, resolved decision, and what got built
- assets/components/connected-button-group.tsx
- assets/components/list-item.tsx

## Phase 6, update, real fix shipped
Status, done. Claude Design surfaced exactly these known gaps while handing off a real LokalMat design, switch.tsx's hardcoded KSL colors, the text field family's hardcoded on surface variant color, and missing outline-variant for LokalMat. Fixed all three, plus two deeper causes found while fixing them, `--outline` did not exist as a variable anywhere in the app for any platform, and the app's Tailwind theme mapping never exposed outline, outline-variant, or the surface family as usable classes at all, so components reaching for them, including this skill's own ConnectedButtonGroup, silently failed. Built assets/tokens.css as the canonical, corrected CSS for every platform, complete variables, complete mapping, meant to be used directly instead of the app's globals.css. Font issue, Messina Serif and Sands, cannot be fixed from here, no licensed files exist yet, tokens.css falls back to Georgia in the meantime rather than a silent generic sans.
Files produced,
- assets/tokens.css, new, canonical CSS variables and Tailwind mapping for every platform
- assets/components/switch.tsx, fixed, hardcoded colors replaced
- assets/components/editable-text-field.tsx, number-input-with-icon.tsx, text-input-field.tsx, text-input-with-icon.tsx, time-picker-with-icon.tsx, radio-button.tsx, fixed, hardcoded colors replaced
- assets/components/connected-button-group.tsx, fixed, was using an unmapped Tailwind class
- references/colors.md, known gaps section updated, several items now marked resolved with what fixed them
- references/components.md, Tier 2 updated from "needs a token fix" to "fixed"
- SKILL.md, points to tokens.css as the real CSS to use, added the fallback rule for Vesentlig and Mindre alvorlig

## Phase 6, update, the actual component library was never shipped
Status, done. You caught this using Claude Code, components.md tiered all 67 files and marked most "ready to use as is," but only the newly built and the already fixed files ever actually made it into assets/components/, the other roughly 60 were described, never copied. Copied the full library now, 69 files total including the two new builds. Also found and fixed a second, previously undocumented instance of the exact same orphan orange bug from earlier, inline-editable-list-item.tsx had a "warning" chip variant hardcoding the same three colors, sitting right next to a correctly built "error" variant in the same file, now uses the real Vesentlig variables. new-file.tsx confirmed genuinely empty, left out.
Files produced,
- assets/components/, 60 previously undelivered files added, plus inline-editable-list-item.tsx fixed and added
- references/components.md, Tier 1 lists all 60 by name, Tier 3 updated with the second orphan orange instance and its fix
- SKILL.md, component count corrected to reflect the complete library

## Phase 4 and 5, update, typography and spacing were never implemented either
Status, done. You caught this using Claude Cowork, same root cause as the component library gap, phase 4 and phase 5 defined the type scale, named styles, spacing scale, height scale, and radius tokens as markdown tables, but nothing ever turned them into real CSS. button.tsx and the input family were already referencing var(--radius-button) directly, undefined until now. Added everything to assets/tokens.css, named type classes use var(--font-family) rather than a hardcoded font, so LokalMat inherits Messina Serif and Sands automatically once those files exist, no separate rule needed.
Files produced,
- assets/tokens.css, updated, added font weight variables, text size variables, all nine named type classes, spacing scale, height scale, and radius tokens
- references/typography.md, references/spacing.md, each now points to the implementation instead of only describing it

## Phase 10, made it consumable, one source instead of copies
Status, done. A real LokalMat app was built against this system in Claude Code and the handoff exposed the actual structural problem, there was no way to consume this repo except copying files by hand, so every app becomes a snapshot that silently stops receiving changes. Turned the repo into an installable package instead. Also fixed the two defects that forced the hand editing in the first place, every component import carried a Figma Make `@version` suffix, 37 packages, so no app could install them without stripping the suffixes and separately pinning versions, and several variables the components reference were never defined anywhere.
Files produced,
- package.json, new, name `@norskmat/design-system`, all 37 versions moved from import suffixes into real dependencies, react and tailwind as peers, exports map for tokens, components, utils, and logos
- assets/components/, 40 files edited, every `@version` import suffix stripped
- assets/tokens.css, added `--radius` and `--radius-xl` as aliases to the existing four radius tokens, `--elevation-sm: none` so the name resolves without breaking spacing.md's no shadows rule, `--input-background`, and the `.headline-small` class, 24px was the seventh most used size in the app with no named class
- docs/consuming.md, new, install, use, update, and the one bundler setting each app needs since the package ships raw tsx
- references/typography.md, headline-small added to the named styles table
- references/spacing.md, radius aliases and the elevation decision documented
- references/colors.md, three new known gaps, two resolved, one left open on purpose
- SKILL.md, install section, and a new non-negotiable rule against copying files into an app

Left open on purpose, the sidebar color family. `sidebar.tsx` needs six tokens that exist nowhere, and it wraps one in `hsl()` while this system is hex throughout. Whether a sidebar is its own surface or just `--surface-container` is a design decision, not a bug fix, so it is documented as gap 11 rather than guessed.

## Phase 11, made it installable by other people
Status, done. Found the real reason this skill has been unreliable, the copy on your Claude account is a single orphaned SKILL.md, no references, no assets, and it predates every change in this repo. So the skill has been firing with the rules but none of the data, every path in it a dead end, and it still carried the old norskmat name. Fixed the distribution properly rather than re-uploading a zip that would drift again.
Restructured the repo so it is a Claude Code plugin marketplace as well as an npm package, one copy of every file serving both. SKILL.md, references/, assets/ and platforms/ moved into skills/norsk-mat-design-system/, package.json exports repointed there so npm consumers see no change in their import paths.
Files produced,
- .claude-plugin/marketplace.json, new, marketplace named norskmat, one plugin, source is the repo root
- .claude-plugin/plugin.json, new, plugin metadata
- skills/norsk-mat-design-system/, the whole skill moved here from the repo root
- package.json, exports and files repointed, import paths for consuming apps unchanged
- docs/consuming.md, the Tailwind @source path updated for the new layout
Verified, packed the package and installed it clean with all 37 dependencies, bundled Button, ListItem, Switch and cn plus the tokens.css import, both clean, and confirmed the references files now actually ship inside the package.

How a colleague installs it, /plugin marketplace add Farnaz-shahriari/norskmat-design-system then /plugin install norsk-mat-design-system@norskmat, and /plugin marketplace update norskmat to pull later commits. Third party marketplaces do not auto update by default, that is a per marketplace setting.

## Phase 12, the reference site
Status, done. Built an interactive reference for the whole system at docs/index.html, generated rather than written, because a hand written docs page is just another copy that drifts. scripts/extract-tokens.mjs parses tokens.css into a model, scripts/build-docs.mjs compiles Tailwind over the real component sources so their classes actually exist on the page, bundles the real .tsx components in, and inlines everything into one self contained file. Change a colour, run npm run docs, the site is correct.
Sections, get started with the npm and plugin install, platforms, colour, deviation tiers, typography, spacing and radius, live components, rules, known gaps. A platform switcher in the header retints every specimen and every live component at once, which is the one thing a static page cannot show, that a platform swap is a class name.
Design decision worth keeping, the site chrome is deliberately not built from the design system's own tokens, deep teal and olive biased neutrals, a colour that appears in none of the four platform palettes. A specimen sheet printed in the ink it documents tells you nothing, you cannot see where the site stops and the system starts. Everything inside a stage is the real system, everything outside it is chrome.
The stages also stay light in a dark page on purpose. None of the four platform themes defines a dark palette, so inventing one for the docs would be documenting something that does not exist.
Files produced,
- docs/index.html, generated, self contained, 347 kB
- docs/site/main.tsx, docs/site/site.css, docs/site/tailwind.css, the site source
- scripts/extract-tokens.mjs, scripts/build-docs.mjs
- package.json, npm run docs plus seven devDependencies
- docs/.nojekyll, so GitHub Pages serves it untouched
- SKILL.md and docs/consuming.md point at it
Verified in a real browser, all nine sections screenshotted, live components confirmed rendering the real thing, KSL olive at 56px with the 100px pill radius, and confirmed retinting to Nyt Norge blue and LokalMat red on switch. Two real bugs found and fixed in that pass, a class name collision that drew a card border around every type specimen, and a flex column that stretched the button group full width.
Then ran the build on your own machine from your own copy and it reproduced the file byte for byte, same md5, so npm run docs is genuinely portable and not something that only worked in a sandbox.

## Phase 13, one screen, four brands
Status, done. Added the section that actually shows the system working, a full example screen rendered in each platform's tokens, placed second in the nav right after get started because it is the payoff and people should find it before the token tables.
Three views, a desktop browser frame, a phone frame, and compare all four, which puts the same screen in all four brands side by side at once. That last one is the whole argument for a multi brand design system in a single glance. Platform is chosen from cards showing the real logo, the audience, a six swatch palette strip and the font, or with keys 1 to 4, and the choice is remembered per viewer in localStorage.
Also added a label the tokens toggle, which outlines every themed region in the screen and names the token behind it, --surface-container on the app bar, --surface-container-high on the lead stat tile, --vesentlig-container on a Vesentlig badge. That ties the screen back to the token lists further down the page without duplicating them.
The real platform logos are now inlined as base64 data URIs at build time, base64 rather than inline svg because four logos in one document would collide on their internal ids and gradient names.
Design constraint kept on purpose, the example screen contains no hex, no pixel value and no font name, only tokens. That is what makes it a test rather than a picture, if it looks wrong on a platform, a token is wrong.
Files produced,
- docs/site/preview.tsx, new, the picker, the screen, and the three views
- docs/site/site.css, frames, picker, screen and inspect mode styles
- docs/site/main.tsx, nav entry, keyboard shortcuts, remembered platform
- scripts/build-docs.mjs, inlines the four logos
Two real bugs found and fixed during verification. First, the platform class was being applied by querying .themed elements in an effect, so a stage that mounted later, the phone frame, never got themed at all, it silently rendered KSL colours while the header said Nyt Norge. Replaced with one class on one wrapper and CSS variable inheritance, which is also exactly how an app does it, one class on html. Second, three stat tiles side by side stop being readable well below 390px, so compact is now a real breakpoint with the tiles as rows and the filter group scrolling instead of clipping.
Verified in a real browser across all three views and all four platforms, no console errors, and the build reproduced byte for byte on your machine, same md5.

## Phase 14, audited the known gaps and closed the ones that were closable
Status, done. Audited every open item against the actual files rather than trusting the list, which was the right instinct, two entries turned out to understate the problem badly and one real bug was hiding that nobody had written down.

Fixed, eight items.
- The sidebar colour family, six token names sidebar.tsx needs that were defined nowhere, so a sidebar rendered untinted on every platform. Defined as aliases onto the surface family, surface-container-low for the ground plus the standard secondary container treatment for the selected item, and mapped into @theme so bg-sidebar actually generates. Aliases, not new colours, so it is one edit to change if a sidebar should be its own surface. This had been left open as needing a design decision, but the conservative reading needed no decision at all.
- A shadow wrapping a hex value in hsl(), which is invalid CSS, so the sidebar rail handle had no outline at all.
- --radius-xl collided with Tailwind's own radius scale. This one I caused in phase 10, adding --radius-xl as an alias for the bottom sheet. Declaring it in :root silently changed every rounded-xl in the library, and card.tsx went from its correct 12px to 28px with nobody editing card.tsx. Removed the alias, bottom-sheet.tsx now names --radius-dialog directly, and card.tsx and list-item.tsx name --radius-card. --radius-sm shares a name with Tailwind's too but holds the same 4px, so it is harmless, and it is now documented as a trap.
- Two exact value matches renamed to their tokens, rounded-[4px] to --radius-sm in checkbox.tsx and rounded-[28px] to --radius-dialog in time-picker-dropdown.tsx.
- Nothing enforced any of the rules. npm run lint:tokens now does. It checks all 69 components for variables tokens.css does not define, raw hex, radius name collisions with Tailwind, radius outside the four tokens, spacing off the scale, and text sized outside the named type classes. Errors fail the build, warnings do not, so it can go into CI as is. The undefined variable check is the important one, it would have caught --outline, --radius, --input-background and the sidebar family the day each broke.
- Also extended @theme with the spacing and height scales, so p-md and gap-lg are real classes now. Radius is deliberately not mapped, the design tokens are already called --radius-card and friends and a @theme entry of the same name resolves to itself.

Corrected rather than fixed.
- The list claimed six components size text with Tailwind's text-* scale. It is 25. They are almost all Radix primitives so leaving them may be right, but it should be a decision.
- A new gap nobody had written down, around 40 radius usages are not on the four tokens, rounded-md in 18 files, rounded-lg in 10. spacing.md says four values only, so these are real violations, but which of the four each becomes is a per component call.
- Four spacing values off the scale, three are picker maximums and arguably fine, py-[14px] in tabs.tsx is not.

Left open honestly, LokalMat's unlicensed fonts, the live app's severity colours, the radius and type scale migrations, and the two platforms with logos but no palette.

Files produced,
- scripts/lint-tokens.mjs, new, plus the lint:tokens script
- skills/norsk-mat-design-system/assets/tokens.css, --radius-xl removed, sidebar family added, spacing and height mapped, traps documented in comments
- assets/components/, six files fixed, bottom-sheet, card, list-item, sidebar, checkbox, time-picker-dropdown
- references/colors.md, known gaps rewritten as fixed and still open, with real counts
- SKILL.md, two new non-negotiable rules, run the linter, and never use Tailwind's radius names
- docs/site/main.tsx and docs/index.html, the gaps section rebuilt as two lists

Verified, the linter reports zero errors, card radius resolves to 12px again, --radius-xl is back to Tailwind's 0.75rem, bg-sidebar and p-md both generate with the right values, and the site renders with no console errors.
Two bugs in my own linter found and fixed while running it, a regex tested against a value with the -- already stripped so every Radix runtime variable came out as an error, and a side matcher that ate the first letter of a size so rounded-lg was reported as rounded-l.

## Phase 15, made the reference live rather than a committed file
Status, done. The reference site was build output committed into the repo, which meant it went stale the moment someone changed a token and forgot npm run docs. That is the same drift this repo exists to stop, just moved into the documentation.

Two things now.

First, it deploys itself. .github/workflows/docs.yml runs the linter, builds the site, checks the output actually contains what it should, and deploys to GitHub Pages on every push to main. Pull requests get the lint and the build but do not deploy. docs/index.html, docs/tokens.json and docs/audit.js are gitignored, they are output, not source. The linter running first is deliberate, a push that leaves a component pointing at a token that does not exist should not get a green deploy, because a green deploy is what makes people trust the page. One manual step remains, set Pages source to GitHub Actions in the repo settings, once.

Second, and this is the part that answers in place, a live drift check. Paste one line into the console of any app that uses this system,
  import("https://farnaz-shahriari.github.io/norskmat-design-system/audit.js")
and it reports every token that app defines differently and every token it does not define at all, in a panel plus a full console table. It carries no expected values of its own, it fetches them from tokens.json beside it on the deployment, so it is always comparing against the system as it stands rather than a snapshot. GitHub Pages sends a permissive CORS header, so the fetch works from any origin.
Design decisions in it worth keeping. Colours are compared as colours via the browser's own parser, so #FFFFFF, #ffffff and rgb(255 255 255) are one value, and lengths are compared in px, so 1rem matches 16px, it reports real differences rather than formatting. The panel renders in a shadow root, so the host app's CSS cannot reach in and it cannot leak out, and only values the browser parses as colours are ever put into a style attribute. It reads and never writes, safe on production. Platform detection prefers the theme class and falls back to matching the app's computed --primary, which catches an app that set the variables directly.
Also emitted docs/tokens.json as the machine readable model, so an app can assert against it in a test rather than a console.

Verified against a deliberately broken app. Built a fake KSL app carrying three real bugs, --outline deleted entirely, Vesentlig's container left at the old wrong #ffddcc, and the large spacing step off by 4px. The checker reported 52 of 55 tokens correct and named exactly those three, one missing and two drifted, with no false positives. Screenshotted the panel and the new section, no console errors.

Files produced,
- .github/workflows/docs.yml, new
- docs/site/audit.js, new, dependency free on purpose so it pastes anywhere
- scripts/build-docs.mjs, also emits tokens.json and audit.js
- docs/site/main.tsx, new Check a live app section with the copyable one liner
- .gitignore, the three build outputs
- docs/consuming.md and SKILL.md, point at the live URL and the check

## Phase 16, opened it inside Claude too
Status, done. Published the reference as a Claude artifact so it is openable right now, before the GitHub Pages deploy exists, and added claude/reference-site.md to the project as the one place that holds every link, the artifact, the Pages URL, the paste in checker, the install lines and the plugin commands.
Rather than hand maintaining a second copy of the page, npm run docs now also writes docs/artifact.html, the same build in the shape the artifact runtime expects, no doctype, html, head or body tags of its own since those are added at publish time. Same styles, same bundle, same content, so republishing that file is republishing the current build. Gitignored like the other three outputs.
Verified by wrapping docs/artifact.html in the same skeleton the runtime adds and loading it in a browser, mounted, all 11 sections present, the four platform cards render, and the live Button still renders KSL olive. The publish warning about an external script is a false positive, the only https reference in the page body is the checker one liner shown as copyable text, there is no script tag with a src.

## Phase 17, cleanup before design sync
Status, done. On branch design-sync-setup. Four cleanup items were asked for, two were real, one was already done, and one turned out not to be a problem. Worth recording which was which.

Already done. Version numbers in import paths, the lucide-react@0.487.0 shape. Phase 10 stripped all 37 of them into package.json dependencies, so zero files needed it.

Not actually broken. sonner.tsx imports next-themes, which was on the list as missing. It is declared in package.json at 0.4.6 and resolves from node_modules, so it builds fine and was left alone. Changing working code under a cleanup heading is how cleanups cause regressions. Separate observation for later, this design system has no dark palette on any of the four platforms, so a theme provider dependency may not earn its place, but that is a design decision, not cleanup.

Really broken, five imports across three files, every one pointing outside this repo.
- editable-text-field.tsx, two Figma Make svg path modules and a StatusChip
- text-input-field.tsx, one of the same svg modules
- date-time-picker.tsx, formatNorwegianDate from a utils folder that does not exist here
Fixed by recreating rather than by stubbing. The three svg paths were an alert icon in a Trenger utfylling chip, a check on the save button and a pencil on the edit button, all three now lucide-react icons, which the library already depends on and date-time-picker already uses. No fabricated path data. New assets/components/status-chip.tsx reproduces the incomplete state exactly from the two inline copies that were already sitting in editable-text-field.tsx, and those two copies now use the component, so the markup exists once instead of three times. New assets/components/date-format.ts uses Intl with nb-NO rather than a month name table, so it stays correct without maintenance.
One thing invented, StatusChip's isComplete true state. Nothing in the repo specified it, nothing uses it. It mirrors the incomplete state with a check in --primary. Flagged in the file so whoever owns the design can correct it.

Root cause, and the actual fix. These had been broken since the library was first copied in and nothing noticed, because the docs site only imports about fifteen of the sixty nine components, and the token linter never looked at imports at all. Added an import check to scripts/lint-tokens.mjs, every relative import must resolve to a sibling file, nothing may reach outside assets/components, and every bare import must be declared in package.json. Errors, so it fails CI.
Verified the check rather than trusting a clean run, planted all three original break shapes back into a file and confirmed it reported exactly three errors and exited 1, then reverted. Then bundled all 71 components through esbuild in one entry point, so every import in the library had to resolve, not only the ones the docs site uses. Clean.
Also deleted the _to_delete folder, 16 transfer archives and two probe files left over from earlier sessions.

Files produced,
- assets/components/status-chip.tsx and date-format.ts, new
- assets/components/editable-text-field.tsx, text-input-field.tsx, date-time-picker.tsx, imports fixed
- scripts/lint-tokens.mjs, import resolution check
- _to_delete/, gone

## Phase 18, made it a buildable React package
Status, done. On branch design-sync-setup. Restructured for /design-sync, src/components and src/styles, with a real build that emits dist/.

Layout. Components and tokens.css moved with git mv so history follows them. Brand logos stayed in the skill folder, they are brand assets rather than code, and build-docs reads them from there. SKILL.md and references/ now write paths from the repo root, src/components and src/styles/tokens.css, so they read the same in the repo and in an installed plugin.

The package. src/index.ts is generated by scripts/build-barrel.mjs rather than hand written, because a hand written barrel is one more thing that falls behind the folder, which is the failure this repo keeps finding. It checks for duplicate export names first and fails the build on one, since export * would silently drop a collision. 71 modules, 274 names, zero collisions, and cn comes through from utils.
package.json now has type module, types pointing at dist/index.d.ts, React 18 as a peer, and exports for the built stylesheet, the raw tokens, the source Tailwind entry, individual components, utils and the logos. All 40 libraries the components import were already declared correctly from phase 10, nothing missing, nothing unused.

The build, three steps, zero errors. Barrel, then CSS, then declarations.
One real trap found while building. Tailwind rewrites @font-face urls relative to the output file, so compiling src/styles/index.css straight to dist/norskmat.css emitted url(./manrope-...woff2) beside a dist/ with no fonts in it. Every heading would have fallen back to a system sans, which is the exact failure self hosting is meant to prevent. scripts/build-css.mjs now copies the fonts and their licence into dist/ and then verifies every url() in the output actually resolves, failing the build if one does not.

A real bug that tsc found. Four components asked Button for variant "outline", which this system does not have. cva fell back to defaultVariants, so alert-dialog's cancel button, both carousel arrows and the active pagination link all rendered as filled primary buttons where an outlined one was intended. This system calls that variant secondary, commented in button.tsx as "Secondary/Outlined". Fixed at all four sites. Nothing but turning on type checking would have surfaced this, the components render fine, just wrong.

Fonts. Manrope self hosted under the SIL Open Font License 1.1, taken unmodified from @fontsource-variable/manrope with OFL.txt beside it. One variable file per subset, latin and latin-ext, weight axis 200 to 800, which covers the 400, 500 and 600 the type scale uses in two requests rather than six. 40 kB total. Norwegian ø, å and æ are in the latin subset.

dist/ is gitignored, it is build output. A git install builds it through prepare, which npm runs with devDependencies available.

Verified as a consumer, not just as a maintainer. Packed the tarball, installed it into a clean project with React 18, then type checked an app importing Button, Chip, ListItem, StatusChip, formatNorwegianDate and cn from the package root under strict mode, exit 0, and bundled @import "@norskmat/design-system/styles.css", fonts resolving and both theme classes present. Also confirmed the docs site and the token linter still build from the new paths.

Files produced,
- src/components/ and src/styles/tokens.css, moved
- src/index.ts, generated; src/styles/index.css; src/styles/fonts/ with OFL.txt
- scripts/build-barrel.mjs and scripts/build-css.mjs, new
- tsconfig.json and tsconfig.build.json, new
- package.json, exports, types, peer deps and the build scripts
- alert-dialog.tsx, carousel.tsx, pagination.tsx, outline variant fixed
- docs/site/tailwind.css and the three scripts, repointed
- SKILL.md, references/, docs/consuming.md, paths and usage updated

## Phase 19, accessibility, WCAG 2.2 AA
Status, done locally. On branch a11y/wcag-aa, cut from design-sync-setup, not pushed.

Borders. Input, Select, Textarea and RadioGroup drew their border in --input, which is surface-container-highest, 1.29:1 on white and 1.08:1 on Spesialitet's beige. A field you cannot see the edge of fails 1.4.11, which asks 3:1. OutlinedTextField and Chip used --border, outline-variant, 1.71:1. All six now use --outline, 4.48:1 on KSL white and 3.74:1 on Spesialitet, the lowest. The --input and --border aliases themselves are unchanged, bg-input is still the switch track and --border still the divider, both legitimately low contrast.

Focus. Tabs, ConnectedButtonGroup, ListItem and TextInputField had no focus style of their own. Each now has a 2px solid ring in --ring. Inset on the tabs, the list item and the segments, because those sit inside scroll containers and a tight pill that clip anything drawn outside. outline-hidden rather than outline-none, so Windows high contrast mode, which drops box-shadow rings, still shows an outline.

Screen readers. The inline svgs in text-input-field, editable-text-field and number-input-with-icon are aria-hidden, each one sits beside text or inside a control that already says what it is.

eslint-plugin-jsx-a11y. Added as npm run lint:a11y, recommended rules over src/components only. ESLint is pinned at 9 because the plugin does not support 10 yet. First run, 49 errors, now 0. What they were,
- 14 clickable icon divs in the inline edit field family. Each one repeats the onClick of the real button beside it, or saves, which Enter and blur already do. They are a bigger mouse target, not a second control, so they are aria-hidden rather than turned into a second tab stop. The bottom sheet backdrop likewise.
- material-checkbox had no input at all, a div with onClick inside a label, so it could not be reached by keyboard and was never announced as a checkbox. Now a visually hidden native checkbox carries focus, keyboard and role, the drawn box is its visual and shows the focus ring through peer-focus-visible.
- 10 Timer and Minutter labels in the three time pickers were not tied to their inputs, so the inputs had no accessible name. Linked with useId.
- OutlinedTextField's floating label was not tied to its input either, same fix. Its click to focus wrapper and the inline editable list item's row are role presentation, the keyboard path is the input or the button inside.
- CardTitle and PaginationLink spread children through props, so the linter could not see their content. They render children explicitly now, output unchanged.
- OutlinedTextField's autoFocus prop stays, with the rule disabled on that one line, it is opt in and meant for the first field of a dialog.

Contrast check. scripts/check-contrast.mjs, npm run lint:contrast. Resolves every token per platform, through var() chains, with a new resolvedTokens() in extract-tokens.mjs so there is one parser, then checks 56 pairs per platform, text roles on the four surfaces components use, every foreground on its fill and container, --outline and --ring on those surfaces. Exits 1 on a failure. All 224 pass. --border and --input are printed as decorative, never failing, so the numbers stay visible.

The rule. SKILL.md now says severity is never shown by colour alone, 1.4.1. The one severity chip in the library, inline-editable-list-item, already carries its text.

Found, not fixed, needs a decision,
- input-otp.tsx and the outline variant of toggle.tsx still border in --input, 1.29:1, same failure as the four fixed above, they were outside this pass.
- Input itself has no focus-visible style, unlike Select and Textarea.
- Button's secondary variant borders in --border, 1.71:1. Its text names it, so 1.4.11 is arguably met, but it is the outlined button.
- The bottom sheet does not close on Escape.
- Several inline edit inputs, the text input family and the time pickers in edit mode, show their label as a p rather than a label, so the input has no accessible name.

Files produced,
- input, select, textarea, radio-group, outlined-text-field, chip, borders
- tabs, connected-button-group, list-item, text-input-field, focus ring
- editable-text-field, number-input-with-icon, text-input-with-icon, time-picker-with-icon, bottom-sheet, aria-hidden
- material-checkbox, native input; time-picker, time-picker-dropdown, time-picker-with-icon, labels; card, pagination, children
- eslint.config.js and scripts/check-contrast.mjs, new; scripts/extract-tokens.mjs, resolvedTokens()
- package.json, lint:a11y and lint:contrast, eslint, eslint-plugin-jsx-a11y and @typescript-eslint/parser pinned
- SKILL.md, two rules

## Phase 19, follow up, the gaps it found
Status, done locally, same branch. Four of the five closed, the fifth decided, left as it is.

A correction first. "Input itself has no focus-visible style" above was wrong. input.tsx splits its classes over three strings inside cn(), and the focus-visible ring is on the second one, identical to Textarea's. The check that produced the claim only read the first string. Nothing to fix.

Borders. input-otp's slots and toggle's outline variant now border in --outline, like the six fields before them. No component in the library borders in --input any more.

Bottom sheet. Escape now closes it, the keyboard equivalent of tapping the backdrop, but only below 1400px. Above that the sheet is display none and its content lives in a side panel, and isOpen can still be true, so an unguarded Escape would have closed state the user cannot see. Checked in a browser at 375px, closes, and at 1500px, does not.

Unnamed inputs. Ten text inputs and textareas had no accessible name, a screen reader announced "edit text" and nothing else. Eight were the edit mode fields of the inline edit family, two more turned up when every input in the library was scanned rather than only the ones already suspected, date-picker and click-to-edit-textarea. Each got the strongest name its markup allowed without changing how it looks,
- a visible label element, tied with htmlFor and useId, date-picker and inline-editable-list-item
- visible label text in a p or span, the input points at it with aria-labelledby, text-input-field, text-input-with-icon, number-input-with-icon, click-to-edit-textarea
- no visible label in edit mode at all, aria-label from the label prop, editable-text-field
Input and Textarea spread their props, so the app using them supplies the name.

Decided, Button's secondary, outlined, variant keeps its --border outline, 1.71:1, 1.42:1 on Spesialitet. Your call. The button's text is what identifies it as a button, so 1.4.11 does not ask the border to reach 3:1, and the outlined button stays quieter than the fields around it. It is the one deliberate exception to "a control's border is --outline", and SKILL.md now says so, so nobody fixes it back. Fields, chips, toggles and the OTP slots are different, an empty field has no text to identify it, its border is the only edge it has.

Still open,
- The bottom sheet is not announced as a dialog, no role="dialog" or aria-modal, and focus does not move into it on open or return on close.

Files produced,
- input-otp.tsx and toggle.tsx, borders
- bottom-sheet.tsx, Escape
- date-picker, inline-editable-list-item, text-input-field, text-input-with-icon, number-input-with-icon, click-to-edit-textarea, editable-text-field, accessible names

## Phase 20, Storybook, preparing for /design-sync
Status, done. On branch storybook-design-sync, cut from a11y/wcag-aa.

Storybook 10.6.1 with the a11y addon, on Vite 7, pinned like everything else. Vite 7 rather than 8 because @tailwindcss/vite has to match the repo's Tailwind 4.1.11, and that version only goes to Vite 7. npm run storybook, npm run build-storybook.

The CSS. .storybook/preview.css imports src/styles/index.css, the same entry that builds dist/norskmat.css, compiled by @tailwindcss/vite on the fly, so a story always shows the current tokens rather than whatever dist/ was last built from. The stories and the decorator are added as Tailwind sources so their layout classes are generated.

Stories live in stories/, not src/components, because that folder is what the package ships and what build-barrel.mjs exports. 35 stories across Button, ConnectedButtonGroup, ListItem, Chip, Input, Select, Checkbox, Switch, Dialog and Tabs.

Themes. A Platform toolbar, defaulting to all four side by side, each column carrying its own theme class. A single platform puts the class on html, the way an app does it, because Dialog and Select render into a portal on body, outside any column, and would always come out KSL. So their open states are one story per platform rather than side by side. Checked in a browser, every column resolves its own --outline, Spesialitet its beige, LokalMat its Georgia stand in, and the open Nyt Norge dialog its own primary.

Checked with axe 4.14 over all 35 stories, WCAG 2.0 to 2.2 A and AA. 31 clean, colour contrast included in all four themes. The four open Select stories report aria-hidden-focus, Radix hides the rest of the page while the list is open and the trigger stays focusable behind it, focus is held in the list so it cannot be reached. An artefact of capturing the open state, not a component defect.

.design-sync/conventions.md, the non negotiable rules from SKILL.md plus how theming works, the html class, portals, what is shared and what changes per platform, the two brands without a theme. Also the three component API traps from the handoff, no outline variant on Button, borders not shadows, nothing in src/components imports outside it. SKILL.md stays the source, the file says so.

A real bug Storybook found. tokens.css maps the spacing scale into Tailwind as --spacing-xs through --spacing-2xl, and Tailwind v4 resolves a named size like max-w-lg from --spacing-lg before its own --container-lg. The same class of collision as --radius-md. So in the shipped CSS,
- dialog.tsx and alert-dialog.tsx, sm:max-w-lg is 24px, meant 32rem, the dialog renders as a 50px strip
- sheet.tsx and drawer.tsx, sm:max-w-sm is 8px, meant 24rem
- time-picker-dropdown.tsx, max-w-md is 16px, meant 28rem
Nothing reported it because the reference site never renders an open dialog.

Fixed, same phase, your call on the approach. The seven uses now name Tailwind's container size outright, max-w-(--container-lg), -sm and -md, which Tailwind keeps in the output as 32rem, 24rem and 28rem because something uses them. No token changed, p-md and gap-lg still mean what they meant. Measured in Storybook, the open dialog is 512px in all four themes. lint:tokens has a new error, 3b, for a named size, the names read from the --spacing-* keys tokens.css defines, on w, h, max-w, min-w, max-h, min-h, size or basis. Run against the unfixed components it reports exactly the five files. The tokens.css comment above that mapping claimed h-lg gave the height scale, it gave 24px, it now says what the names collide with. SKILL.md and conventions.md carry the rule.

Not done, /design-sync itself. Its skill files are not on this machine, so whether it reads Storybook, the stories or .design-sync/conventions.md is still unconfirmed.

Files produced,
- .storybook/main.ts, preview.tsx, preview.css, platforms.ts, new
- stories/, ten story files, new
- .design-sync/conventions.md, new
- package.json, storybook, @storybook/react-vite, @storybook/addon-a11y, vite, @tailwindcss/vite, and the two scripts
- .gitignore, storybook-static/ and storybook logs
- dialog, alert-dialog, sheet, drawer, time-picker-dropdown, container widths
- scripts/lint-tokens.mjs, rule 3b; src/styles/tokens.css, the spacing comment
- SKILL.md and .design-sync/conventions.md, the size name rule

## Phase 21, the Claude Design sync
Status, done. On branch storybook-design-sync. 30 components synced to a new design system project, "Norsk Mat DS (from code)", https://claude.ai/design/p/e9bb49cd-5381-49fc-bb12-8e1776ffeaa7. Not published yet, that is your switch. The hand-built "Norsk Mat Design System" project was left untouched.

Coverage. In the storybook shape a component is documented in Claude Design only if it has stories, so the ten from phase 20 would have left the design agent knowing ten components. Wrote stories for twenty more core ones, Card, Badge, Alert, AlertDialog, Textarea, RadioGroup, Tooltip, DropdownMenu, Popover, Table, Sheet, StatusChip, DatePicker, Accordion, Progress, Breadcrumb, Pagination, OutlinedTextField, TextInputField, Fab. The other ~40 are in the bundle but undocumented; writing stories for them and re-syncing adds them.

Verification. Every story's preview, compiled from the story itself against the shipped bundle, was screenshotted next to the real storybook render and graded by eye. 117 stories, all match. The differences found and accepted are framing: the preview page's padding changes how the four platform columns wrap. Render check 30 of 30 clean.

What the sync needed from the repo, each now in NOTES.md,
- The platform decorator moved from preview.tsx into every story's meta, with-platform.tsx. The sync gives a preview-wide decorator a fixed context, so a story pinned to one platform still rendered four stacked dialogs, all KSL.
- Overlay stories pin their platform with pinPlatform(), a parameter the previews can read as well as the toolbar global.
- The stylesheet loads through previewAnnotations, preview-styles.ts, because esbuild could not bundle preview.tsx with the fonts behind its CSS import.
- preview.css no longer sets the body font. It hid a library bug, below.

Found, not fixed, needs your decision,
- The shipped CSS never applies the brand font to the page. Tailwind's base puts the system sans on html, and --font-family only reaches text with a named type class. Anything sized with text-* or inheriting, DialogTitle, Select options, Table, Badge, renders in the system font in every app and every Claude Design design. Proposed fix, font-family: var(--font-family) in each theme block of tokens.css. Until then conventions.md tells the design agent to set it on its root.
- DatePicker's trailing hint and icon overflow a narrow field. TextInputField's label collapses beside the "Trenger utfylling" chip below about 290px, because the stacked fallback uses a viewport media query. The story agents also listed bugs in Progress (drops value, no aria-valuenow), Pagination (hard-coded English, current page marked only by a low-contrast border), Alert (always role="alert"), Fab (no accessible name when not extended), Table (scroll container not keyboard reachable), DatePicker (unnamed calendar buttons, week starts on Sunday), and others; NOTES.md and the session report carry the full list.

Decisions, yours. Fonts, accept substitutes: Manrope ships; LokalMat uses the Georgia stand-in until Messina Serif and Sands are licensed. The Messina files in the hand-built project, some named Trial, were not used.

Conventions. conventions.md kept as written, plus a section for the design agent, the classes that actually exist in the precompiled CSS, the font workaround, where to look, and a Card example taken from a verified preview. It is the head of the README the design agent reads. Guidelines now come from skills/norsk-mat-design-system/references, not docs/.

Files produced,
- .design-sync/config.json, NOTES.md, new; conventions.md, the agent section
- stories/, twenty story files, new; every story file, withPlatform in its meta
- .storybook/with-platform.tsx, preview-styles.ts, new; main.ts, platforms.ts, preview.tsx, preview.css
- .gitignore, the sync's working folders

## Phase 22, structure in Claude Design
Status, done. Same branch, same project. The project listed a README and thirty components in one flat group; it now has foundations, functional groups, and a theme explorer.

Groups. The Claude Design pane groups a component by the story title segment before its name, so every story is now Components/<Group>/<Name>, six groups, Actions (Button, Fab, ConnectedButtonGroup, Chip), Forms (Input, Textarea, Select, Checkbox, RadioGroup, Switch, DatePicker, OutlinedTextField, TextInputField), Info (Alert, Badge, StatusChip, Progress, Tooltip), Layout (Card, ListItem, Table, Accordion), Navigation (TabGroup, Breadcrumb, Pagination), Overlays (Dialog, AlertDialog, Sheet, Popover, DropdownMenu). Storybook's sidebar got the same structure. A retitle edits the story file, so all thirty were re-captured and re-graded from images, every story match again.

Foundations and the theme explorer. scripts/build-design-cards.mjs, npm run build:cards, writes four cards into design-cards/, gitignored. Colours, Typography, and Spacing and shape come from tokens.css through extract-tokens.mjs, every swatch and specimen is the live token, the severity tiers carry their contrast. The Theme explorer is stories/examples/theme-explorer.tsx, an Egenkontroll dashboard on desktop and a deviation detail on mobile, built only from library components, with a brand switcher and an all-four comparison; it is also the Examples/ThemeExplorer story. The card compiles it against the synced bundle on window.NorskmatDesignSystem, so it runs the same code the project ships.

How they reach the project. First attempt, the sync's guidelines step only takes .md, so .design-sync/overrides/docs.mjs forks it to also take .html and .js, and the cards went to guidelines/design-cards/. That broke Claude Design: with HTML and JS in guidelines/ its rebuild never ran, the old flat index stayed, and none of the new groups showed. Removing those five files let it rebuild. The cards now sit at foundations/ in the project, with the explorer's script at _preview/ThemeExplorer.js beside the component preview scripts, uploaded on their own after the sync. The compare harness does not cover them; each was render-checked in a browser against a copy of the real bundle, in every brand.

Order. Claude Design sorts groups alphabetically, so the two card groups are named 1. Foundations (Colours, Typography, Spacing and shape) and 2. Theme explorer, which puts them above the six component groups, as asked. Confirmed in the project's index.

Found while checking, library, not fixed,
- Bare border classes are dark: no base border colour is set, so Tailwind's default, currentColor, applies. Cards, Alert and Table show it in the explorer.
- Overlay content sets no text colour and inherits the app's body colour; a text-foreground on the app's root div does not reach Radix portals. Fix together with the page font in tokens.css.
- ConnectedButtonGroup does not shrink: below about 300px a long label wraps out of its pill.

Files produced,
- stories/, every title regrouped; stories/examples/theme-explorer.tsx and stories/theme-explorer.stories.tsx, new
- scripts/build-design-cards.mjs, new, writes foundations/ and _preview/ThemeExplorer.js; package.json, build:cards
- .design-sync/config.json, buildCmd, titleMap ThemeExplorer null, guidelinesGlob, libOverrides; .design-sync/overrides/docs.mjs, new; NOTES.md
- .gitignore, design-cards/

## Phase 23, Material 3 audit
Status, done, audit only, no code changed. Every file in src/components/ checked against Material 3, the full table is docs/m3-audit.md. 10 components are M3 already, 19 partly, 39 still shadcn/ui, 17 of those used in stories and 22 extras nothing uses.

What blocks M3 everywhere, no state layers or disabled opacities exist, the shape scale lacks 8 and 16dp, the colour roles lack the inverse set and scrim, the type classes lack body-small and title-small. 24 components still use real shadows against the borders rule. The custom components carry the a11y risk, Tabs has no tab roles or arrow keys, BottomSheet no dialog role or focus trap, the date and time pickers no grid semantics, lint:a11y catches none of it.

Corrections to what we assumed, Tabs is a custom M3 build, not shadcn. Sonner, Carousel, Sidebar, Drawer, ContextMenu, Calendar, Slider, Toggle and ToggleGroup all have M3 counterparts, restyle rather than drop. Fab, MaterialCheckbox and RadioButton are only partly M3.

Suggested order, foundations in tokens.css first, then Card, Table, Button and Pagination, Breadcrumb, Alert, Badge, Accordion, Tabs onto Radix, state layers on the M3 ones in the Theme explorer, forms, overlays, pickers, extras.
Files produced,
- docs/m3-audit.md, new

## Phase 24, Material 3 foundations
Status, done, Phase 0 of docs/m3-audit.md. Tokens and base styles only, the components are not restyled yet, nothing visible changes except borders, fonts and one checkbox border.

Added to tokens.css. Inverse surface, inverse on surface and inverse primary in all four theme blocks, taken from each platform's Figma scheme, for the plain tooltip, snackbar and slider label, and the shared scrim, black, used at 32%. State layer and disabled opacities, 8, 10, 10 and 16 percent, 38 and 12. `--radius-chip` 8px and `--radius-fab` 16px, the two Material 3 shape steps with no token, which makes six radius tokens, spacing.md's rule now says six. `.title-small` and `.body-small`. A `state-layer` class in the components layer, so it ships in dist even before a component uses it.

Base layer. Every theme class, and `:root`, now sets the page font and text colour, so untyped text and Radix portals stop falling back to a system sans in black, LokalMat's untyped text is now its Georgia stand in. Borders default to outline variant instead of currentColor, which turns the near black edges of Card, Alert, Table, Accordion and Sheet light. All in the base layer, so a utility class still wins.

Caught by rendering all 122 stories in all four themes, the Radix Checkbox had a bare border, it had been near black by accident and would have dropped to outline variant, too faint for a control. It now names `border-outline`, like Input, Select and RadioGroup. No other control relied on a bare border.

One value to confirm, Spesialitet's inverse surface in Figma is #2E3039, Nyt Norge's exact bluish value, against a warm palette whose own Neutral 20 is #33302C. Kept as Figma has it, logged as open gap 19 in colors.md.

Checked, lint:tokens 0 errors and 41 to 39 warnings, lint:a11y, lint:contrast 58 pairs per theme with the two new inverse pairs at about 11.5 and 7.7 to 1, build, docs and cards. The state layer measured in Storybook, 8% on hover, 10% on keyboard focus, 0 when disabled. Not synced to Claude Design yet.
Files produced,
- src/styles/tokens.css, inverse roles, scrim, state and disabled opacities, two radii, two type classes, base layer, state-layer class
- src/components/checkbox.tsx, border-outline; chip.tsx and fab.tsx, raw radii now the new tokens
- scripts/check-contrast.mjs, inverse pairs; scripts/extract-tokens.mjs, Inverse colour group for the docs and the Colours card; scripts/lint-tokens.mjs, six radius tokens
- .storybook/preview.css, page background only
- references colors.md, typography.md, spacing.md, components.md; .design-sync/conventions.md and NOTES.md

## Phase 7, assets
Status, in progress. Logo files organized, one folder per platform, each with a README covering what we have, what is missing, and usage rules where confirmed.
Files produced,
- assets/ksl/ksl_logo_med_ramme_rgb.svg
- assets/ksl/ksl_logo_med_ramme_rgb.png
- assets/ksl/ksl_logo_enkel_rgb.svg
- assets/ksl/README.md
- assets/nytnorge/nytnorge_medomriss_rgb.svg
- assets/nytnorge/nytnorge_medomriss_rgb.png
- assets/nytnorge/nytnorge_utenomriss_rgb.svg
- assets/nytnorge/nytnorge_utenomriss_rgb.png
- assets/nytnorge/README.md
- assets/beskyttede-betegnelser/bgb_logo_rgb.svg
- assets/beskyttede-betegnelser/bgb_logo_rgb.png
- assets/beskyttede-betegnelser/README.md
- assets/spesialitet/spesialitet_hovedlogo_rgb.svg
- assets/spesialitet/spesialitet_hovedlogo_rgb.png
- assets/spesialitet/README.md
- assets/stiftelsen-norsk-mat/logo_rgb.svg
- assets/stiftelsen-norsk-mat/logo_rgb.png
- assets/stiftelsen-norsk-mat/README.md
- assets/lokalmat/lokalmat_logo.png
- assets/lokalmat/lokalmat_logo.svg
- assets/lokalmat/README.md

Still missing, combined KSL logo without frame, official variant not yet in hand.

## Phase 8, SKILL.md
Status, done. Written last as planned, once every reference file existed to point to. Includes a confidence section so nobody assumes Nyt Norge or Spesialitet are as deeply audited as KSL, and a clear statement that this describes the intended system, not the current live app.
Files produced,
- SKILL.md, rewritten with frontmatter, confidence levels per platform, how to use this, reference index, asset index, non negotiable rules, and how to keep it current

Also removed, the empty platforms/ folder from phase 0, everything platform specific ended up living inside colors.md and typography.md as tables instead, an empty, unreferenced folder would only confuse the next person.

## Phase 8, update
Status, done. Restored platforms/ per your request, empty folders should still carry a short written outline of intended future scope rather than disappear entirely. Added platforms/README.md explaining what belongs there, why it is still empty, and current status per platform. Renamed the project itself, norskmat-design-system to norsk-mat-design-system, for a cleaner, more recognizable name, updated everywhere including the SKILL.md frontmatter.
Files produced,
- platforms/README.md, new
- SKILL.md, updated name and reference index

## Phase 9, testing
Status, first pass done. Ran one realistic smoke test, build a KSL avvik filter row using ConnectedButtonGroup, plus one ListItem row for a Vesentlig deviation, using only the skill files, no outside knowledge. Caught a real gap, colors.md gave correct hex values for Vesentlig and Mindre alvorlig but never defined what to actually type in code, the test defaulted to `var(--error)` for a Vesentlig row since that was the only deviation color with an established variable, which mislabels severity. Fixed by adding named CSS variables for Vesentlig and Mindre alvorlig to colors.md, and a rule against falling back to `--error` for the other two tiers.
Files produced,
- references/colors.md, updated, added CSS variable names for Vesentlig and Mindre alvorlig, plus a rule against the fallback mistake found in testing

## Phase 10, GitHub connection
Status, not started. Repo already created by you at github.com/Farnaz-shahriari/norskmat-design-system, nothing pushed yet, everything so far lives only in this chat's workspace and in the files presented to you here.
Files produced, none yet.

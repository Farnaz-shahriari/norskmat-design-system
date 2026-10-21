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

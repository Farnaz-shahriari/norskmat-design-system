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
Status, in progress. Audited all 67 files in the shared UI library file by file against colors.md. Confirmed real platform bleed bugs, switch.tsx hardcodes three literal KSL colors instead of variables, six form field files hardcode KSL's on surface variant color directly, both still need the token fix, not yet applied to the app. Found one undocumented color, inline-editable-list-item.tsx, confirmed by you as a mistake, resolved as Vesentlig, no new tier. Built the two confirmed missing components, ConnectedButtonGroup and ListItem with density and trailing content variants, based on your own repeated Figma patterns rather than the open source Material 3 library, since Google's own segmented button implementation is unmaintained upstream. IconButton kept as is per your call, the primitive already exists, it is simply under used. Note for later, KSL app bar logo sizing does not follow the 250px brand minimum, real component rules will need their own smaller minimum, see assets/ksl/README.md.
Files produced,
- references/components.md, full tiered audit, keep as is, needs token fix, resolved decision, and what got built
- assets/components/connected-button-group.tsx
- assets/components/list-item.tsx

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

## Phase 9, testing
Status, first pass done. Ran one realistic smoke test, build a KSL avvik filter row using ConnectedButtonGroup, plus one ListItem row for a Vesentlig deviation, using only the skill files, no outside knowledge. Caught a real gap, colors.md gave correct hex values for Vesentlig and Mindre alvorlig but never defined what to actually type in code, the test defaulted to `var(--error)` for a Vesentlig row since that was the only deviation color with an established variable, which mislabels severity. Fixed by adding named CSS variables for Vesentlig and Mindre alvorlig to colors.md, and a rule against falling back to `--error` for the other two tiers.
Files produced,
- references/colors.md, updated, added CSS variable names for Vesentlig and Mindre alvorlig, plus a rule against the fallback mistake found in testing

## Phase 10, GitHub connection
Status, not started. Repo already created by you at github.com/Farnaz-shahriari/norskmat-design-system, nothing pushed yet, everything so far lives only in this chat's workspace and in the files presented to you here.
Files produced, none yet.

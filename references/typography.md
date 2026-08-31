# Typography

Source, `src/styles/globals.css`, `src/styles/fonts.css`, and actual usage frequency counted across the KSL Foretak codebase. Quatro was tried and dropped, see "Known gap, resolved" below, do not reintroduce it.

## Font families, per platform

KSL, Nyt Norge, and Spesialitet share one family.

* Manrope, primary, loaded from Google Fonts, weights 400 Regular, 500 Medium, 600 SemiBold.
* Work Sans, Poppins, fallback stack only, `'Manrope', 'Work Sans', 'Poppins', sans-serif`, not used directly anywhere in real usage.

LokalMat is the one platform that differs.

* Messina Serif, Sands, confirmed by you directly, not yet present in any codebase, LokalMat has not been built yet, treat as the target for when that platform starts.

## Type scale, same sizes across all platforms

Real usage confirms the below is the actual scale in use, ranked by how often each size shows up in the app, from most to least common.

| Size | Token | Real usage count |
|---|---|---|
| 14px | text-sm | 1568 |
| 16px | text-base | 1283 |
| 12px | label-small size, not in the named scale | 505 |
| 22px | text-lg | 94 |
| 11px | label-xsmall size, not in the named scale | 94 |
| 18px | text-md | 22 |
| 24px | close to text-xl, 24px | 7 |
| 32px | text-2xl | rare, headline only |
| 57px | text-4xl | rare, largest heading only |

## Named styles, ranked by real usage, most used first

| Class | Size | Weight | Line height | Usage count |
|---|---|---|---|---|
| label-medium | 14px | 500 | 1.5 | 708 |
| body-medium | 14px | 400 | 1.5 | 487 |
| body-large | 16px | 400 | 1.5 | 459 |
| label-small | 12px | 500 | 16px | 368 |
| label-large | 14px | 500 | 1.5 | 117 |
| title-medium | 18px | 500 | 1.2 | 92 |
| title-large | 22px | 500 | 1.5 | 55 |
| label-xsmall | 11px | 500 | 14px | 21 |
| headline-medium | 32px | 400 | 1.5 | 4 |

Body and label text carry almost all real usage, headline-medium barely appears, most screens are dense, data heavy, not headline driven. Keep this in mind for KSL and its sibling platforms, this is a working tool, not a marketing page.

## Known gap, resolved

The design system guideline once called for a second heading font, Quatro. It was never actually loaded anywhere, no import, no font file, and about 130 places in the codebase hardcoded a reference to it directly, meaning those headings silently fell back to a generic system sans-serif in the browser, not Quatro, not Manrope. You confirmed Quatro caused visible font inconsistency and removed it. Manrope is now the only heading and body font for KSL, Nyt Norge, Spesialitet. Do not reintroduce Quatro, and if you revisit those ~130 hardcoded instances later, replace them with the named classes above rather than another literal font string.

## Implementation

Everything above was, until now, a table in this file only, nothing implemented it. `assets/tokens.css` now defines every named class, `.headline-medium`, `.title-large`, and so on, plus the underlying `--text-*` and `--font-weight-*` variables, using `var(--font-family)`, not a hardcoded font, so LokalMat automatically picks up Messina Serif and Sands the moment those files are real, no separate rule needed per platform.

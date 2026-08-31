# Platforms

This folder is reserved, not currently holding files, keeping it here so the project's original scope stays visible for future work.

## What was planned here

A dedicated file per platform, `ksl.md`, `nytnorge.md`, `lokalmat.md`, `spesialitet.md`, `beskyttede-betegnelser.md`, `stiftelsen-norsk-mat.md`, covering anything specific to that one platform that does not fit cleanly into the shared reference files.

## Why it is still empty

In practice, every platform specific decision made so far, brand colors, surfaces, fonts, fit cleanly as a table inside `references/colors.md` and `references/typography.md`, one column or one section per platform. A separate file per platform was not needed yet.

## When to actually use this folder

Once a platform needs more than colors, fonts, and logos, its own component overrides, its own layout exceptions, its own full component library once LokalMat is actually built, put that here as `<platform>.md`, rather than growing the shared reference files sideways with content that only applies to one platform.

## Status per platform, for quick reference

- KSL, no dedicated file needed, fully covered by the shared references.
- Nyt Norge, Spesialitet, LokalMat, no dedicated file needed yet, colors and fonts covered, logo usage rules still open, see their asset READMEs.
- Beskyttede Betegnelser, Stiftelsen Norsk Mat, no color, type, or component decisions made yet at all, logo only.

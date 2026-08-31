# KSL, logo assets

## Files here

* `ksl_logo_med_ramme_rgb.svg`, `ksl_logo_med_ramme_rgb.png`, combined KSL plus Nyt Norge logo, with frame, for colored backgrounds.
* `ksl_logo_enkel_rgb.svg`, KSL alone, enkel logo, single version for all surfaces.

## Still missing, official variants we do not have yet

* Combined logo without frame, for white or neutral backgrounds.

## Official brand rule, from designguide.norskmat.no

* Combined logo, used for communication with raw material suppliers and farmers, never toward the consumer, never on packaging.
* Minimum width, 250px on screen, 30mm on print.
* Enkel logo, used when the receiver does not meet the requirements for the combined logo, same non consumer context, minimum width 150px on screen, 20mm on print.

## Practical note, real product deviation

The 250px minimum is a print and marketing rule, it is too large for tight UI contexts like an app bar or a compact header. In the actual KSL product, this rule has not been followed. For the design system, treat this as two separate rules going forward.

* Marketing, print, official partner communication, follow the 250px and 150px minimums as written.
* Product UI, app bar, navigation, compact headers, define a separate, smaller minimum once we get to the components phase, based on what is legible at real screen sizes, not the brand minimum.

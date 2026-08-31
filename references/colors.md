# Colors

Source of truth, confirmed, the Figma variables export, one JSON per platform, generated from Material 3 Theme Builder plus manual additions for deviation severity. Not the app's current CSS or `severityColors.ts`, those have real drift, see "Known gaps" at the bottom.

## Shared, semantic, same across every platform

Deviation severity and error colors are identical across KSL, Nyt Norge, Spesialitet, LokalMat. Define these once, reuse everywhere.

| Tier | Main | On main | Container | On container | CSS variable |
|---|---|---|---|---|---|
| Kritisk, error | #BA1A1A | #FFFFFF | #FFDAD6 | #410002 | `--error`, `--error-foreground`, `--error-container`, `--error-container-foreground`, already wired app wide, keep using it |
| Vesentlig | #A84300 | #FFFFFF | #FDD19F | #3D2100 | `--vesentlig`, `--vesentlig-foreground`, `--vesentlig-container`, `--vesentlig-container-foreground`, new, not yet in globals.css |
| Mindre alvorlig | #705400 | #FFFFFF | #FFEDD0 | #3D2E00 | `--mindre-alvorlig`, `--mindre-alvorlig-foreground`, `--mindre-alvorlig-container`, `--mindre-alvorlig-container-foreground`, new, not yet in globals.css |

Vesentlig and Mindre alvorlig do not have real CSS variables in the app yet, only Kritisk does, reusing `--error`. Until the two new ones are added to `globals.css`, do not fall back to `--error` for a Vesentlig or Mindre alvorlig item, that mislabels the severity. Use the hex value directly and flag it as temporary, or add the variables first.

## Platform brand colors

### KSL

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #4A671E | #FFFFFF | #EFF1E7 | #284000 |
| Secondary | #365BAE | #FFFFFF | #DAE2FF | #174295 |
| Tertiary | #005D21 | #FFFFFF | #B3F2B3 | #00531C |

### Nyt Norge

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #00319E | #FFFFFF | #DCE1FF | #0039B5 |
| Secondary | #446900 | #FFFFFF | #C3E196 | #213600 |
| Tertiary | #4D6629 | #FFFFFF | #C9E79B | #344B11 |

### Spesialitet

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #594414 | #FFFFFF | #E5DBC9 | #221700 |
| Secondary | #212222 | #FFFFFF | #424242 | #DAD8D7 |
| Tertiary | #6B5D3E | #FFFFFF | #D3C19B | #3E3217 |

### LokalMat

| Role | Main | On main | Container | On container |
|---|---|---|---|---|
| Primary | #A80000 | #FFFFFF | #E69D9D | #330000 |
| Secondary | #0D310D | #FFFFFF | #B1E6B1 | #0E330E |
| Tertiary | #424242 | #FFFFFF | #E6E6E6 | #333333 |

## Surfaces and background, per platform

| Token | KSL | Nyt Norge | Spesialitet | LokalMat |
|---|---|---|---|---|
| Background | #FFFFFF | #FFFFFF | #EFEADF | #FFFFFF |
| On background | #1A1C16 | #1A1B23 | #1E1B17 | #1B1C1A |
| Surface | #FFFFFF | #FFFFFF | #EFEADF | #FFFFFF |
| On surface | #1A1C16 | #1A1B23 | #1E1B17 | #1B1C1A |
| Surface variant | #E0E4D3 | #E0E1F4 | #ECE1D1 | #DFE4DC |
| On surface variant | #44483B | #434655 | #4D463A | #434842 |
| Outline | #74796A | #747686 | #7E7669 | #737872 |
| Outline variant | #C4C8B7 | #C4C5D7 | #D0C5B6 | #C3C8C0 |
| Surface bright | #FAFAF0 | #FAF8FF | #FFF8F2 | #FBF9F6 |
| Surface dim | #DADBD1 | #D9D9E4 | #E0D9D2 | #DBDAD7 |
| Surface container lowest | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| Surface container low | #F4F4EA | #F3F2FE | #FAF2EB | #F5F3F0 |
| Surface container | #EEEEE4 | #EDEDF8 | #F4EDE5 | #EFEEEB |
| Surface container high | #E9E9DF | #E8E7F3 | #EEE7E0 | #E9E8E5 |
| Surface container highest | #E3E3D9 | #E2E1ED | #E8E1DA | #E4E2DF |

## Known gaps, confirmed against the KSL Foretak app codebase, fix before relying on the app as a reference

1. `src/app/utils/severityColors.ts`, Vesentlig container is wrong, currently `#ffddcc` / `#4a2800`, should be `#FDD19F` / `#3D2100`.
2. Vesentlig main color, `#A84300`, is not wired into the app at all, one real component collapses Vesentlig and Mindre alvorlig into the same yellow icon color, the three tier system is not fully implemented in the UI yet.
3. `src/styles/globals.css` has dead, unused variables, `--s-avvik-container`, `--l-avvik-container`, `--avvik-container`, none are referenced by any component, and their values do not match this file, safe to remove or correct.
4. `globals.css` brand and surface tokens have drifted from this file in small ways for KSL, Nyt Norge, Spesialitet, and more substantially for LokalMat, primary container, secondary, tertiary are all different colors there. `--outline-variant` is missing entirely for Nyt Norge, Spesialitet, LokalMat.
5. `inline-editable-list-item.tsx` uses an orphan orange, `#663C00` / `#FF9800` / `#FFF4E5`, matching nothing above. Confirmed resolved, this was a mistake, replace it with Vesentlig, `#A84300` main, `#FDD19F` / `#3D2100` container. No other orange should be introduced anywhere in the system, Vesentlig is the only orange.

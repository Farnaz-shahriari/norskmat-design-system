/**
 * Norwegian date formatting.
 *
 * Recreated here. The original lived at ../../utils/dateFormat, outside this
 * repo, so date-time-picker.tsx could not build. Uses the platform's own
 * Intl data rather than a month name table, so it stays correct without
 * maintenance.
 */

/** "12. august 2026". Returns an empty string for a missing date. */
export function formatNorwegianDate(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** "12.08.2026", for dense rows and tables where the long form will not fit. */
export function formatNorwegianDateShort(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Helpers for the date range that is stored in the URL query string.
 *
 * The URL always holds plain calendar days (`YYYY-MM-DD`). The helpers convert
 * them to and from `Date` objects in the *local* time zone, so the calendar
 * shows the day the user picked. `toISOString()` is deliberately not used:
 * it would shift the day for every time zone behind UTC.
 */

const DATE_PARAM_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses a `YYYY-MM-DD` query value into a local date (or `undefined`). */
export function parseDateParam(value?: string | null): Date | undefined {
  if (!value) return undefined;

  const match = DATE_PARAM_PATTERN.exec(value.trim());
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);
  // Reject days that do not exist (e.g. 2026-02-31 -> March 3rd).
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

/** Formats a date as the `YYYY-MM-DD` value used in the URL and the API. */
export function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

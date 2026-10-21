/**
 * Fixed locale for every number that is rendered from data.
 *
 * `Number.prototype.toLocaleString()` without an argument uses the runtime
 * default locale, which differs between the Node server (usually `en-US`) and
 * the browser (whatever the user picked). That makes the server markup and the
 * first client render differ, so a fixed locale is used everywhere.
 */
export const DEFAULT_LOCALE = "en-US";

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);

const absoluteDateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats a number with the app locale (e.g. `1,234`). */
export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/**
 * Formats an ISO date with a fixed locale *and* time zone, so the result is
 * identical on the server and in the browser (e.g. `Sep 21, 2026`).
 */
export function formatAbsoluteDate(value: string | Date) {
  return absoluteDateFormatter.format(new Date(value));
}

/** Today's date in London as YYYY-MM-DD, so it compares directly with content dates. */
export function londonToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now);
}

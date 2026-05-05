export type WeekRef = { year: number; week: number };

/** Monday of ISO week */
export function weekRefToDate(ref: WeekRef): Date {
  const jan4 = new Date(ref.year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (ref.week - 1) * 7);
  return monday;
}

/** ISO week ref for a given date */
export function dateToWeekRef(date: Date): WeekRef {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return {
    year: d.getFullYear(),
    week: Math.round(((d.getTime() - jan1.getTime()) / 86400000 + 1) / 7),
  };
}

/** Generate array of all WeekRefs between start and end (inclusive) */
export function generateWeekColumns(start: WeekRef, end: WeekRef): WeekRef[] {
  const cols: WeekRef[] = [];
  let cur = { ...start };
  while (compareWeeks(cur, end) <= 0) {
    cols.push({ ...cur });
    cur = nextWeek(cur);
  }
  return cols;
}

export function nextWeek(ref: WeekRef): WeekRef {
  const d = weekRefToDate(ref);
  d.setDate(d.getDate() + 7);
  return dateToWeekRef(d);
}

export function compareWeeks(a: WeekRef, b: WeekRef): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.week - b.week;
}

export function weeksBetween(start: WeekRef, end: WeekRef): number {
  const ms = weekRefToDate(end).getTime() - weekRefToDate(start).getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}

export function weekLabel(ref: WeekRef): string {
  return String(ref.week);
}

/** Short month label for the first week of each month group */
export function monthLabel(ref: WeekRef): string {
  const d = weekRefToDate(ref);
  return d.toLocaleString("nl-NL", { month: "short", year: "2-digit" });
}

/** Group week columns by month */
export function groupWeeksByMonth(
  cols: WeekRef[]
): { label: string; weeks: WeekRef[] }[] {
  const groups: { label: string; weeks: WeekRef[] }[] = [];
  for (const col of cols) {
    const d = weekRefToDate(col);
    const label = d.toLocaleString("nl-NL", { month: "long", year: "numeric" });
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.weeks.push(col);
    } else {
      groups.push({ label, weeks: [col] });
    }
  }
  return groups;
}

export const TIMELINE_START: WeekRef = { year: 2026, week: 14 };
export const TIMELINE_END: WeekRef = { year: 2027, week: 13 };
export const WEEK_COL_WIDTH = 28; // px

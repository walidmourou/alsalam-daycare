const VACATION_RANGES: ReadonlyArray<readonly [string, string]> = [
  ["2026-07-30", "2026-09-12"],
  ["2026-10-26", "2026-10-31"],
  ["2026-12-23", "2027-01-09"],
  ["2027-03-25", "2027-03-25"],
  ["2027-03-30", "2027-04-03"],
  ["2027-05-18", "2027-05-29"],
];

export const LAST_SATURDAY = "2027-07-24";

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfSaturday(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const diff = (6 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export function isVacation(iso: string): boolean {
  return VACATION_RANGES.some(([start, end]) => iso >= start && iso <= end);
}

export function getValidSaturdays(from: Date = new Date()): string[] {
  const start = startOfSaturday(from);
  const end = new Date(`${LAST_SATURDAY}T00:00:00`);
  const dates: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
    const iso = toISO(d);
    if (!isVacation(iso)) dates.push(iso);
  }
  return dates;
}

export function isValidSaturday(iso: string, from: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return getValidSaturdays(from).includes(iso);
}

/** Calendar dates use local time so selecting a day never shifts it across time zones. */
export function localDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateAfterDays(days: number, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return localDateInput(date);
}

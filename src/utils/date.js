const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function todayISO() {
  return toISODate(new Date());
}

export function toISODate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function dayKey(dateISO) {
  return DAY_KEYS[new Date(`${dateISO}T00:00:00`).getDay()];
}

export function addDays(dateISO, amount) {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

export function isWithinRange(dateISO, startISO, endISO) {
  if (startISO && dateISO < startISO) return false;
  if (endISO && dateISO > endISO) return false;
  return true;
}

export function lastNDays(n, endISO = todayISO()) {
  return Array.from({ length: n }, (_, i) => addDays(endISO, -(n - 1 - i)));
}

export function isReminderDueOn(reminder, dateISO) {
  if (!isWithinRange(dateISO, reminder.startDate, reminder.endDate)) return false;
  if (reminder.repeat === 'once') return dateISO === reminder.startDate;
  if (reminder.repeat === 'daily') return true;
  if (reminder.repeat === 'weekly') return (reminder.days ?? []).includes(dayKey(dateISO));
  return false;
}

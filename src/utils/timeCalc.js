export const DAYS_NL = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

export const MONTHS_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

export function calcHours(start, end) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  return diff > 0 ? parseFloat((diff / 60).toFixed(1)) : null;
}

export function getDayOfWeek(dateStr) {
  return DAYS_NL[new Date(dateStr).getDay()];
}

export function formatDateNL(dateStr) {
  const [, m, d] = dateStr.split('-');
  return `${Number(d)} ${MONTHS_NL[Number(m) - 1]}`;
}

export function getTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

export function totalHours(records) {
  return records.reduce((sum, r) => sum + (calcHours(r.start, r.end) || 0), 0);
}

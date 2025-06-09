// utils/cleaners.ts
export function cleanNumber(val: any): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  let s = String(val).trim().replace(/\s/g, '');
  // miles: punto o coma si está seguido de 3 dígitos
  s = s.replace(/(\d)[.,](?=\d{3}\b)/g, '$1');
  // coma decimal a punto
  s = s.replace(/,(\d{1,})$/, '.$1');
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}
export function cleanString(val: any): string {
  if (val == null) return '';
  if (typeof val === 'string') return val.trim();
  return String(val).trim();
}
export function cleanDate(val: any): Date | null {
  if (val == null) return null;
  if (val instanceof Date) return val;
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
}
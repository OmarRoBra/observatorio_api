"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanNumber = cleanNumber;
exports.cleanString = cleanString;
exports.cleanDate = cleanDate;
// utils/cleaners.ts
function cleanNumber(val) {
    if (val == null)
        return 0;
    if (typeof val === 'number')
        return val;
    let s = String(val).trim().replace(/\s/g, '');
    // miles: punto o coma si está seguido de 3 dígitos
    s = s.replace(/(\d)[.,](?=\d{3}\b)/g, '$1');
    // coma decimal a punto
    s = s.replace(/,(\d{1,})$/, '.$1');
    const n = Number(s);
    return isNaN(n) ? 0 : n;
}
function cleanString(val) {
    if (val == null)
        return '';
    if (typeof val === 'string')
        return val.trim();
    return String(val).trim();
}
function cleanDate(val) {
    if (val == null)
        return null;
    if (val instanceof Date)
        return val;
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
}

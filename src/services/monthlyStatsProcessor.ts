import MonthlyStats from '../models/MonthlyStats.model';

function cleanMoney(val: any) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // Quitar símbolos, espacios, y convertir a número
    const cleaned = val.trim().replace(/[^0-9.,-]+/g, '').replace(/\s+/g, '').replace(/^0+(?=\d)/, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}

function parseNumber(val: any) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // Quitar espacios, comas, y reemplazar comas decimales por punto
    const cleaned = val.trim().replace(/,/g, '').replace(/\s+/g, '').replace(/^0+(?=\d)/, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}

export async function insertMonthlyStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await MonthlyStats.upsert({
      year: Number(row['Año']),
      month: row['Mes'],
      municipality: row['Municipio'],
      occupancyRate: parseNumber(row['Ocupación %']),
      touristFlow: parseNumber(row['Afluencia Turística']),
      economicImpact: cleanMoney(row['Derrama Económica']),
    }, {
      conflictFields: ['year', 'month', 'municipality']
    });
  }
}

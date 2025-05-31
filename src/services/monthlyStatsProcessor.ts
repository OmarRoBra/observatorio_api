import MonthlyStats from '../models/MonthlyStats.model';

function cleanMoney(val: any) {
  if (typeof val === 'string') return Number(val.replace(/[^0-9.]+/g, ''));
  return val;
}

export async function insertMonthlyStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await MonthlyStats.upsert({
      year: Number(row['Año']),
      month: row['Mes'],
      municipality: row['Municipio'],
      occupancyRate: Number(row['Ocupación %']),
      touristFlow: Number(row['Afluencia Turística']),
      economicImpact: cleanMoney(row['Derrama Económica']),
    }, {
      conflictFields: ['year', 'month', 'municipality']
    });
  }
}

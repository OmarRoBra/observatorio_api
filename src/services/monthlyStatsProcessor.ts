import MonthlyStats from '../models/MonthlyStats.model';
import { sequelize } from '../config/database';

function cleanMoney(val: any) {
  if (typeof val === 'string') return Math.round(Number(val.replace(/[^0-9.]+/g, '')));
  return Math.round(Number(val));
}

export async function insertMonthlyStatsFromExcel(rows: any[]) {
  // Transacción: si una fila falla, no se guarda nada (evita cargas parciales)
  await sequelize.transaction(async (transaction) => {
    for (const row of rows) {
      const year = Number(row['Año']);
      const month = row['Mes']?.toString().trim();
      const municipality = row['Municipio']?.toString().trim();
      if (!year || !month || !municipality) continue;

      await MonthlyStats.upsert({
        year,
        month,
        municipality,
        occupancyRate: Number(row['Ocupación %']),
        // La columna es INTEGER: el Excel trae decimales en "Estatal" (ej. 121140.51)
        touristFlow: Math.round(Number(row['Afluencia Turística'])),
        economicImpact: cleanMoney(row['Derrama Económica']),
      }, {
        conflictFields: ['year', 'month', 'municipality'],
        transaction,
      });
    }
  });
}

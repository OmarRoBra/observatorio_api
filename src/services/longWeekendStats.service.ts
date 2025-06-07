/* import LongWeekendStats from '../models/LongWeekendStats.model';

// Mapeo Excel->BD
const fieldMap: Record<string, string> = {
  "Año": "year",
  "Fin de semana largo": "bridge_name",
  "Municipio": "municipality",
  "Tasa de ocupación": "occupancy_rate",
  "Oferta cuartos": "room_offer",
  "Cuartos ocupados": "occupied_rooms",
  "Cuartos disponibles": "available_rooms",
  "Estadía promedio": "average_stay",
  "Densidad de ocupación": "occupancy_density",
  "Noches": "nights",
  "Turistas noche": "tourists_per_night",
  "GPD": "daily_avg_spending",
  "Derrama económica": "economic_impact",
  "Afluencia turística": "tourist_flow"
};

// Limpieza universal para números
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/\./g, '').replace(',', '.');
    const num = Number(cleaned.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export async function insertLongWeekendStatsFromExcel(rows: any[]) {
  const records = rows.map(row => {
    const record: any = {};
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      record[modelKey] = cleanNumber(row[excelKey]);
    }
    return record;
  });
  await LongWeekendStats.bulkCreate(records, { ignoreDuplicates: true });
}
 */
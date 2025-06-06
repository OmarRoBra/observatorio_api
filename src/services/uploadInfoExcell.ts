import HolidayStats from '../models/HolidayStats.model';

function cleanNumber(val: any) {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    let cleaned = val.replace(/\s/g, '').replace(/,/g, '');
    let num = Number(cleaned.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? null : num;
  }
  return null;
}

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await HolidayStats.create({
      year: cleanNumber(row['Año']),
      bridge_name: row['Fin de semana largo'] || "",
      municipality: row['Municipio'] || "",
      occupancy_rate: cleanNumber(row['Tasa de ocupación']),
      room_offer: cleanNumber(row['Oferta cuartos']),
      occupied_rooms: cleanNumber(row['Cuartos ocupados']),
      available_rooms: cleanNumber(row['Cuartos disponibles']),
      average_stay: cleanNumber(row['Estadía promedio']),
      occupancy_density: cleanNumber(row['Densidad de ocupación']),
      nights: cleanNumber(row['Noches']),
      tourists_per_night: cleanNumber(row['Turistas noche']),
      daily_avg_spending: cleanNumber(row['GPD']),
      economic_impact: cleanNumber(row['Derrama económica']),
      tourist_flow: cleanNumber(row['Afluencia turística']),
    });
  }
}

import HolidayStats from '../models/HolidayStats.model';

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    try {
      await HolidayStats.create({
        year: Number(row['Año']),
        bridge_name: row['Fin de semana largo'] || "",
        municipality: row['Municipio'] || "",
        occupancy_rate: Number(row['Tasa de ocupación']),
        room_offer: Number(row['Oferta cuartos']),
        occupied_rooms: Number(row['Cuartos ocupados']),
        available_rooms: Number(row['Cuartos disponibles']),
        average_stay: Number(row['Estadía promedio']),
        occupancy_density: Number(row['Densidad de ocupación']),
        nights: Number(row['Noches']),
        tourists_per_night: Number(row['Turistas noche']),
        daily_avg_spending: Number(row['GPD']),
        economic_impact: Number(row['Derrama económica']),
        tourist_flow: Number(row['Afluencia turística']),
      });
    } catch (e) {
      console.error("❌ Error insertando fila:", e, row);
      throw e;
    }
  }
}

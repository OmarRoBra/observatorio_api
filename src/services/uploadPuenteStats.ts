import HolidayStats from '../models/HolidayStats.model';



export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await HolidayStats.create({
      year: Number(row['Año']),
      bridge_name: row['Fin de semana largo'] || "",
      municipality: row['Municipio'] || "",
      occupancy_rate: (row['Tasa de ocupación']),
      room_offer: (row['Oferta cuartos']),
      occupied_rooms: (row['Cuartos ocupados']),
      available_rooms: (row['Cuartos disponibles']),
      average_stay: (row['Estadía promedio']),
      occupancy_density: (row['Densidad de ocupación']),
      nights:(row['Noches']),
      tourists_per_night: (row['Turistas noche']),
      daily_avg_spending: (row['GPD']),
      economic_impact: (row['Derrama económica']),
      tourist_flow: (row['Afluencia turística']),
    });
  }
}

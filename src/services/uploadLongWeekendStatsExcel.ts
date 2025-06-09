import LongWeekendStats from '../models/LongWeekendStats.model';

export async function insertLongWeekendStatsFromExcel(data: any[]) {
  const formatted = data.map((row) => ({
    year: parseInt(row['Año']),
    bridge_name: row['Puente']?.toString().trim(),
    municipality: row['Municipio']?.toString().trim(),
    occupancy_rate: parseFloat(row['% Ocupación']),
    room_offer: parseInt(row['Oferta Cuartos']),
    occupied_rooms: parseInt(row['Cuartos Ocupados']),
    available_rooms: parseInt(row['Cuartos Disponibles']),
    average_stay: parseFloat(row['Estadía Promedio']),
    occupancy_density: parseFloat(row['Densidad de Ocupación']),
    nights: parseInt(row['Noches']),
    tourists_per_night: parseInt(row['Turistas por Noche']),
    daily_avg_spending: parseFloat(row['Gasto Diario Promedio']),
    economic_impact: parseInt(
      row['Derrama Económica']?.toString().replace(/,/g, '')
    ),
    tourist_flow: parseInt(row['Afluencia Turística']),
  })).filter((row) => row.bridge_name);

  await LongWeekendStats.bulkCreate(formatted);
}

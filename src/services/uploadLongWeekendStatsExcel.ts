import LongWeekendStats from '../models/LongWeekendStats.model';

export async function insertLongWeekendStatsFromExcel(data: any[]) {
  const formatted = data.map((row) => ({
    year: parseInt(row['Año']),
    bridge_name: row['Fin de semana largo']?.toString().trim(),
    municipality: row['Municipio']?.toString().trim(),
    occupancy_rate: parseFloat(row['Tasa de ocupación']),
    room_offer: parseInt(row['Oferta cuartos']),
    occupied_rooms: parseFloat(row['Cuartos ocupados']),
    available_rooms: parseInt(row['Cuartos disponibles']),
    average_stay: parseFloat(row['Estadía promedio']),
    occupancy_density: parseFloat(row['Densidad de ocupación']),
    nights: parseInt(row['Noches']),
    tourists_per_night: parseFloat(row['Turistas noche']),
    daily_avg_spending: parseFloat(row['Gasto promedio diario']),
    economic_impact: parseFloat(row['Derrama económica']),
    tourist_flow: parseFloat(row['Afluencia turística']),
  })).filter((row) => row.bridge_name);

  console.log('Filas a insertar:', formatted.length);
  await LongWeekendStats.bulkCreate(formatted);
}

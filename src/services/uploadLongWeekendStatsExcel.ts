// services/longWeekendStats.service.ts
import LongWeekendStats from '../models/LongWeekendStats.model';
import { cleanNumber } from '../utils/cleaners';

export async function insertLongWeekendStatsFromExcel(data: any[]) {
  const formatted = data
    .map((row, idx) => {
      const year = cleanNumber(row['Año']);
      const bridge_name = row['Fin de semana largo']?.toString().trim() || '';
      const municipality = row['Municipio']?.toString().trim() || '';
      if (!year || !bridge_name || !municipality) {
        console.warn(`Fila ${idx + 1} omitida (campos clave faltan).`);
        return null;
      }
      return {
        year,
        bridge_name,
        municipality,
        occupancy_rate: cleanNumber(row['Tasa de ocupación']),
        room_offer: cleanNumber(row['Oferta cuartos']),
        occupied_rooms: cleanNumber(row['Cuartos ocupados']),
        available_rooms: cleanNumber(row['Cuartos disponibles']),
        average_stay: cleanNumber(row['Estadía promedio']),
        occupancy_density: cleanNumber(row['Densidad de ocupación']),
        nights: cleanNumber(row['Noches']),
        tourists_per_night: cleanNumber(row['Turistas noche']),
        daily_avg_spending: cleanNumber(row['Gasto promedio diario']),
        economic_impact: cleanNumber(row['Derrama económica']),
        tourist_flow: cleanNumber(row['Afluencia turística']),
      };
    })
    .filter((r) => r !== null) as Partial<typeof LongWeekendStats>[];

  console.log(`Total válido: ${formatted.length} filas.`);

  try {
    await LongWeekendStats.bulkCreate(formatted, {
      updateOnDuplicate: [
        'occupancy_rate',
        'room_offer',
        'occupied_rooms',
        'available_rooms',
        'average_stay',
        'occupancy_density',
        'nights',
        'tourists_per_night',
        'daily_avg_spending',
        'economic_impact',
        'tourist_flow'
      ]
    });
    console.log('Insert/update batch completado con éxito.');
  } catch (e: any) {
    console.error('Error al bulkCreate/upsert:', e);
    throw e;
  }
}

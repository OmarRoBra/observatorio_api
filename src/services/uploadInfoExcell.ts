import HolidayStats from '../models/HolidayStats.model';

export async function insertHolidayStatsFromExcel(data: any[]) {
  const formatted = data
    .map((row) => {
      const rawEconomicImpact = row['Derrama Económica']
        ?.toString()
        .replace(/,/g, '');
      return {
        year: parseNumber(row['Año']),
        bridgeName: row['Fin de semana largo'] || '',
        municipality: row['Municipio'] || '',
        occupancyRate: parseFloat(row['Tasa de ocupación']) || 0,
        roomOffer: parseNumber(row['Oferta cuartos']),
        occupiedRooms: parseNumber(row['Cuartos ocupados']),
        availableBeds: parseNumber(row['Cuartos disponibles']),
        stay: parseFloat(row['Estadía promedio']) || 0,
        density: parseFloat(row['Densidad de ocupación']) || 0,
        nights: parseNumber(row['Noches']),
        touristsPerNight: parseNumber(row['Turistas noche']),
        gpd: parseFloat(row['Gasto promedio diario']) || 0,
        economicImpact: parseNumber(row['Derrama económica']),
        touristFlow: parseNumber(row['Afluencia turística']),
        month: row['Mes'] || '',
      };
    })
    .filter((row) => row.bridgeName); // Filtra filas incompletas

  await HolidayStats.bulkCreate(formatted);
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove commas and whitespace, then parse
    const cleaned = value.replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}


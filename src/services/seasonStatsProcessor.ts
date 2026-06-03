import SeasonStats from '../models/SeasonStats.model';

// Parsea números con formato europeo (punto=miles, coma=decimal)
// Ej: "199.281.207" -> 199281207, "1,77" -> 1.77, "35.752" -> 35752
function parseEuropeanNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  // Si ya es número (Excel lo parsea como número nativo), devolverlo directamente
  if (typeof val === 'number') return val;

  const str = val.toString().trim().replace(/\s/g, '');

  // Formato "1.234,56" (punto=miles, coma=decimal)
  if (str.includes(',') && str.includes('.')) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  }
  // Formato "1,77" (solo coma como decimal)
  if (str.includes(',')) {
    // Si hay más de un dígito después de la coma, es decimal
    const afterComma = str.split(',')[1] ?? '';
    if (afterComma.length <= 2) {
      return parseFloat(str.replace(',', '.'));
    }
    // Si hay 3 dígitos después de la coma, es separador de miles
    return parseFloat(str.replace(/,/g, ''));
  }
  // Formato "35.752" o "199.281.207" (solo puntos como miles)
  if (str.includes('.')) {
    const parts = str.split('.');
    // Si todas las partes después de la primera tienen 3 dígitos, son miles
    const allThree = parts.slice(1).every(p => p.length === 3);
    if (allThree && parts.length > 1) {
      return parseFloat(str.replace(/\./g, ''));
    }
  }
  return parseFloat(str) || 0;
}

function parseEuropeanInt(val: any): number {
  return Math.round(parseEuropeanNumber(val));
}

export async function insertSeasonStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    const year = parseEuropeanInt(row['Año']);
    const season = row['Temporada']?.toString().trim() || '';
    const municipality = row['Municipio']?.toString().trim() || '';

    // Omitir filas sin datos clave
    if (!year || !season || !municipality) continue;

    await SeasonStats.upsert({
      year,
      season,
      municipality,
      occupancyRate: parseEuropeanNumber(row['% Ocupación']),
      roomOffer: parseEuropeanInt(row['Oferta Cuartos']),
      occupiedRooms: parseEuropeanNumber(row['Cuartos Ocupados']),
      availableRooms: parseEuropeanInt(row['Ctos. Disp.']),
      stay: parseEuropeanNumber(row['Estadía']),
      density: parseEuropeanNumber(row['Densidad']),
      touristsPerNight: parseEuropeanNumber(row['Turistas Noche']),
      avgSpending: parseEuropeanNumber(row['Gasto promedio por persona']),
      economicImpact: parseEuropeanInt(row['Derrama Económica']),  // BIGINT: sin decimales
      touristFlow: parseEuropeanNumber(row['Afluencia Turística']),
    }, {
      conflictFields: ['year', 'season', 'municipality']
    });
  }
}

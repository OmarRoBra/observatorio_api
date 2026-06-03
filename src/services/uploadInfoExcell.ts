import HolidayStats from '../models/HolidayStats.model';

// Parsea números con formato europeo: punto como miles, coma como decimal
// Ej: "35.752" -> 35752, "1,77" -> 1.77, "199.281.207" -> 199281207
function parseEuropeanNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const str = value.toString().trim();
  // Si tiene coma como decimal y puntos como miles: "1.234,56" -> 1234.56
  if (str.includes(',') && str.includes('.')) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  }
  // Si solo tiene coma (decimal europeo): "1,77" -> 1.77
  if (str.includes(',')) {
    return parseFloat(str.replace(',', '.'));
  }
  // Si solo tiene puntos (miles): "35.752" -> 35752
  // Heurística: si hay punto y más de 3 dígitos después, es separador de miles
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      return parseFloat(str.replace(/\./g, ''));
    }
  }
  return parseFloat(str);
}

function parseEuropeanInt(value: any): number {
  return Math.round(parseEuropeanNumber(value));
}

export async function insertHolidayStatsFromExcel(data: any[]) {
  const formatted = data
    .map((row) => {
      return {
        year: parseEuropeanInt(row['Año']),
        // "Temporada" es la temporada/puente (Semana Santa, Verano, Invierno)
        bridgeName: row['Temporada']?.toString().trim() || row['Puente']?.toString().trim() || '',
        municipality: row['Municipio']?.toString().trim() || '',
        month: row['Mes']?.toString().trim() || '',           // No existe en este Excel, se deja vacío
        occupancyRate: parseEuropeanNumber(row['% Ocupación']),
        roomOffer: parseEuropeanInt(row['Oferta Cuartos']),
        occupiedRooms: parseEuropeanInt(row['Cuartos Ocupados']),
        availableBeds: parseEuropeanInt(row['Ctos. Disp.']),
        stay: parseEuropeanNumber(row['Estadía']),
        density: parseEuropeanNumber(row['Densidad']),
        nights: parseEuropeanInt(row['Noches']),              // No existe en este Excel, será 0
        touristsPerNight: parseEuropeanInt(row['Turistas Noche']),
        gpd: parseEuropeanNumber(row['Gasto promedio por persona'] ?? row['GPD']),
        economicImpact: parseEuropeanInt(row['Derrama Económica']),
        touristFlow: parseEuropeanInt(row['Afluencia Turística']),
      };
    })
    .filter((row) => row.bridgeName && row.municipality); // Filtra filas incompletas

  await HolidayStats.bulkCreate(formatted);
}

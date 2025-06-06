import HolidayStats from '../models/HolidayStats.model';

// Limpia número, soporta miles y decimales
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/\./g, '').replace(',', '.');
    return Number(cleaned.replace(/[^0-9.-]/g, ""));
  }
  return 0;
}

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await HolidayStats.create({
      year: Number(row['Año']),
      bridgeName: row['Fin de semana largo'] || "",
      municipality: row['Municipio'] || "",
      occupancyRate: cleanNumber(row['Tasa de ocupación']),
      roomOffer: cleanNumber(row['Oferta cuartos']),
      occupiedRooms: cleanNumber(row['Cuartos ocupados']),
      availableRooms: cleanNumber(row['Cuartos disponibles']),
      averageStay: cleanNumber(row['Estadía promedio']),
      occupancyDensity: cleanNumber(row['Densidad de ocupación']),
      nights: cleanNumber(row['Noches']),
      touristsPerNight: cleanNumber(row['Turistas noche']),
      dailyAvgSpending: cleanNumber(row['GPD']),
      economicImpact: cleanNumber(row['Derrama económica']),
      touristFlow: cleanNumber(row['Afluencia turística']),
    });
  }
}
// Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
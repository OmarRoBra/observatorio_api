import HolidayStats from '../models/HolidayStats.model';

// Convierte números tipo "1,234.56" o "1.234,56" a number JS
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    let cleaned = val.replace(/,/g, ''); // elimina las comas
    return Number(cleaned);
  }
  return 0;
}

export async function insertHolidayStatsFromExcel(rows: any[]) {
  let inserted = 0;
  for (const row of rows) {
    // Si falta año o municipio, omite fila
    if (!row['Año'] || !row['Municipio']) continue;

    try {
      await HolidayStats.create({
        year: Number(row['Año']),
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
        daily_avg_spending: cleanNumber(row['GPD']), // Usa aquí el encabezado exacto, puede ser 'Gasto promedio diario'
        economic_impact: cleanNumber(row['Derrama económica']),
        tourist_flow: cleanNumber(row['Afluencia turística']),
      });
      inserted++;
    } catch (e) {
      console.error("❌ Error insertando fila:", e, row);
    }
  }
  console.log(`✔️ Registros insertados: ${inserted}`);
}

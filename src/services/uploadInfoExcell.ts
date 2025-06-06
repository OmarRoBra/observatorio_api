import HolidayStats from '../models/HolidayStats.model';

// Limpia números: quita comas y convierte a número JS
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    // quita todos los espacios y comas, luego convierte a número
    let cleaned = val.trim().replace(/\s/g, '').replace(/,/g, '');
    return Number(cleaned.replace(/[^0-9.-]/g, ""));
  }
  return null;
}

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
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
        daily_avg_spending: cleanNumber(row['GPD']),
        economic_impact: cleanNumber(row['Derrama económica']),
        tourist_flow: cleanNumber(row['Afluencia turística']),
      });
    } catch (e) {
      console.error("❌ Error insertando fila:", e, row);
    }
  }
}
export async function getHolidayStats(where: any) {
  try {
    return await HolidayStats.findAll({ where });
  } catch (err) {
    console.error('🔴 Error fetching holiday stats:', err);
    if (err instanceof Error) {
      console.error('Message:', err.message);
      const anyErr = err as any;
      if (anyErr.parent) {
        console.error('Parent detail:', anyErr.parent.detail || anyErr.parent);
        console.error('Parent sql:', anyErr.parent.sql);
      }
    }
    throw new Error('Error fetching holiday stats');
  }
}
export async function getHolidayStatsById(id: number) {
  try {
    return await HolidayStats.findByPk(id);
  } catch (err) {
    console.error('🔴 Error fetching holiday stats by ID:', err);
    if (err instanceof Error) {
      console.error('Message:', err.message);
      const anyErr = err as any;
      if (anyErr.parent) {
        console.error('Parent detail:', anyErr.parent.detail || anyErr.parent);
        console.error('Parent sql:', anyErr.parent.sql);
      }
    }
    throw new Error('Error fetching holiday stats by ID');
  }
}
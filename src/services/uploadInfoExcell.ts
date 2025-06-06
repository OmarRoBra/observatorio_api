import HolidayStats from '../models/HolidayStats.model';

// Limpia cualquier número (soporta "5,135" o "5.135" como miles)
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/,/g, "").replace(/\./g, ""); // quita comas y puntos (miles)
    return Number(cleaned.replace(/[^0-9.-]/g, "")); // solo números
  }
  return 0;
}

// Limpia campos de dinero (para "Derrama económica")
function cleanMoney(val: any) {
  if (typeof val === "string") {
    // Elimina separadores de miles (coma o punto), y deja el punto de decimal si existe
    const cleaned = val.replace(/,/g, "").replace(/\./g, "");
    const number = Number(cleaned);
    return isNaN(number) ? 0 : number;
  }
  return val;
}

// Mapeo de columnas Excel a modelo
const fieldMap: Record<string, string> = {
  "Año": "year",
  "Fin de semana largo": "bridge_name",
  "Municipio": "municipality",
  "Tasa de ocupación": "occupancy_rate",
  "Oferta cuartos": "room_offer",
  "Cuartos ocupados": "occupied_rooms",
  "Cuartos disponibles": "available_rooms",
  "Estadía promedio": "average_stay",
  "Densidad de ocupación": "occupancy_density",
  "Noches": "nights",
  "Turistas noche": "tourists_per_night",
  "GPD": "daily_avg_spending", // o "Gasto promedio diario" si ese es el encabezado real
  "Derrama económica": "economic_impact",
  "Afluencia turística": "tourist_flow"
};

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    const record: any = {};
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      if (modelKey === "economic_impact") {
        // Solo para el campo de dinero, usa cleanMoney
        record[modelKey] = cleanMoney(row[excelKey]);
      } else if (
        [
          "year", "room_offer", "available_rooms", "occupancy_rate", "occupied_rooms",
          "average_stay", "occupancy_density", "nights", "tourists_per_night",
          "daily_avg_spending", "tourist_flow"
        ].includes(modelKey)
      ) {
        record[modelKey] = cleanNumber(row[excelKey]);
      } else {
        record[modelKey] = row[excelKey] || "";
      }
    }
    // Quita registros vacíos (puedes agregar lógica extra aquí si quieres)
    if (!record.year || !record.bridge_name || !record.municipality) continue;

    await HolidayStats.upsert(record, {
      conflictFields: ['year', 'bridge_name', 'municipality']
    });
  }
}

import HolidayStats from '../models/HolidayStats.model';

// Limpia cualquier número (soporta "5,135" o "5.135" como miles)


// Limpia campos de dinero (para "Derrama económica")
function cleanMoney(val: any): number {
  if (typeof val !== 'string') {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }
  // Quita espacios
  let v = val.replace(/\s/g, '');
  // Elimina separadores de miles: puntos o comas solo si van seguidos de 3 dígitos
  v = v.replace(/(\d)[.,](?=\d{3}\b)/g, '$1');
  // Convierte coma decimal a punto
  v = v.replace(/,(\d{1,2})$/, '.$1');
  const num = Number(v);
  return isNaN(num) ? 0 : num;
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
  "Gasto promedio diario": "daily_avg_spending",
  "Derrama económica": "economic_impact",
  "Afluencia turística": "tourist_flow"
};

// Lista de campos numéricos
const numericFields = [
  "year",
  "room_offer",
  "available_rooms",
  "occupancy_rate",
  "occupied_rooms",
  "average_stay",
  "occupancy_density",
  "nights",
  "tourists_per_night",
  "daily_avg_spending",
  "tourist_flow"
];
export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    const record: any = {};
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      const val = row[excelKey];

      if (modelKey === "economic_impact") {
        record[modelKey] = cleanMoney(val);
      } else if (
        [
          "year",
          "room_offer",
          "available_rooms",
          "occupancy_rate",
          "occupied_rooms",
          "average_stay",
          "occupancy_density",
          "nights",
          "tourists_per_night",
          "daily_avg_spending",
          "tourist_flow"
        ].includes(modelKey)
      ) {
        // Convertir a número si es un campo numérico
        record[modelKey] = Number(val);
      }if (modelKey === 'economic_impact') {
  record[modelKey] = cleanMoney(val);
} else if (numericFields.includes(modelKey)) {
  record[modelKey] = Number(val) || 0;
} else {
  record[modelKey] = val;
}


    }
    // Si falta algún campo clave, saltar la fila
    if (!record.year || !record.bridge_name || !record.municipality) continue;

    await HolidayStats.upsert(record, {
      conflictFields: ['year', 'bridge_name', 'municipality']
    });
  }
}
// Exportar la función para usarla en otros módulos
export default insertHolidayStatsFromExcel;
// Exportar la función para usarla en otros módulos


import HolidayStats from '../models/HolidayStats.model';

// Limpia campos de dinero (para "Derrama económica")
function cleanMoney(val: any): number {
  if (typeof val !== 'string') {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }
  let v = val.replace(/\s/g, '');
  // Elimina separadores de miles (coma o punto) si van seguidos de 3 dígitos
  v = v.replace(/(\d)[.,](?=\d{3}\b)/g, '$1');
  // Convierte coma decimal a punto
  v = v.replace(/,(\d{1,2})$/, '.$1');
  const num = Number(v);
  return isNaN(num) ? 0 : num;
}

// Campos numéricos a procesar
const numericFields = [
  'year', 'occupancy_rate', 'room_offer', 'occupied_rooms', 'available_rooms',
  'average_stay', 'occupancy_density', 'nights', 'tourists_per_night',
  'daily_avg_spending', 'tourist_flow'
];

// Mapeo de columnas Excel a modelo
const fieldMap: Record<string, string> = {
  'Año': 'year',
  'Fin de semana largo': 'bridge_name',
  'Municipio': 'municipality',
  'Tasa de ocupación': 'occupancy_rate',
  'Oferta cuartos': 'room_offer',
  'Cuartos ocupados': 'occupied_rooms',
  'Cuartos disponibles': 'available_rooms',
  'Estadía promedio': 'average_stay',
  'Densidad de ocupación': 'occupancy_density',
  'Noches': 'nights',
  'Turistas noche': 'tourists_per_night',
  'Gasto promedio diario': 'daily_avg_spending',
  'Derrama económica': 'economic_impact',
  'Afluencia turística': 'tourist_flow'
};

export async function insertHolidayStatsFromExcel(rows: any[]) {
  const upsertPromises: Promise<any>[] = [];

  for (const [idx, row] of rows.entries()) {
    const record: any = {};

    // Mapear y limpiar valores
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      const val = row[excelKey];
      if (modelKey === 'economic_impact') {
        record[modelKey] = cleanMoney(val);
      } else if (numericFields.includes(modelKey)) {
        record[modelKey] = Number(val) || 0;
      } else {
        // asume tipo string
        record[modelKey] = val != null ? String(val).trim() : '';
      }
    }

    // Validación de campos clave
    if (!record.year || !record.bridge_name || !record.municipality) {
      console.warn(`Fila ${idx + 1} omitida: falta year, bridge_name o municipality.`, row);
      continue;
    }

    // Realizar upsert con manejo de errores por fila
    upsertPromises.push(
      HolidayStats.upsert(record, {
        conflictFields: ['year', 'bridge_name', 'municipality']
      }).catch(err => {
        console.error(`Error upserting fila ${idx + 1}:`, record, err);
      })
    );
  }

  // Esperar todas las promesas
  await Promise.all(upsertPromises);
  console.log(`Procesadas ${upsertPromises.length} filas de ${rows.length} (omitidas ${rows.length - upsertPromises.length}).`);
}

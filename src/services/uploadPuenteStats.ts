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

  // Función para normalizar nombres de columna (trim, sin acentos, lowercase)
  const normalize = (str: string) =>
    str
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ');

  for (const [idx, row] of rows.entries()) {
    const record: any = {};

    // Mapear desde encabezados originales a claves normalizadas
    const headerMap: Record<string, string> = {};
    Object.keys(row).forEach(origKey => {
      headerMap[normalize(origKey)] = origKey;
    });

    // Recorrer fieldMap y extraer valor real
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      const normKey = normalize(excelKey);
      const actualKey = headerMap[normKey];
      if (!actualKey) {
        console.warn(`Columna no encontrada: ${excelKey}`);
        continue;
      }
      const val = row[actualKey];

      if (modelKey === 'economic_impact') {
        record[modelKey] = cleanMoney(val);
      } else if (numericFields.includes(modelKey)) {
        record[modelKey] = Number(val) || 0;
      } else {
        record[modelKey] = val != null ? String(val).trim() : '';
      }
    }

    // Validar campos obligatorios
    if (!record.year || !record.bridge_name || !record.municipality) {
      console.warn(`Fila ${idx + 1} omitida: falta year, bridge_name o municipality.`);
      continue;
    }

    upsertPromises.push(
      HolidayStats.upsert(record, {
        conflictFields: ['year', 'bridge_name', 'municipality'],
      }).catch(err => {
        console.error(`Error upserting fila ${idx + 1}:`, record, err);
      })
    );
  }

  await Promise.all(upsertPromises);
  console.log(
    `Procesadas ${upsertPromises.length} de ${rows.length} filas (omitidas ${
      rows.length - upsertPromises.length
    }).`
  );
}

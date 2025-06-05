import HolidayStats from '../models/HolidayStats.model';

function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[.,]/g, match => match === "," ? "." : "");
    return Number(cleaned.replace(/[^0-9.-]/g, ""));
  }
  return 0;
}

export async function insertHolidayStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await HolidayStats.create({
      año: Number(row['Año']),
      fin_de_semana_largo: row['Fin de semana largo'] || "",
      municipio: row['Municipio'] || "",
      tasa_ocupacion: cleanNumber(row['Tasa de ocupación']),
      oferta_cuartos: cleanNumber(row['Oferta cuartos']),
      cuartos_ocupados: cleanNumber(row['Cuartos ocupados']),
      cuartos_disponibles: cleanNumber(row['Cuartos disponibles']),
      estadia_promedio: cleanNumber(row['Estadía promedio']),
      densidad_ocupacion: cleanNumber(row['Densidad de ocupación']),
      noches: cleanNumber(row['Noches']),
      turistas_noche: cleanNumber(row['Turistas noche']),
      gasto_promedio_diario: cleanNumber(row['Gasto promedio diario']),
      derrama_economica: cleanNumber(row['Derrama económica']),
      afluencia_turistica: cleanNumber(row['Afluencia turística']),
    });
  }
}

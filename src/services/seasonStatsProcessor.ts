import SeasonStats from '../models/SeasonStats.model';

// Limpia cualquier número
function cleanNumber(val: any) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/\./g, "").replace(",", ".");
    return Number(cleaned.replace(/[^0-9.-]/g, ""));
  }
  return 0;
}

// Limpia campos de dinero (usada en "Derrama Económica")
function cleanMoney(val: any) {
  if (typeof val === "string") {
    const cleaned = val.replace(/\./g, "").replace(",", ".");
    const number = Number(cleaned);
    return isNaN(number) ? 0 : number;
  }
  return val;
}

const fieldMap: Record<string, string> = {
  "Año": "year",
  "Temporada": "season",
  "Municipio": "municipality",
  "% Ocupación": "occupancyRate",
  "Oferta Cuartos": "roomOffer",
  "Cuartos Ocupados": "occupiedRooms",
  "Ctos. Disp.": "availableRooms",
  "Estadía": "stay",
  "Densidad": "density",
  "Turistas Noche": "touristsPerNight",
  "Gasto promedio por persona": "avgSpending",
  "Derrama Económica": "economicImpact",
  "Afluencia Turística": "touristFlow"
};

export async function insertSeasonStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    const record: any = {};
    for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
      if (modelKey === "economicImpact") {
        // Solo para el campo de dinero, usa cleanMoney
        record[modelKey] = cleanMoney(row[excelKey]);
      } else if (
        [
          "year", "roomOffer", "availableRooms",
          "occupancyRate", "occupiedRooms", "stay", "density", "touristsPerNight",
          "avgSpending", "touristFlow"
        ].includes(modelKey)
      ) {
        record[modelKey] = cleanNumber(row[excelKey]);
      } else {
        record[modelKey] = row[excelKey] || "";
      }
    }
    await SeasonStats.upsert(record, {
      conflictFields: ['year', 'season', 'municipality']
    });
  }
}
export async function getSeasonStatsByYear(year: number) {
  return SeasonStats.findAll({
    where: { year },
    order: [['season', 'ASC'], ['municipality', 'ASC']]
  });
}
export async function getSeasonStatsByMunicipalityAndSeason(municipality: string, season: string) {
  return SeasonStats.findAll({
    where: { municipality, season },
    order: [['year', 'ASC']]
  });
}
export async function getSeasonStatsByMunicipality(municipality: string) {
  return SeasonStats.findAll({
    where: { municipality },
    order: [['year', 'ASC'], ['season', 'ASC']]
  });
}
export async function getSeasonStatsBySeason(season: string) {
  return SeasonStats.findAll({
    where: { season },
    order: [['year', 'ASC'], ['municipality', 'ASC']]
  });
}
export async function getAllSeasonStats() {
  return SeasonStats.findAll({
    order: [['year', 'ASC'], ['season', 'ASC'], ['municipality', 'ASC']]
  });
}
export async function getSeasonStatsByYearAndMunicipality(year: number, municipality: string) {
  return SeasonStats.findAll({
    where: { year, municipality },
    order: [['season', 'ASC']]
  });
}
export async function getSeasonStatsByYearAndSeason(year: number, season: string) {
  return SeasonStats.findAll({
    where: { year, season },
    order: [['municipality', 'ASC']]
  });
}
export async function getSeasonStatsByYearSeasonAndMunicipality(year: number, season: string, municipality: string) {
  return SeasonStats.findAll({
    where: { year, season, municipality },
    order: [['municipality', 'ASC']]
  });
}

export async function getSeasonStatsByYearAndMunicipalityAndSeason(year: number, municipality: string, season: string) {
  return SeasonStats.findAll({
    where: { year, municipality, season },
    order: [['municipality', 'ASC']]
  });
}
export async function getSeasonStatsByMunicipalityAndYear(municipality: string, year: number) {
  return SeasonStats.findAll({
    where: { municipality, year },
    order: [['season', 'ASC']]
  });
}
export async function getSeasonStatsByMunicipalityAndSeasonAndYear(municipality: string, season: string, year: number) {
  return SeasonStats.findAll({
    where: { municipality, season, year },
    order: [['year', 'ASC']]
  });
}
export async function getSeasonStatsBySeasonAndYear(season: string, year: number) {
  return SeasonStats.findAll({
    where: { season, year },
    order: [['municipality', 'ASC']]
  });
}
export async function getSeasonStatsBySeasonAndMunicipality(season: string, municipality: string) {
  return SeasonStats.findAll({
    where: { season, municipality },
    order: [['year', 'ASC']]
  });
}
export async function getSeasonStatsBySeasonAndMunicipalityAndYear(season: string, municipality: string, year: number) {
  return SeasonStats.findAll({
    where: { season, municipality, year },
    order: [['year', 'ASC']]
  });
}
export async function getSeasonStatsByYearAndMunicipalityAndSeasonAndSeason(year: number, municipality: string, season: string) {
  return SeasonStats.findAll({
    where: { year, municipality, season },
    order: [['season', 'ASC']]
  });
}

export async function getSeasonStatsByYearAndMunicipalityAndSeasonAndMunicipality(year: number, municipality: string, season: string) {
  return SeasonStats.findAll({
    where: { year, municipality, season },
    order: [['municipality', 'ASC']]
  });
}


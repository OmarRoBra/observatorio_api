import SeasonStats from '../models/SeasonStats.model';

function cleanMoney(val: any) {
  if (typeof val === 'string') return Number(val.replace(/[^0-9.]+/g, ''));
  return val;
}

export async function insertSeasonStatsFromExcel(rows: any[]) {
  for (const row of rows) {
    await SeasonStats.upsert({
      year: Number(row['Año']),
      season: row['Temporada'],
      municipality: row['Municipio'],
      occupancyRate: Number(row['% Ocupación']),
      roomOffer: Number(row['Oferta Cuartos']),
      occupiedRooms: Number(row['Cuartos Ocupados']),
      availableRooms: Number(row['Ctos. Disp.']),
      stay: Number(row['Estadía']),
      density: Number(row['Densidad']),
      touristsPerNight: Number(row['Turistas Noche']),
      avgSpending: Number(row['Gasto promedio por persona']),
      economicImpact: cleanMoney(row['Derrama Económica']),
      touristFlow: Number(row['Afluencia Turística']),
    }, {
      conflictFields: ['year', 'season', 'municipality']
    });
  }
}

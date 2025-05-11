import HolidayStats from '../models/HolidayStats.model';

export async function insertHolidayStatsFromExcel(data: any[]) {
  const formatted = data
    .map((row) => {
      const rawEconomicImpact = row['Derrama Económica']
        ?.toString()
        .replace(/,/g, '');
      return {
        year: parseInt(row['Año']),
        bridgeName: row['Puente']?.toString().trim(),
        municipality: row['Municipio']?.toString().trim(),
        occupancyRate: parseFloat(row['% Ocupación']),
        roomOffer: parseInt(row['Oferta Cuartos']),
        occupiedRooms: parseInt(row['Cuartos Ocupados']),
        availableBeds: parseInt(row['Ctos. Disp.']),
        stay: parseFloat(row['Estadía']),
        density: parseFloat(row['Densidad']),
        nights: parseInt(row['Noches']),
        touristsPerNight: parseInt(row['Turistas Noche']),
        gpd: parseFloat(row['GPD']),
        economicImpact: parseInt(rawEconomicImpact),
        touristFlow: parseInt(row['Afluencia Turística']),
      };
    })
    .filter((row) => row.bridgeName); // Filtra filas incompletas

  await HolidayStats.bulkCreate(formatted);
}

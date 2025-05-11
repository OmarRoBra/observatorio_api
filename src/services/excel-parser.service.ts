import XLSX from 'xlsx';
import sequelize from '../config/database';
import { ExcelFile} from '../models/excel-File.model';
import {  ExcelData } from '../models/excel-data.model';

export async function processExcelFile(file: Express.Multer.File, section: 'turismo'|'economia') {
  const transaction = await sequelize.transaction();
  try {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { raw: false });

       // Normalizar columnas y tipos
       const data = rows.map(r => ({
        anio: parseInt(r['Año']),
        puente: r['Puente'],
        municipio: r['Municipio'],
        ocupacion: parseFloat(String(r['% Ocupación']).replace('%', '')) / 100,
        oferta_cuartos: parseInt(String(r['Oferta Cuartos']).replace(/,/g, '')),
        cuartos_ocupados: parseInt(String(r['Cuartos Ocupados']).replace(/,/g, '')),
        ctosp_disp: parseFloat(String(r['Ctos. Disp.']).replace(/,/g, '')),
        estadia: parseFloat(String(r['Estadía']).replace(/,/g, '')),
        densidad: parseInt(String(r['Densidad']).replace(/,/g, '')),
        noches: parseInt(String(r['Noches']).replace(/,/g, '')),
        turistas_noche: parseInt(String(r['Turistas Noche']).replace(/,/g, '')),
        gpd: parseFloat(String(r['GPD']).replace(/,/g, '')),
        derrama_economica: parseFloat(String(r['Derrama Económica']).replace(/,/g, '')),
        afluencia_turistica: parseInt(String(r['Afluencia Turística']).replace(/,/g, '')),
      }));

    const excelFile = await ExcelFile.create({ filename: file.originalname, section, raw: rows }, { transaction });
    await ExcelData.bulkCreate(
      data.map(c => ({ excelFileId: excelFile.id, content: c })),
      { transaction }
    );
    await transaction.commit();
    return excelFile;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
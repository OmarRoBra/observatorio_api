// src/services/excelProcessor.ts
import { Transaction } from 'sequelize';
import XLSX from 'xlsx';
import path from 'path';
import sequelize from '../config/database';
import ExcelFile from '../models/excel-File.model';
import ExcelData from '../models/excel-data.model';

interface RawRow { [key:string]: any; }

export async function processExcelFile(
  file: Express.Multer.File,
  section: string
): Promise<{ id:number; fileName:string; records:number }> {
  const wb = XLSX.readFile(file.path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<RawRow>(ws, { raw:false });
  if (!raw.length) throw new Error('Excel vacío');

  const rows = raw.map(r => ({
    año:                      Number(r.Año),
    puente:                   String(r.Puente),
    municipio:                String(r.Municipio),
    porcentaje_ocupacion:     parseFloat(String(r['% Ocupación']||0)),
    oferta_cuartos:           Number(r['Oferta Cuartos']||0),
    cuartos_ocupados:         Number(r['Cuartos Ocupados']||0),
    costos_disponibles:       Number(r['Costos Disponibles']||0),
    estadia:                  parseFloat(String(r.Estadía||0)),
    densidad:                 parseFloat(String(r.Densidad||0)),
    noches:                   Number(r.Noches||0),
    turistas_noche:           Number(r['Turistas Noche']||0),
    gpd:                      parseFloat(String(r.GPD||0)),
    derrama_economica:        parseFloat(String(r['Derrama Económica']||0)),
    afluencia_turistica:      Number(r['Afluencia Turística']||0),
  }));

  return sequelize.transaction(async (t:Transaction) => {
    const ef = await ExcelFile.create({
      fileName: path.basename(file.originalname),
      filePath: file.path,
      section
    }, { transaction:t });

    await ExcelData.bulkCreate(
      rows.map(c => ({ excelFileId: ef.id, content: c })),
      { transaction:t }
    );
    return { id: ef.id, fileName: ef.fileName, records: rows.length };
  });
}

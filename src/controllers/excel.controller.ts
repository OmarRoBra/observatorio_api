// src/controllers/excel.controller.ts
import { Request, Response } from 'express';
import XLSX from 'xlsx';
import path from 'path';
import ExcelFile from '../models/excelFile.mode';
import ExcelRow from '../models/excelRow.model';

// 1) Subir y procesar Excel
export const uploadExcel = async (req: any, res: Response): Promise<void> => {
  const file = req.file;
  const section = req.body.section;        // si envías 'section' como texto
  // const sectionId = Number(req.body.sectionId);  // si envías 'sectionId' como número

  if (!file || !section) {
    res.status(400).json({ message: 'File and section are required' });
    return;
  }

  try {
    const record = await ExcelFile.create({
      fileName: file.filename,
      filePath: file.path,
      section,              // o sectionId
    });

    const workbook = XLSX.readFile(file.path);
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = XLSX.utils.sheet_to_json(sheet);

    await ExcelRow.bulkCreate(
      rows.map(r => ({ excelFileId: record.id, row: r as object }))
    );

    res.status(201).json({ fileId: record.id });
  } catch (error: any) {
    console.error('Error in uploadExcel:', error);
    res.status(500).json({ message: 'Internal error', error: error.message });
  }
};

// 2) Obtener datos procesados (JSON) de un Excel por fileId
export const getExcelData = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileId = Number(req.params.id);
    const rows = await ExcelRow.findAll({
      where: { excelFileId: fileId },
      attributes: ['row']
    });
    res.json(rows.map(r => r.row));
  } catch (error: any) {
    console.error('Error in getExcelData:', error);
    res.status(500).json({ message: 'Internal error', error: error.message });
  }
};

// 3) Descargar el archivo original
export const downloadExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const record = await ExcelFile.findByPk(Number(req.params.id));
    if (!record) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
    res.download(path.resolve(record.filePath), record.fileName);
  } catch (error: any) {
    console.error('Error in downloadExcel:', error);
    res.status(500).json({ message: 'Internal error', error: error.message });
  }
};

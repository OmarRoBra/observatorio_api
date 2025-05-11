// src/controllers/excel.controller.ts
import { Request, Response } from 'express';
import * as ES from '../services/excelProcessor';
import ExcelFile from '../models/excel-File.model';
import ExcelData from '../models/excel-data.model';
import { Op, where, literal } from 'sequelize';

// src/controllers/excel.controller.ts
export async function upload(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Archivo requerido' });
      return;
    }
    
    const section = req.body.section;
    if (!section) {
      res.status(400).json({ message: 'Sección inválida' });
      return;
    }

    const result = await ES.processExcelFile(req.file, section);
    res.status(201).json(result);
    
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
// En tu controlador listFiles (excel.controller.ts)
export async function listFiles(req: Request, res: Response) {
  const files = await ExcelFile.findAll(); // ✔️ Debe retornar datos válidos
  res.json(files);
}

export async function getData(req:Request, res:Response) {
  const { id } = req.params;
  const { year, municipio, limit='50', offset='0' } = req.query as any;
  const f: any[] = [];
  if (year)      f.push(where(literal("content->>'año'"), year));
  if (municipio) f.push(where(literal("content->>'municipio'"), { [Op.iLike]: `%${municipio}%` }));
  const whereC: any = { excelFileId:id };
  if (f.length)  whereC[Op.and]=f;

  const { rows, count } = await ExcelData.findAndCountAll({
    where: whereC, limit:+limit, offset:+offset
  });
  res.json({ data:rows, total:count });
}

export async function remove(req:Request, res:Response) {
  await ExcelFile.destroy({ where:{ id:req.params.id }});
  res.sendStatus(204);
}

// src/routes/uexcelFeeds.ts
import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import HolidayStats from '../models/HolidayStats.model';
import { insertHolidayStatsFromExcel } from '../services/uploadInfoExcell';
const router = Router();

router.post(
  '/upload-excel',
  upload.single('file'),
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Archivo o tipo faltante.' });
        return;
      }

      const data = readExcelFromBuffer(req.file.buffer);

      await insertHolidayStatsFromExcel(data);

      res.status(200).json({ message: `Archivo  procesado correctamente.` });
    } catch (error) {
      console.error(error);
      console.log(error);
      res.status(500).json({ message: 'Error procesando el archivo.' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const { year, fromYear, toYear, municipality, bridgeName, month } = req.query;
    const where: any = {};

    if (year || fromYear || toYear) {
      where.year = {};

      if (year) {
        where.year[Op.eq] = Number(year);
      }

      if (fromYear) {
        where.year[Op.gte] = Number(fromYear);
      }

      if (toYear) {
        where.year[Op.lte] = Number(toYear);
      }
      if (month) {
        where.month = { [Op.iLike]: `%${month}%` };
      }

    }

    if (municipality) {
      where.municipality = { [Op.iLike]: `%${municipality}%` };
    }

    if (bridgeName) {
      where.bridgeName = { [Op.iLike]: `%${bridgeName}%` };
    }

    const results = await HolidayStats.findAll({ where });
    res.json(results);
  } catch (err) {
    console.error('Error fetching holiday stats:', err);
    res.status(500).json({ error: 'Error fetching holiday stats' });
  }
});
// Eliminar una estadística por ID

export default router;

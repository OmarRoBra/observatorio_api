import express from 'express';
import multer from 'multer';
import { insertLongWeekendStatsFromExcel } from '../services/longWeekendStats.service';
import { readExcelFromBuffer } from '../utils/excelReader';
import LongWeekendStats from '../models/LongWeekendStats.model';

const router = express.Router();
const upload = multer();

router.post('/upload-excel', upload.single('file'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' });
      return;
    }
    const rows = readExcelFromBuffer(req.file.buffer);
    await insertLongWeekendStatsFromExcel(rows);
    res.json({ message: 'File processed and data loaded.' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Processing error' });
  }
});
router.get('/', async (req, res) => {
  const stats = await LongWeekendStats.findAll();
  res.json(stats);
});

import { Op } from 'sequelize';
router.get('/search', async (req, res) => { 
    const { year, fromYear, toYear, municipality, bridgeName } = req.query;
    const where: any = {};
    
    if (year || fromYear || toYear) {
        where.year = {};
        if (year)      where.year[Op.eq] = Number(year);
        if (fromYear)  where.year[Op.gte] = Number(fromYear);
        if (toYear)    where.year[Op.lte] = Number(toYear);
    }
    
    if (municipality) {
        where.municipality = { [Op.iLike]: `%${municipality}%` };
    }
    
    if (bridgeName) {
        where['bridge_name'] = { [Op.iLike]: `%${bridgeName}%` };
    }
    
    try {
        const results = await LongWeekendStats.findAll({ where });
        res.json(results);
    } catch (err) {
        console.error('🔴 Error fetching long weekend stats:', err);
        res.status(500).json({ error: 'Error fetching long weekend stats' });
    }
});

export default router;

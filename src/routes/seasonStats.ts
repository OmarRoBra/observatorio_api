import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertMonthlyStatsFromExcel } from '../services/monthlyStatsProcessor';
import SeasonStats from '../models/SeasonStats.model';

const router = Router();

router.post('/upload-excel', upload.single('archivo'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Archivo requerido.' });
      return;
    }
    const data = readExcelFromBuffer(req.file.buffer);
    await insertMonthlyStatsFromExcel(data);
    res.json({ message: 'Archivo procesado correctamente.' });
  } catch (e) {
    res.status(500).json({ message: 'Error procesando archivo', error: e });
  }
});

router.get('/', async (req, res) => {
  const stats = await SeasonStats.findAll();
  res.json(stats);
});

export default router;

import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertSeasonStatsFromExcel } from '../services/seasonStatsProcessor';
import SeasonStats from '../models/SeasonStats.model';

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

      await insertSeasonStatsFromExcel(data);

      res.status(200).json({ message: `Archivo  procesado correctamente.` });
    } catch (error) {
      console.error(error);
      console.log(error);
      res.status(500).json({ message: 'Error procesando el archivo.' });
    }
  }
);
router.get('/', async (req, res) => {
  const stats = await SeasonStats.findAll();
  res.json(stats);
});

export default router;

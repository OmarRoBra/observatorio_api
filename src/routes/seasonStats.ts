import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertSeasonStatsFromExcel } from '../services/seasonStatsProcessor';
import SeasonStats from '../models/SeasonStats.model';

const router = Router();

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Archivo requerido.' });
      return;
    }
    const data = readExcelFromBuffer(req.file.buffer);
    await insertSeasonStatsFromExcel(data);
    res.json({ message: 'Archivo procesado correctamente.' });
  } catch (e) {
    console.error("Error en upload-excel:", e);
    res.status(500).json({ message: 'Error procesando el archivo.', error: (e as Error).message, stack: (e as Error).stack });
  }
});

router.get('/', async (req, res) => {
  const stats = await SeasonStats.findAll();
  res.json(stats);
});

export default router;

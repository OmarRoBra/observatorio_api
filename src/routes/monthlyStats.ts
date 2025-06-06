import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertMonthlyStatsFromExcel } from '../services/monthlyStatsProcessor';
import MonthlyStats from '../models/MonthlyStats.model';

const router = Router();

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Archivo requerido.' });
      return;
    }
    const data = readExcelFromBuffer(req.file.buffer);
    await insertMonthlyStatsFromExcel(data);
    res.json({ message: 'Archivo procesado correctamente.' });
  } catch (e) {
    console.error("Error en upload-excel:", e);
    res.status(500).json({ message: 'Error procesando el archivo.', error: (e as Error).message, stack: (e as Error).stack });
  }
});


router.get('/', async (req, res) => {
  console.log("Entrando a /monthly-stats");
  try {
    const stats = await MonthlyStats.findAll();
    console.log("Datos de monthly:", stats);
    res.json(stats || []);
  } catch (e) {
    console.error("Error en /monthly-stats:", e);
    res.status(500).json({ error: "Error en monthly-stats", details: e });
  }
});


export default router;

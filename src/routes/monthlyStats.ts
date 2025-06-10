import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertMonthlyStatsFromExcel } from '../services/monthlyStatsProcessor';
import MonthlyStats from '../models/MonthlyStats.model';

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

      await insertMonthlyStatsFromExcel(data);

      res.status(200).json({ message: `Archivo  procesado correctamente.` });
    } catch (error) {
      console.error(error);
      console.log(error);
      res.status(500).json({ message: 'Error procesando el archivo.' });
    }
  }
);

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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MonthlyStats.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ success: true });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el registro' });
  }
});


export default router;

import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import LongWeekendStats from '../models/LongWeekendStats.model';
import { insertLongWeekendStatsFromExcel } from '../services/uploadLongWeekendStatsExcel';
import { Op } from 'sequelize';

const router = Router();

// Subir Excel
router.post('/upload-excel', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Archivo requerido.' });
      return;
    }
    const data = readExcelFromBuffer(req.file.buffer);
    await insertLongWeekendStatsFromExcel(data);
    res.status(200).json({ message: 'Archivo procesado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error procesando el archivo.' });
  }
});

// GET con filtros (año, municipio, puente, etc.)
router.get('/', async (req, res) => {
  try {
    const { year, municipality, bridge_name } = req.query;
    const where: any = {};

    if (year) where.year = Number(year);
    if (municipality) where.municipality = { [Op.iLike]: `%${municipality}%` };
    if (bridge_name) where.bridge_name = { [Op.iLike]: `%${bridge_name}%` };

    const results = await LongWeekendStats.findAll({ where });
    res.json(results);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Error fetching long weekend stats' });
  }
});

// Eliminar registro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await LongWeekendStats.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ success: true });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el registro' });
  }
});

export default router;

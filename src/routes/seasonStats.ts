import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertSeasonStatsFromExcel } from '../services/seasonStatsProcessor';
import SeasonStats from '../models/SeasonStats.model';
import { Op } from 'sequelize';

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
router.delete('/by-date', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as { start?: string; end?: string };

    if (!start) {
      res.status(400).json({ error: 'Debe indicar al menos fecha start (YYYY-MM-DD)' });
      return;
    }

    // Construimos la condición
    const where: any = {
      date: {
        // >= start
        [Op.gte]: new Date(start),
      }
    };

    if (end) {
      // <= end (solo si end viene)
      where.date[Op.lte] = new Date(end);
    }

    // Ejecutamos el borrado en lote
    const count = await SeasonStats.destroy({ where });

    res.json({
      success: true,
      deletedCount: count,
      message: `${count} registros eliminados desde ${start}${end ? ` hasta ${end}` : ''}.`
    });
  } catch (err) {
    console.error('Error eliminando por fecha:', err);
    res.status(500).json({ error: 'Error eliminando registros por fecha' });
  }
});

export default router;

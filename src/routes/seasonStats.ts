import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertSeasonStatsFromExcel } from '../services/seasonStatsProcessor';
import SeasonStats from '../models/SeasonStats.model';
import { Op } from 'sequelize';
import { createActivityLog } from '../services/activityLog.service';
import { User } from '../models';

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
      const user = await User.findByPk((req as any).userId);
      await createActivityLog({
        user: user?.email || 'unknown',
        action: 'Subió Excel de temporadas',
        section: 'season-stats',
        details: `Archivo: ${req.file.originalname}`,
      });
      res.status(200).json({ message: `Archivo procesado correctamente.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error procesando el archivo.' });
    }
  }
);
router.get('/', async (req, res) => {
  const stats = await SeasonStats.findAll();
  res.json(stats);
});

router.post('/', async (req, res) => {
  try {
    const { year, season, municipality, occupancyRate, roomOffer, occupiedRooms, availableRooms, stay, density, touristsPerNight, avgSpending, economicImpact, touristFlow } = req.body;
    if (!year || !season || !municipality) {
      res.status(400).json({ error: 'Año, temporada y municipio son requeridos.' });
      return;
    }
    const record = await SeasonStats.create({ year, season, municipality, occupancyRate: occupancyRate ?? 0, roomOffer: roomOffer ?? 0, occupiedRooms: occupiedRooms ?? 0, availableRooms: availableRooms ?? 0, stay: stay ?? 0, density: density ?? 0, touristsPerNight: touristsPerNight ?? 0, avgSpending: avgSpending ?? 0, economicImpact: economicImpact ?? 0, touristFlow: touristFlow ?? 0 });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Creó registro de temporada',
      section: 'season-stats',
      details: `Nuevo registro con ID ${(record as any).id}`,
    });
    res.status(201).json(record);
  } catch (err) {
    console.error('Error creando registro de temporada:', err);
    res.status(500).json({ error: 'Error creando el registro.' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, season, municipality, occupancyRate, roomOffer, occupiedRooms, availableRooms, stay, density, touristsPerNight, avgSpending, economicImpact, touristFlow } = req.body;
    const record = await SeasonStats.findByPk(id);
    if (!record) {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }
    await record.update({ year, season, municipality, occupancyRate: occupancyRate ?? record.occupancyRate, roomOffer: roomOffer ?? record.roomOffer, occupiedRooms: occupiedRooms ?? record.occupiedRooms, availableRooms: availableRooms ?? record.availableRooms, stay: stay ?? record.stay, density: density ?? record.density, touristsPerNight: touristsPerNight ?? record.touristsPerNight, avgSpending: avgSpending ?? record.avgSpending, economicImpact: economicImpact ?? record.economicImpact, touristFlow: touristFlow ?? record.touristFlow });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Editó registro de temporada',
      section: 'season-stats',
      details: `Registro con ID ${id} actualizado`,
    });
    res.json(record);
  } catch (err) {
    console.error('Error actualizando registro de temporada:', err);
    res.status(500).json({ error: 'Error actualizando el registro.' });
  }
});

router.post('/delete-batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'Se requiere un arreglo de IDs.' });
      return;
    }
    await SeasonStats.destroy({ where: { id: ids } });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó lote de temporadas',
      section: 'season-stats',
      details: `IDs eliminados: ${ids.join(', ')}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando lote de temporada:', err);
    res.status(500).json({ error: 'Error eliminando el lote.' });
  }
});

router.delete('/by-date', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as { start?: string; end?: string };
    if (!start) {
      res.status(400).json({ error: 'Debe indicar al menos fecha start (YYYY-MM-DD)' });
      return;
    }
    const where: any = { date: { [Op.gte]: new Date(start) } };
    if (end) where.date[Op.lte] = new Date(end);
    const count = await SeasonStats.destroy({ where });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó temporadas por rango de fecha',
      section: 'season-stats',
      details: `${count} registros eliminados (${start}${end ? ` hasta ${end}` : ''})`,
    });
    res.json({ success: true, deletedCount: count, message: `${count} registros eliminados desde ${start}${end ? ` hasta ${end}` : ''}.` });
  } catch (err) {
    console.error('Error eliminando por fecha:', err);
    res.status(500).json({ error: 'Error eliminando registros por fecha' });
  }
});

export default router;

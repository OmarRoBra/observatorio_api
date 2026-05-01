import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import LongWeekendStats from '../models/LongWeekendStats.model';
import { insertLongWeekendStatsFromExcel } from '../services/uploadLongWeekendStatsExcel';
import { Op } from 'sequelize';
import { createActivityLog } from '../services/activityLog.service';
import { User } from '../models';

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
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Subió Excel de fines de semana largos',
      section: 'long-weekend-stats',
      details: `Archivo: ${req.file.originalname}`,
    });
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

// Insertar registro individual
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, bridge_name, municipality, occupancy_rate, room_offer, occupied_rooms, available_rooms, average_stay, occupancy_density, nights, tourists_per_night, daily_avg_spending, economic_impact, tourist_flow } = req.body;
    if (!year || !bridge_name || !municipality) {
      res.status(400).json({ error: 'Año, puente y municipio son requeridos.' });
      return;
    }
    const record = await LongWeekendStats.create({ year, bridge_name, municipality, occupancy_rate: occupancy_rate ?? 0, room_offer: room_offer ?? 0, occupied_rooms: occupied_rooms ?? 0, available_rooms: available_rooms ?? 0, average_stay: average_stay ?? 0, occupancy_density: occupancy_density ?? 0, nights: nights ?? 0, tourists_per_night: tourists_per_night ?? 0, daily_avg_spending: daily_avg_spending ?? 0, economic_impact: economic_impact ?? 0, tourist_flow: tourist_flow ?? 0 });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Creó registro de fin de semana largo',
      section: 'long-weekend-stats',
      details: `Nuevo registro con ID ${(record as any).id}`,
    });
    res.status(201).json(record);
  } catch (err) {
    console.error('Error creando registro de fin de semana largo:', err);
    res.status(500).json({ error: 'Error creando el registro.' });
  }
});

// Editar registro individual
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { year, bridge_name, municipality, occupancy_rate, room_offer, occupied_rooms, available_rooms, average_stay, occupancy_density, nights, tourists_per_night, daily_avg_spending, economic_impact, tourist_flow } = req.body;
    const record = await LongWeekendStats.findByPk(id);
    if (!record) {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }
    await record.update({ year, bridge_name, municipality, occupancy_rate: occupancy_rate ?? record.occupancy_rate, room_offer: room_offer ?? record.room_offer, occupied_rooms: occupied_rooms ?? record.occupied_rooms, available_rooms: available_rooms ?? record.available_rooms, average_stay: average_stay ?? record.average_stay, occupancy_density: occupancy_density ?? record.occupancy_density, nights: nights ?? record.nights, tourists_per_night: tourists_per_night ?? record.tourists_per_night, daily_avg_spending: daily_avg_spending ?? record.daily_avg_spending, economic_impact: economic_impact ?? record.economic_impact, tourist_flow: tourist_flow ?? record.tourist_flow });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Editó registro de fin de semana largo',
      section: 'long-weekend-stats',
      details: `Registro con ID ${id} actualizado`,
    });
    res.json(record);
  } catch (err) {
    console.error('Error actualizando registro de fin de semana largo:', err);
    res.status(500).json({ error: 'Error actualizando el registro.' });
  }
});

// Eliminar lote de registros
router.post('/delete-batch', async (req, res): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'Se requiere un arreglo de IDs.' });
      return;
    }
    await LongWeekendStats.destroy({ where: { id: ids } });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó lote de fines de semana largos',
      section: 'long-weekend-stats',
      details: `IDs eliminados: ${ids.join(', ')}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando lote de fines de semana:', err);
    res.status(500).json({ error: 'Error eliminando el lote.' });
  }
});

// Eliminar registro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await LongWeekendStats.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó registro de fin de semana largo',
      section: 'long-weekend-stats',
      details: `Registro con ID ${req.params.id} eliminado`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el registro' });
  }
});

export default router;

import { Router } from 'express';
import { upload } from '../middleware/upload';
import { readExcelFromBuffer } from '../utils/excelReader';
import { insertMonthlyStatsFromExcel } from '../services/monthlyStatsProcessor';
import MonthlyStats from '../models/MonthlyStats.model';
import { createActivityLog } from '../services/activityLog.service'
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

      await insertMonthlyStatsFromExcel(data);
      const user = await User.findByPk((req as any).userId);
      await createActivityLog({
        user: user?.email || 'unknown',
        action: 'Subió archivo excel',
        section: 'monthly-stats',
        details: `Se ha subido un archivo excel con el nombre ${req.file.originalname}`,
      });
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
router.post('/', async (req, res) => {
  try {
    const { year, month, municipality, occupancyRate, touristFlow, economicImpact } = req.body;
    if (!year || !month || !municipality || occupancyRate == null || touristFlow == null || economicImpact == null) {
      res.status(400).json({ error: 'Todos los campos son requeridos.' });
      return;
    }
    const record = await MonthlyStats.create({ year, month, municipality, occupancyRate, touristFlow, economicImpact });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Creó registro mensual',
      section: 'monthly-stats',
      details: `Nuevo registro creado con ID ${(record as any).id}`,
    });
    res.status(201).json(record);
  } catch (err) {
    console.error('Error creando registro mensual:', err);
    res.status(500).json({ error: 'Error creando el registro.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, municipality, occupancyRate, touristFlow, economicImpact } = req.body;

    const record = await MonthlyStats.findByPk(id);
    if (!record) {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }
    await record.update({ year, month, municipality, occupancyRate, touristFlow, economicImpact });
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Editó registro mensual',
      section: 'monthly-stats',
      details: `Registro con ID ${id} actualizado`,
    });
    res.json(record);
  } catch (err) {
    console.error('Error actualizando registro mensual:', err);
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
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó registro mensual',
      section: 'monthly-stats',
      details: `Se eliminó el registro con ID ${ids.join(", ")}`,
    });

    await MonthlyStats.destroy({ where: { id: ids } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando lote mensual:', err);
    res.status(500).json({ error: 'Error eliminando el lote.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MonthlyStats.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }

    // Log DENTRO del try, solo si el borrado fue exitoso
    const user = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: user?.email || 'unknown',
      action: 'Eliminó registro mensual',
      section: 'monthly-stats',
      details: `Se eliminó el registro con ID ${req.params.id}`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el registro' });
  }
});


export default router;

import express from 'express';
import multer from 'multer';
import { insertLongWeekendStatsFromExcel } from '../services/longWeekendStats.service';
import { readExcelFromBuffer } from '../utils/excelReader';
import LongWeekendStats from '../models/LongWeekendStats.model';

const router = express.Router();
const upload = multer();

router.post('/upload-excel', upload.single('file'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' });
      return;
    }
    const rows = readExcelFromBuffer(req.file.buffer);
    await insertLongWeekendStatsFromExcel(rows);
    res.json({ message: 'File processed and data loaded.' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Processing error' });
  }
});
router.get('/', async (req, res) => {
  const stats = await LongWeekendStats.findAll();
  res.json(stats);
});
export default router;

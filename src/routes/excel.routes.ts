// src/routes/excel.routes.ts
import { Router } from 'express';
import { upload, listFiles, getData, remove } from '../controllers/excel.controller';
import { uploadExcel } from '../middleware/uploadMiddleware';

const router = Router();
// src/routes/excel.routes.ts
// src/routes/excel.routes.ts
router.post(
  '/upload', 
  uploadExcel.single('file'), // Middleware de Multer
  upload                      // Controlador
); // Sin coma extra
router.get('/', listFiles);
router.get('/:id/data', getData);
router.delete('/:id', remove);

export default router;

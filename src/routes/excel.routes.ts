import { Router } from 'express';
import { upload } from '../config/multer';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { uploadExcel, getExcelData, downloadExcel } from '../controllers/excel.controller';

const router = Router();
router.post('/upload',   authMiddleware, adminOnly, upload.single('file'), uploadExcel);
router.get('/:id/data',  authMiddleware, getExcelData);
router.get('/:id/download', authMiddleware, downloadExcel);
export default router;

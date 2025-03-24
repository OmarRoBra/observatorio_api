import express from 'express';
import { uploadPdf, getPdfs } from '../controllers/inventory.controller';
import { uploadPdf as pdfmiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();

// Subir un archivo PDF
router.post('/pdfs', pdfmiddleware.single('file'), uploadPdf);

// Obtener todos los archivos PDF
router.get('/pdfs', getPdfs);

export default router;
import express from 'express';
import { uploadPdf, getPdfs, deletePdf, updatePdf } from '../controllers/pdfFront.controller';

const router = express.Router();

router.post('/', uploadPdf);         // Crear PDF
router.get('/', getPdfs);            // Obtener todos
router.put('/:id', updatePdf);       // Editar PDF
router.delete('/:id',  deletePdf);    // Eliminar PDF

export default router;

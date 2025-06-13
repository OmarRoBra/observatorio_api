import express from 'express';
import { uploadPdf, getPdfs, deletePdf, updatePdf } from '../controllers/pdfFront.controller';

const router = express.Router();

router.post('/', uploadPdf);
router.get('/', getPdfs);
router.delete('/:id', deletePdf);
router.put('/:id', updatePdf);

export default router;

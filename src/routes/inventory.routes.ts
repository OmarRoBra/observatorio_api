import express from 'express';
import { uploadPdf, getPdfs,deletePdf } from '../controllers/inventory.controller';

const router = express.Router();

router.post('/', uploadPdf);
router.get('/', getPdfs);
router.delete('/:id', deletePdf);

export default router;
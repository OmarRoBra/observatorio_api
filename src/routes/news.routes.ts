import express from 'express';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/news.controller';
import multer from 'multer';

const upload = multer();
const router = express.Router();

// Usamos multer en memoria (buffer) para enviar el archivo a Supabase
router.post('/', upload.single('image'), createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.put('/:id', upload.single('image'), updateNews);
router.delete('/:id', deleteNews);

export default router;
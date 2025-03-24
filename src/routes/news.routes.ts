import express from 'express';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/news.controller';
import { uploadImage } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', uploadImage.single('image'), createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.put('/:id', uploadImage.single('image'), updateNews);
router.delete('/:id', deleteNews);

export default router;
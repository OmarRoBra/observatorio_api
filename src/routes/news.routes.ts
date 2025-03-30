import express, { Router } from 'express';
import { 
  createNews, 
  getAllNews, 
  getNewsById, 
  updateNews, 
  deleteNews,
  uploadMiddleware
} from '../controllers/news.controller';

const router: Router = express.Router();

router.post('/', uploadMiddleware, createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.put('/:id', uploadMiddleware, updateNews);
router.delete('/:id', deleteNews);

export default router;
import express from 'express';
import { 
  createNews, 
  getAllNews, 
  getNewsById, 
  updateNews, 
  deleteNews,
} from '../controllers/news.controller';

const router = express.Router();

// Note: We removed the upload middleware since files are now uploaded directly to Supabase
router.post('/', createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router;
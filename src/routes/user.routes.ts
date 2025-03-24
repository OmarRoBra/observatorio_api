import express from 'express';
import { getUser, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, getUser);
/* router.put('/me', authMiddleware, updateUser);
 */
export default router;
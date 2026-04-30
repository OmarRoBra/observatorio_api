import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', authMiddleware, isAdmin, register);

export default router;
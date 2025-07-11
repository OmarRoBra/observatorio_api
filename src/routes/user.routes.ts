import express from 'express';
import { getUser, updateUser,deleteUser,getAllUsers } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, getUser);
// Descomentar la ruta PUT y añadir DELETE
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);
router.get('/', authMiddleware, getAllUsers); // GET /users

export default router;

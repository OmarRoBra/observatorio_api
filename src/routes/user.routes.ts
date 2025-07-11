import express from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Para cualquier usuario autenticado
router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

// Para administración
router.get('/', authMiddleware, getAllUsers);         // GET /users
router.put('/:id', authMiddleware, updateUserById);   // PUT /users/:id
router.delete('/:id', authMiddleware, deleteUserById); // DELETE /users/:id

export default router;

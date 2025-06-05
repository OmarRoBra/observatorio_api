import express from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserbyId,
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Rutas de usuario personal
router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

// === CRUD de usuarios para ADMIN ===
router.get('/', authMiddleware, getAllUsers);      // Obtener todos los usuarios
router.post('/', authMiddleware, createUser);      // Crear usuario nuevo
router.put('/:id', authMiddleware, updateUserById); // Actualizar usuario por id
router.delete('/:id', authMiddleware, deleteUserbyId); // Eliminar usuario por id

export default router;

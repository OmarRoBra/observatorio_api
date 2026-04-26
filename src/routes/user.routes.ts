import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 1. PRIMERO LAS RUTAS ESTÁTICAS (Para evitar que /:id se trague a /me)
router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

// 2. RUTAS GENERALES
router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, createUser);

// 3. AL FINAL LAS RUTAS DINÁMICAS CON PARÁMETROS (/:id)
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
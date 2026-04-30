import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// 1. PRIMERO LAS RUTAS ESTÁTICAS (Para evitar que /:id se trague a /me)
// GET y PUT a /me solo requieren estar autenticado
router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

// 2. RUTAS GENERALES (Protegidas con isAdmin)
router.get('/', authMiddleware, isAdmin, getAllUsers);
router.post('/', authMiddleware, isAdmin, createUser);

// 3. AL FINAL LAS RUTAS DINÁMICAS CON PARÁMETROS (/:id) (Protegidas con isAdmin)
router.put('/:id', authMiddleware, isAdmin, updateUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

export default router;
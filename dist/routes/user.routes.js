"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Rutas de usuario personal
router.get('/me', auth_middleware_1.authMiddleware, user_controller_1.getUser);
router.put('/me', auth_middleware_1.authMiddleware, user_controller_1.updateUser);
router.delete('/me', auth_middleware_1.authMiddleware, user_controller_1.deleteUser);
// === CRUD de usuarios para ADMIN ===
router.get('/', auth_middleware_1.authMiddleware, user_controller_1.getAllUsers); // Obtener todos los usuarios
router.post('/', auth_middleware_1.authMiddleware, user_controller_1.createUser); // Crear usuario nuevo
router.put('/:id', auth_middleware_1.authMiddleware, user_controller_1.updateUserById); // Actualizar usuario por id
router.delete('/:id', auth_middleware_1.authMiddleware, user_controller_1.deleteUserbyId); // Eliminar usuario por id
exports.default = router;

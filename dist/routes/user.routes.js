"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// 1. PRIMERO LAS RUTAS ESTÁTICAS (Para evitar que /:id se trague a /me)
// GET y PUT a /me solo requieren estar autenticado
router.get('/me', auth_middleware_1.authMiddleware, user_controller_1.getUser);
router.put('/me', auth_middleware_1.authMiddleware, user_controller_1.updateUser);
router.delete('/me', auth_middleware_1.authMiddleware, user_controller_1.deleteUser);
// 2. RUTAS GENERALES (Protegidas con isAdmin)
router.get('/', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, user_controller_1.getAllUsers);
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, user_controller_1.createUser);
// 3. AL FINAL LAS RUTAS DINÁMICAS CON PARÁMETROS (/:id) (Protegidas con isAdmin)
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, user_controller_1.deleteUser);
exports.default = router;

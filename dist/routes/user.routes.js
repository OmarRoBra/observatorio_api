"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.authMiddleware, user_controller_1.getUser);
// Descomentar la ruta PUT y añadir DELETE
router.put('/me', auth_middleware_1.authMiddleware, user_controller_1.updateUser);
router.delete('/me', auth_middleware_1.authMiddleware, user_controller_1.deleteUser);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.userId = decoded.userId; // Assign userId to req
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
const user_model_1 = __importDefault(require("../models/user.model"));
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = yield user_model_1.default.findByPk(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Permitir acceso si es el usuario principal o si su rol es admin
        if (user.email === 'sergio@ucol.mx' || user.role === 'admin') {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden: Requires admin role' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking admin permissions' });
    }
});
exports.isAdmin = isAdmin;

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
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const activityLog_service_1 = require("../services/activityLog.service");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll({
            attributes: { exclude: ["password"] },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        // Verificar si el usuario ya existe
        const existingUser = yield user_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Crear el usuario
        const user = yield user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'editor'
        });
        // Excluir la contraseña de la respuesta
        const userResponse = Object.assign({}, user.toJSON());
        delete userResponse.password;
        // Registrar actividad
        const creator = yield user_model_1.default.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (creator === null || creator === void 0 ? void 0 : creator.email) || 'unknown',
            action: 'Creó usuario',
            section: 'usuarios',
            details: `Nuevo usuario creado: ${email} con rol ${role || 'editor'}`,
        });
        res.status(201).json({ message: 'User created successfully', user: userResponse });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Use req.userId
    try {
        const user = yield user_model_1.default.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id || req.userId;
    const { name, email } = req.body;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        yield user.save();
        // Registrar actividad
        const updater = yield user_model_1.default.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (updater === null || updater === void 0 ? void 0 : updater.email) || 'unknown',
            action: 'Editó usuario',
            section: 'usuarios',
            details: `Usuario ${user.email} actualizado`,
        });
        res.json({ message: "User updated", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});
exports.updateUser = updateUser;
// Añadir método para eliminar usuario
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id || req.userId;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userEmail = user.email;
        yield user.destroy();
        // Registrar actividad
        const deleter = yield user_model_1.default.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (deleter === null || deleter === void 0 ? void 0 : deleter.email) || 'unknown',
            action: 'Eliminó usuario',
            section: 'usuarios',
            details: `Usuario eliminado: ${userEmail}`,
        });
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});
exports.deleteUser = deleteUser;

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
exports.deleteUserbyId = exports.updateUserById = exports.createUser = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    const userId = req.userId;
    const { name, email } = req.body;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; // Importante: usar return para detener la ejecución
        }
        user.name = name || user.name;
        user.email = email || user.email;
        yield user.save();
        res.json({ message: "User updated", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});
exports.updateUser = updateUser;
// Añadir método para eliminar usuario
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        yield user.destroy();
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const users = yield user_model_1.default.findAll({
            attributes: { exclude: ["password"] }, // Excluir la contraseña
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.role !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.default.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: "User created", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.createUser = createUser;
// esitar usuario (admin)
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    const userId = req.params.id;
    const { name, email, role } = req.body;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        yield user.save();
        res.json({ message: "User updated", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});
exports.updateUserById = updateUserById;
const deleteUserbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    const userId = req.params.id;
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        yield user.destroy();
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});
exports.deleteUserbyId = deleteUserbyId;

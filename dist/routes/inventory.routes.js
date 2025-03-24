"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("../controllers/inventory.controller");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
// Subir un archivo PDF
router.post('/pdfs', uploadMiddleware_1.uploadPdf.single('file'), inventory_controller_1.uploadPdf);
// Obtener todos los archivos PDF
router.get('/pdfs', inventory_controller_1.getPdfs);
exports.default = router;

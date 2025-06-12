"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfFront_controller_1 = require("../controllers/pdfFront.controller");
const router = express_1.default.Router();
router.post('/', pdfFront_controller_1.uploadPdf); // Crear PDF
router.get('/', pdfFront_controller_1.getPdfs); // Obtener todos
router.put('/:id', pdfFront_controller_1.updatePdf); // Editar PDF
router.delete('/:id', pdfFront_controller_1.deletePdf); // Eliminar PDF
exports.default = router;

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
exports.getPdfs = exports.uploadPdf = void 0;
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuración de multer para guardar archivos PDF
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads/pdfs')); // Guardar archivos en la carpeta "uploads/pdfs"
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre del archivo: timestamp + nombre original
    },
});
const upload = (0, multer_1.default)({ storage });
// Subir un archivo PDF
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        if (!req.file) {
            res.status(400).json({ message: 'No se proporcionó un archivo PDF' });
            return; // Asegúrate de salir de la función después de enviar la respuesta
        }
        const fileUrl = `/uploads/pdf/${req.file.filename}`;
        const pdf = yield inventory_model_1.default.create({ title, fileUrl });
        res.status(201).json(pdf); // Envía la respuesta sin devolverla
    }
    catch (error) {
        res.status(500).json({ message: 'Error al subir el archivo PDF', error });
    }
});
exports.uploadPdf = uploadPdf;
// Obtener todos los archivos PDF
const getPdfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield inventory_model_1.default.findAll();
        res.json(pdfs); // Envía la respuesta sin devolverla
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los archivos PDF', error });
    }
});
exports.getPdfs = getPdfs;

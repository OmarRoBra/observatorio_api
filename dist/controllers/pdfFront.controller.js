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
exports.deletePdf = exports.updatePdf = exports.getPdfs = exports.uploadPdf = exports.uploadMiddleware = void 0;
const pdfFront_models_1 = __importDefault(require("../models/pdfFront.models"));
const multer_1 = __importDefault(require("multer"));
// Configuración de multer para subir archivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pdfFront'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten archivos PDF'));
        }
    }
});
// Crear/Subir PDF
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No se subió ningún archivo' });
            return;
        }
        if (!title || !category) {
            res.status(400).json({ error: 'Título y categoría son requeridos' });
            return;
        }
        // Crear la URL del archivo (ajusta según tu configuración)
        const fileUrl = `/uploads/pdfFront/${file.filename}`;
        const newPdf = yield pdfFront_models_1.default.create({
            title,
            category,
            fileUrl
        });
        res.status(201).json({
            message: 'PDF subido exitosamente',
            pdf: newPdf
        });
    }
    catch (error) {
        console.error('Error al subir PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.uploadPdf = uploadPdf;
// Obtener todos los PDFs
const getPdfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield pdfFront_models_1.default.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(pdfs);
    }
    catch (error) {
        console.error('Error al obtener PDFs:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getPdfs = getPdfs;
// Actualizar PDF
const updatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, category } = req.body;
        const pdf = yield pdfFront_models_1.default.findByPk(id);
        if (!pdf) {
            res.status(404).json({ error: 'PDF no encontrado' });
            return;
        }
        yield pdf.update({
            title: title || pdf.title,
            category: category || pdf.category
        });
        res.json({
            message: 'PDF actualizado exitosamente',
            pdf
        });
    }
    catch (error) {
        console.error('Error al actualizar PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.updatePdf = updatePdf;
// Eliminar PDF
const deletePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pdf = yield pdfFront_models_1.default.findByPk(id);
        if (!pdf) {
            res.status(404).json({ error: 'PDF no encontrado' });
            return;
        }
        // Opcional: eliminar el archivo físico del servidor
        // const fs = require('fs');
        // const filePath = path.join(__dirname, '..', pdf.fileUrl);
        // if (fs.existsSync(filePath)) {
        //   fs.unlinkSync(filePath);
        // }
        yield pdf.destroy();
        res.json({ message: 'PDF eliminado exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.deletePdf = deletePdf;

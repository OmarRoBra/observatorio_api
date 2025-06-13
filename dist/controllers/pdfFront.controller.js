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
exports.updatePdf = exports.deletePdf = exports.getPdfs = exports.uploadPdf = void 0;
const pdfFront_model_1 = __importDefault(require("../models/pdfFront.model"));
// Subir PDF (metadatos y URL, sin subir archivo aquí)
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, fileUrl, category } = req.body;
        const pdf = yield pdfFront_model_1.default.create({ title, fileUrl, category });
        res.status(201).json(pdf);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al subir PDF', error });
    }
});
exports.uploadPdf = uploadPdf;
const getPdfs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield pdfFront_model_1.default.findAll();
        res.json(pdfs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener PDFs', error });
    }
});
exports.getPdfs = getPdfs;
const deletePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield pdfFront_model_1.default.destroy({ where: { id } });
        if (result) {
            res.json({ message: 'PDF eliminado' });
        }
        else {
            res.status(404).json({ message: 'PDF no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar PDF', error });
    }
});
exports.deletePdf = deletePdf;
const updatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, fileUrl, category } = req.body;
        const [updated] = yield pdfFront_model_1.default.update({ title, fileUrl, category }, { where: { id } });
        if (updated) {
            res.json({ message: 'PDF actualizado correctamente' });
        }
        else {
            res.status(404).json({ message: 'PDF no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar PDF', error });
    }
});
exports.updatePdf = updatePdf;

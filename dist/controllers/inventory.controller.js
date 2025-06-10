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
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Body recibido:', req.body);
        const { title, fileUrl, category } = req.body;
        if (!title || !fileUrl || !category) {
            res.status(400).json({
                message: 'Title, file URL, and category are required'
            });
            return;
        }
        const pdf = yield inventory_model_1.default.create({ title, fileUrl, category });
        res.status(201).json(Object.assign(Object.assign({}, pdf.toJSON()), { url: pdf.fileUrl }));
    }
    catch (error) {
        console.error('Error saving PDF:', error);
        res.status(500).json({
            message: 'Error saving PDF information',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.uploadPdf = uploadPdf;
// controllers/inventory.controller.ts
const getPdfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield inventory_model_1.default.findAll();
        const mappedPdfs = pdfs.map((pdf) => {
            const obj = pdf.toJSON();
            return Object.assign(Object.assign({}, obj), { url: obj.fileUrl }); // agrega url
        });
        res.json(mappedPdfs);
    }
    catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({
            message: 'Error getting PDFs',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getPdfs = getPdfs;
const deletePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pdf = yield inventory_model_1.default.findByPk(id);
        if (!pdf) {
            res.status(404).json({ message: 'PDF not found' });
            return;
        }
        yield pdf.destroy();
        res.json({ message: 'PDF deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(500).json({
            message: 'Error deleting PDF',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deletePdf = deletePdf;
const updatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, fileUrl, category } = req.body;
        const pdf = yield inventory_model_1.default.findByPk(id);
        if (!pdf) {
            res.status(404).json({ message: 'PDF not found' });
            return;
        }
        if (title)
            pdf.title = title;
        if (fileUrl)
            pdf.fileUrl = fileUrl;
        if (category)
            pdf.category = category;
        yield pdf.save();
        res.json(Object.assign(Object.assign({}, pdf.toJSON()), { url: pdf.fileUrl }));
    }
    catch (error) {
        console.error('Error updating PDF:', error);
        res.status(500).json({
            message: 'Error updating PDF',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updatePdf = updatePdf;

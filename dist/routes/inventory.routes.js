"use strict";
// src/routes/inventory.routes.ts
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
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const router = (0, express_1.Router)();
// === POST /inventory
// - Assumes uploadPdf is exported as:
//     export const uploadPdf: (req: Request, res: Response, next: NextFunction) => Promise<any>
//   or similar.
router.post('/', inventory_controller_1.uploadPdf);
// === GET /inventory
// - Assumes getPdfs is exported as:
//     export const getPdfs: (req: Request, res: Response, next: NextFunction) => Promise<any>
router.get('/', inventory_controller_1.getPdfs);
// Definimos el handler usando la interfaz RequestHandler<Params, ResBody, ReqBody>:
const updatePdfHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, category } = req.body;
    if (!title) {
        res
            .status(400)
            .json({ success: false, message: 'El título es obligatorio' });
        return;
    }
    try {
        const pdf = yield inventory_model_1.default.findByPk(id);
        if (!pdf) {
            res
                .status(404)
                .json({ success: false, message: 'Documento no encontrado' });
            return;
        }
        pdf.title = title;
        pdf.category = category !== null && category !== void 0 ? category : '';
        yield pdf.save();
        res.json({
            success: true,
            message: 'PDF actualizado correctamente',
            pdf: {
                id: pdf.id,
                title: pdf.title,
                category: pdf.category,
                url: pdf.fileUrl,
            },
        });
        return;
    }
    catch (error) {
        console.error('Error actualizando PDF:', error);
        next(error);
    }
});
// Ahora TypeScript sabe que updatePdfHandler es un RequestHandler válido:
router.put('/:id', updatePdfHandler);
exports.default = router;

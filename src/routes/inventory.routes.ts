// src/routes/inventory.routes.ts

import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { uploadPdf, getPdfs, deletePdf } from '../controllers/inventory.controller';
import Inventory from '../models/inventory.model';

const router = Router();

// === POST /inventory
// - Assumes uploadPdf is exported as:
//     export const uploadPdf: (req: Request, res: Response, next: NextFunction) => Promise<any>
//   or similar.
router.post('/', uploadPdf);

// === GET /inventory
// - Assumes getPdfs is exported as:
//     export const getPdfs: (req: Request, res: Response, next: NextFunction) => Promise<any>
router.get('/', getPdfs);

// === GET /inventory/:id
type UpdatePdfParams = { id: string };
type UpdatePdfBody   = { title: string; category?: string };

// Definimos el handler usando la interfaz RequestHandler<Params, ResBody, ReqBody>:
const updatePdfHandler: RequestHandler<
  UpdatePdfParams,   // tipo de req.params
  any,               // tipo de res.json()/res.send() (pon cualquier interfaz si quieres más precisión)
  UpdatePdfBody      // tipo de req.body
> = async (req, res, next) => {
  const { id } = req.params;
  const { title, category } = req.body;

  if (!title) {
    res
      .status(400)
      .json({ success: false, message: 'El título es obligatorio' });
    return;
  }

  try {
    const pdf = await Inventory.findByPk(id);
    if (!pdf) {
      res
        .status(404)
        .json({ success: false, message: 'Documento no encontrado' });
      return;
    }

    pdf.title    = title;
    pdf.category = category ?? '';
    await pdf.save();

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
  } catch (error) {
    console.error('Error actualizando PDF:', error);
    next(error);
  }
};

// Ahora TypeScript sabe que updatePdfHandler es un RequestHandler válido:
router.put('/:id', updatePdfHandler);


export default router;

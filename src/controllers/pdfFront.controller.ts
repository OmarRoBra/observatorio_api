import { Request, Response } from 'express';
import PdfFront from '../models/pdfFront.model';

// Subir PDF (metadatos y URL, sin subir archivo aquí)
export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const { title, fileUrl, category } = req.body;
    const pdf = await PdfFront.create({ title, fileUrl, category });
    res.status(201).json(pdf);
  } catch (error) {
    res.status(500).json({ message: 'Error al subir PDF', error });
  }
};

export const getPdfs = async (_req: Request, res: Response) => {
  try {
    const pdfs = await PdfFront.findAll();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener PDFs', error });
  }
};

export const deletePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await PdfFront.destroy({ where: { id } });
    if (result) {
      res.json({ message: 'PDF eliminado' });
    } else {
      res.status(404).json({ message: 'PDF no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar PDF', error });
  }
};

export const updatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, fileUrl, category } = req.body;
    const [updated] = await PdfFront.update(
      { title, fileUrl, category },
      { where: { id } }
    );
    if (updated) {
      res.json({ message: 'PDF actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'PDF no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar PDF', error });
  }
};

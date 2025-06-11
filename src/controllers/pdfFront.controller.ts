import { Request, Response } from 'express';
import PdfFront from '../models/pdfFront.models';

// Crear PDF
export const uploadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, fileUrl, category } = req.body;
    if (!title || !fileUrl || !category) {
      res.status(400).json({ message: 'Title, file URL, and category are required' });
      return;
    }
    const pdf = await PdfFront.create({ title, fileUrl, category });
    res.status(201).json({ ...pdf.toJSON(), url: pdf.fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error saving PDF information', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Obtener todos los PDFs
export const getPdfs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pdfs = await PdfFront.findAll();
    const mappedPdfs = pdfs.map((pdf: any) => {
      const obj = pdf.toJSON();
      return { ...obj, url: obj.fileUrl };
    });
    res.json(mappedPdfs);
  } catch (error) {
    res.status(500).json({ message: 'Error getting PDFs', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Actualizar PDF
export const updatePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, fileUrl, category } = req.body;
    const pdf = await PdfFront.findByPk(id);
    if (!pdf) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }
    if (title) pdf.title = title;
    if (fileUrl) pdf.fileUrl = fileUrl;
    if (category) pdf.category = category;
    await pdf.save();
    res.json({ ...pdf.toJSON(), url: pdf.fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error updating PDF', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Eliminar PDF
export const deletePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pdf = await PdfFront.findByPk(id);
    if (!pdf) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }
    await pdf.destroy();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting PDF', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

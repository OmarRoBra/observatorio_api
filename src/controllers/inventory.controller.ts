import { Request, Response } from 'express';
import Pdf from '../models/inventory.model';

export const uploadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Body recibido:', req.body); 
    const { title, fileUrl, category } = req.body;

    if (!title || !fileUrl || !category) {
      res.status(400).json({ 
        message: 'Title, file URL, and category are required' 
      });
      return;
    }

    const pdf = await Pdf.create({ title, fileUrl, category });
    res.status(201).json({ ...pdf.toJSON(), url: pdf.fileUrl });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ 
      message: 'Error saving PDF information',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
// controllers/inventory.controller.ts
export const getPdfs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdfs = await Pdf.findAll();
    const mappedPdfs = pdfs.map((pdf: any) => {
      const obj = pdf.toJSON();
      return { ...obj, url: obj.fileUrl }; // agrega url
    });
    res.json(mappedPdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ 
      message: 'Error getting PDFs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pdf = await Pdf.findByPk(id);
    if (!pdf) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }

    await pdf.destroy();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ 
      message: 'Error deleting PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
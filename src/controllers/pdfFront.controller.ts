import { Request, Response } from 'express';
import PdfFront from '../models/pdfFront.model';

// Subir PDF (metadatos y URL, sin subir archivo aquí)

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

    const pdf = await PdfFront.create({ title, fileUrl, category });
    res.status(201).json({ ...pdf.toJSON(), url: pdf.fileUrl });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ 
      message: 'Error saving PDF information',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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
export const getPdfs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdfs = await PdfFront.findAll();
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

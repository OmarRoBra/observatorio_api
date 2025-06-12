import { Request, Response } from 'express';
import PdfFront from '../models/pdfFront.models';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs'); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const uploadMiddleware = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  }
});

// Crear/Subir PDF
export const uploadPdf = async (req: Request, res: Response) => {
  uploadMiddleware.single('pdf')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, category } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }

      if (!title || !category) {
        return res.status(400).json({ error: 'Título y categoría son requeridos' });
      }

      // Crear la URL del archivo (ajusta según tu configuración)
      const fileUrl = `/uploads/pdfs/${file.filename}`;

      const newPdf = await PdfFront.create({
        title,
        category,
        fileUrl
      });

      res.status(201).json({
        message: 'PDF subido exitosamente',
        pdf: newPdf
      });

    } catch (error) {
      console.error('Error al subir PDF:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};

// Obtener todos los PDFs
export const getPdfs = async (req: Request, res: Response) => {
  try {
    const pdfs = await PdfFront.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(pdfs);
  } catch (error) {
    console.error('Error al obtener PDFs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar PDF
export const updatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;

    const pdf = await PdfFront.findByPk(id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF no encontrado' });
    }

    await pdf.update({
      title: title || pdf.title,
      category: category || pdf.category
    });

    res.json({
      message: 'PDF actualizado exitosamente',
      pdf
    });

  } catch (error) {
    console.error('Error al actualizar PDF:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar PDF
export const deletePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pdf = await PdfFront.findByPk(id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF no encontrado' });
    }

    // Opcional: eliminar el archivo físico del servidor
    // const fs = require('fs');
    // const filePath = path.join(__dirname, '..', pdf.fileUrl);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    await pdf.destroy();

    res.json({ message: 'PDF eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar PDF:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
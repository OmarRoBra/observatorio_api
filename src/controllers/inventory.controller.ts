import { Request, Response } from 'express';
import Pdf from '../models/inventory.model';
import multer from 'multer';
import path from 'path';

// Configuración de multer para guardar archivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/pdfs')); // Guardar archivos en la carpeta "uploads/pdfs"
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre del archivo: timestamp + nombre original
  },
});

const upload = multer({ storage });

// Subir un archivo PDF
export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      res.status(400).json({ message: 'No se proporcionó un archivo PDF' });
      return; // Asegúrate de salir de la función después de enviar la respuesta
    }

    const fileUrl = `/uploads/pdf/${req.file.filename}`;
    const pdf = await Pdf.create({ title, fileUrl });

    res.status(201).json(pdf); // Envía la respuesta sin devolverla
  } catch (error) {
    res.status(500).json({ message: 'Error al subir el archivo PDF', error });
  }
};

// Obtener todos los archivos PDF
export const getPdfs = async (req: Request, res: Response) => {
  try {
    const pdfs = await Pdf.findAll();
    res.json(pdfs); // Envía la respuesta sin devolverla
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los archivos PDF', error });
  }
};  
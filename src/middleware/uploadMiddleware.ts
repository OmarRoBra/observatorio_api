import path from 'path';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Configuración para imágenes
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configuración para PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/pdf'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtros de archivos
const imageFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const pdfFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};
const excelStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    cb(null, path.join(__dirname, '../../uploads/excel'));
  },
  filename: (
    req: Request, 
    file: Express.Multer.File,
    cb: FileNameCallback
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const excelFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  allowedMimeTypes.includes(file.mimetype) 
    ? cb(null, true)
    : cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'));
};

export const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
export const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });
export const uploadPdf = multer({ storage: pdfStorage, fileFilter: pdfFilter });
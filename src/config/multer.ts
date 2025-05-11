// src/config/multer.ts
import multer from 'multer';
import path from 'path';

// Carpeta de destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

export const upload = multer({ storage });

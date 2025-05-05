import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: 'uploads/',                      // Carpeta donde se guardan los archivos
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    // Genera un nombre único con timestamp
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

// Exportamos el middleware listo para usarse
export const upload = multer({ storage });

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

/**
 * Comprueba que venga un token válido, extrae id y role,
 * y llama a next() si todo está OK.
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // 1) Extraer el token
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: 'No token provided' });
    return; // termina la función con void
  }
  const token = header.split(' ')[1];

  // 2) Verificar y extraer payload
  try {
    const payload = verifyToken(token);  // tu función propia
    req.userId   = payload.id;
    req.userRole = payload.role;
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  // 3) ¡Muy importante! Llamar a next para que Express siga al controlador
  next();
};

/**
 * Solo deja pasar si el rol es "admin".
 */
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admins only' });
    return;
  }
  next();
};

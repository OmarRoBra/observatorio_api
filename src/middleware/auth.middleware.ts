import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId; // Assign userId to req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

import User from '../models/user.model';

export const isAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Permitir acceso si es el usuario principal o si su rol es admin
    if (user.email === 'sergio@ucol.mx' || user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Requires admin role' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin permissions' });
  }
};
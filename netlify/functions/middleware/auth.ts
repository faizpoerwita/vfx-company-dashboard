import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '63c6bc93bb1276b2980ec76d021eda91c689f38c28a48eae3222be00f9360ae65bfacb5284c81689c8b437be925754c536ff3fa7fd2b3c4c3919f949a87b461e';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log('Auth headers:', req.headers);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token found in request');
      res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
      return;
    }

    console.log('Verifying token:', token);
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({
          success: false,
          message: 'Token tidak valid'
        });
        return;
      }

      console.log('Token verified successfully:', decoded);
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memverifikasi token'
    });
  }
};

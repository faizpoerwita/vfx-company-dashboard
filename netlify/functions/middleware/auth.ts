import { Handler } from '@netlify/functions';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '63c6bc93bb1276b2980ec76d021eda91c689f38c28a48eae3222be00f9360ae65bfacb5284c81689c8b437be925754c536ff3fa7fd2b3c4c3919f949a87b461e';

interface AuthResult {
  success: boolean;
  userId?: string;
  role?: string;
  error?: string;
}

export const authenticateToken = async (event: Parameters<Handler>[0]): Promise<AuthResult> => {
  try {
    const authHeader = event.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return {
        success: false,
        error: 'Token tidak ditemukan'
      };
    }

    return new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          resolve({
            success: false,
            error: 'Token tidak valid'
          });
          return;
        }

        resolve({
          success: true,
          userId: decoded.userId,
          role: decoded.role
        });
      });
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat memverifikasi token'
    };
  }
};

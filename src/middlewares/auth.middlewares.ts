// middlewares/auth.middleware.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// Không cần import type declaration ở đây

const SECRET = process.env.SECRET;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'Chưa đăng nhập' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET || 'secret');
    req.user = decoded as JwtPayload & { email: string; id?: number | undefined; };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
    return;
  }
};
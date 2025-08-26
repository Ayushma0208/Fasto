import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const generateTokenAdmin = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: 'admin', 
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    }
  );
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
     res.status(401).json({ message: 'Unauthorized' });
     return
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== 'admin') {
       res.status(403).json({ message: 'Access denied. Admins only.' });
       return
    }
    req.user = decoded;
    next();
  } catch (err) {
     res.status(401).json({ message: 'Invalid or expired token' });
     return
  }
};

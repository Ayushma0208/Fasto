import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const generateToken = (user: { id: number; email: string; role?: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "24h" }
  );
};

export const generateAdminToken = (user: { id: number; email: string; role?: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ADMIN_JWT_SECRET || "default_secret",
    { expiresIn: "24h" }
  );
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Token not provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
      id: number;
      email: string;
      role: string; 
    };

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string }; 

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: unauthorized role" });
    }
    next();
  };
};

export const generateResetToken = (userId: number | string) => {
  const token = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your_jwt_secret', 
    { expiresIn: '1h' }
  );
  return token;
};

const exampleUser = { id: 1 }; 
const token = generateResetToken(exampleUser.id);
console.log('Reset Token:', token);

// Now you can send this in email like:
const resetLink = `http://localhost:5000/reset-password/${token}`;
console.log('Reset link:', resetLink);
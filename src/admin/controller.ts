import argon2 from "argon2";
import { createAdmin, findAdminByEmail } from "./model";
import { Request, Response } from "express";

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password || !phone) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      res.status(400).json({ message: 'Admin already exists with this email.' });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const newAdmin = await createAdmin(full_name, email, hashedPassword, phone);

    res.status(201).json({
      message: 'Admin created successfully.',
      admin: newAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};


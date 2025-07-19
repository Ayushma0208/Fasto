import argon2 from "argon2";
import { RequestHandler } from "express";
import { createAdmin, findAdminByEmail, getAllUsersModel } from "./model";
import { Request, Response } from "express";
import { generateToken } from "../middleware/auth";
import { generateTokenAdmin } from "../middleware/adminAuth";

export const adminSignup : RequestHandler = async (req, res): Promise<void> => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password || !phone) {
      res.status(400).json({ message: 'All fields are required.' });
      return ;
    }
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      res.status(400).json({ message: 'Admin already exists with this email.' });
      return ;
    }
    const hashedPassword = await argon2.hash(password);
    const newAdmin = await createAdmin(full_name, email, hashedPassword, phone);
    res.status(201).json({message: 'Admin created successfully.',admin: newAdmin,});
    return ;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

export const adminLogin: RequestHandler = async (req, res): Promise<void> => {
  const { email, password } = req.body;
  const result = await findAdminByEmail(email);
  const user = result.rows[0];
  if (!user) {
  res.status(401).json({ message: "Invalid credentials" });
  return;
  }
  const isValid = await argon2.verify(user.password_hash, password);
  if (!isValid) {
   res.status(401).json({ message: "Invalid credentials" });
   return;
  }
  const token = generateTokenAdmin(user);

  res.json({ message: "Login successful", token });
};


export const getAllUsers : RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await getAllUsersModel();
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


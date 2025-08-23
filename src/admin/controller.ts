import argon2 from "argon2";
import { RequestHandler } from "express";
import { blockedId, createAdmin, findAdminByEmail, getAllUsersModel, getUserBlockStatus, unblockUserById } from "./model";
import { Request, Response } from "express";
import { generateToken } from "../middleware/auth";
import { generateTokenAdmin } from "../middleware/adminAuth";

export const adminSignup : RequestHandler = async (req, res): Promise<void> => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password || !phone) {
      res.status(402).json({ message: 'All fields are required.' });
      return ;
    }
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      res.status(401).json({ message: 'Admin already exists with this email.' });
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

export const blockUser : RequestHandler = async (req, res): Promise<void> => {
  const userId = req.params.id;
 
  try {
      const check = await getUserBlockStatus(userId);

    if (check.rowCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const isBlocked = check.rows[0].is_blocked;
    if (isBlocked) {
      res.status(200).json({ message: 'User is already blocked' });
      return;
    }
    const result = await blockedId(userId);
      if (result.rowCount === 0) {
       res.status(404).json({ message: 'User not found' });
       return;
    }
    res.status(200).json({ message: "User blocked successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const unblockUser: RequestHandler = async (req, res): Promise<void> => {
  const userId = req.params.id;

  try {
    const check = await getUserBlockStatus(userId);

    if (check.rowCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isBlocked = check.rows[0].is_blocked;

    if (!isBlocked) {
      res.status(200).json({ message: 'User is already unblocked' });
      return;
    }
    const result = await unblockUserById(userId);
    res.status(200).json({
      message: 'User unblocked successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(501).json({ message: 'Internal server error' });
  }
};

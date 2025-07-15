import { Request, Response } from "express";
import { RequestHandler } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, updateUserById } from "./model";
import { generateToken } from "../middleware/auth";
import sendEmail from "../utils/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Signup controller
export const userSignup: RequestHandler = async (req, res): Promise<void> => {
  const { full_name, email, password, phone, address } = req.body;

  const existing = await findUserByEmail(email);
  if (existing.rows.length > 0) {
    res.status(400).json({ message: "Email already registered" });
    return;
  }

  const hashedPassword = await argon2.hash(password);
  const result = await createUser(full_name, email, hashedPassword, phone, address);

   await sendEmail(
      email,
      "Welcome to Fasto Admin!",
      `Hi ${full_name},\n\nWelcome to Fasto Admin Panel.\n\nRegards,\nTeam Fasto`
    );

    res.status(201).json({
      message: "Admin created successfully. Email sent.",
      admin: result.rows[0],
    });
  return;
};

// Login controller
export const userLogin: RequestHandler = async (req, res): Promise<void> => {
  const { email, password } = req.body;
  const result = await findUserByEmail(email);
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
  const token = generateToken({ id: user.id, email: user.email });

  res.json({ message: "Login successful", token });
};

export const userUpdate: RequestHandler = async (req, res): Promise<void> => {
  const id = req.user?.id;
  console.log("id>>>>>",id)
  if (!id) {
    res.status(401).json({ message: "Unauthorized: Missing user ID" });
    return;
  }

  const { name, email, phone, address } = req.body;
  const fieldsToUpdate: { [key: string]: string } = {};
  if (name) fieldsToUpdate.name = name;
  if (email) fieldsToUpdate.email = email;
  if (phone) fieldsToUpdate.phone = phone;
  if(address) fieldsToUpdate.address = address;

  if (Object.keys(fieldsToUpdate).length === 0) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  try {
    const result = await updateUserById(id, fieldsToUpdate);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found or no update performed" });
      return;
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}


//testing for github
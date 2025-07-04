import { Request, Response } from "express";
import { RequestHandler } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./model";
import { generateToken } from "../middleware/auth";

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

  res.status(201).json({ message: "Signup successful", user: result.rows[0] });
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
  const token = generateToken(user);

  res.json({ message: "Login successful", token });
};

import db from "../config/db";
import { QueryResult } from "pg";

export const findUserByEmail = async (email: string): Promise<QueryResult> => {
  return await db.query("SELECT * FROM users WHERE email = $1", [email]);
};

export const createUser = async (
  full_name: string,
  email: string,
  password_hash: string,
  phone?: string,
  address?: string
): Promise<QueryResult> => {
  return await db.query(
    `INSERT INTO users (full_name, email, password_hash, phone, address)
     VALUES ($1, $2, $3, $4, $5) RETURNING user_id, full_name, email`,
    [full_name, email, password_hash, phone, address]
  );
};

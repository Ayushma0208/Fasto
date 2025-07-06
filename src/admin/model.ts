import db from "../config/db";
import { QueryResult } from "pg";

export const findAdminByEmail = async (email: string) => {
  const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
  return result.rows[0];
};

export const createAdmin = async (full_name: string, email: string, password_hash: string, phone?: string) => {
  const result = await db.query(
    `INSERT INTO admins (full_name, email, password_hash,phone) VALUES ($1, $2, $3,$4) RETURNING admin_id, full_name, email, created_at`,
    [full_name, email, password_hash, phone]
  );
  return result.rows[0];
};


//testing

import db from "../config/db";
import { QueryResult } from "pg";

export const findAdminByEmail = async (email: string): Promise<QueryResult> => {
  return await db.query("SELECT * FROM admins WHERE email = $1", [email]);
};

export const createAdmin = async (full_name: string, email: string, password_hash: string, phone?: string) => {
  const result = await db.query(
    `INSERT INTO admins (full_name, email, password_hash,phone) VALUES ($1, $2, $3,$4) RETURNING admin_id, full_name, email, created_at`,
    [full_name, email, password_hash, phone]
  );
  return result.rows[0];
};

export const getAllUsersModel = async() =>{
  const result = await db.query("SELECT * FROM users ORDER BY created_at DESC");
  return result.rows;
}

export const getUserBlockStatus = async (userId: string | number) => {
  return await db.query('SELECT is_blocked FROM users WHERE id = $1', [userId]);
};

export const blockedId = async (userId: string | number) => {
  return await db.query("UPDATE users SET is_blocked = TRUE WHERE id = $1 RETURNING *", [userId]);
};

export const unblockUserById = async (userId: string | number) => {
  return await db.query(
    'UPDATE users SET is_blocked = FALSE WHERE id = $1 RETURNING *',
    [userId]
  );
};

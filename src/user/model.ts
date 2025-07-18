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
     VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email`,
    [full_name, email, password_hash, phone, address]
  );
};

export const updateUserById = async (
  id: number,
  fields: { [key: string]: string }
) => {
  const updates = [];
  const values = [];
  let i = 1;

  for (const key in fields) {
    updates.push(`${key} = $${i}`);
    values.push(fields[key]);
    i++;
  }
  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${i}`;
  values.push(id);
  return db.query(query, values);
};

export const findUserById = async(id:string | number) =>{
  return db.query('SELECT * FROM users WHERE id = $1',[id])
}

export const updateUserPassword = async(id: string | number, hashedPassword: string) =>{
  return db.query('UPDATE users SET password_hash = $1 WHERE id = $2',[hashedPassword, id])
}



export const saveResetToken = async (email: string, token: string, expiry: Date) => {
  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
    [token, expiry, email]
  );
};

export const findUserByToken = async (token: string) => {
  const result = await db.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
    [token]
  );
  return result.rows[0];
};

export const updatePasswordByToken = async (token: string, hashedPassword: string) => {
  await db.query(
    `UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
     WHERE reset_token = $2`,
    [hashedPassword, token]
  );
}

export const updateUserPasswordById = async (userId: string, hashedPassword: string) => {
  await db.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [hashedPassword, userId]
  );
};

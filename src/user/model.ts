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

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch(err => console.error("❌ DB connection error", err));

export default pool;

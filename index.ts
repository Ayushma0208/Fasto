import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
// Update the import path if your routes file is in a different location, e.g. './routes/index'
import router from "./src/routes";
import "./src/config/db"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Create DB pool (connects to your Neon Postgres)
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Use your API router
app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

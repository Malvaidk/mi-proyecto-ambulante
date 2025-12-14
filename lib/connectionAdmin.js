// lib/conectionAdmin.js
import mysql from "mysql2/promise";

const poolAdmin = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER_ADMIN || "adminDoc",
  password: process.env.DB_PASS_ADMIN || "admin100%real#$23",
  database: process.env.DB_NAME || "ambulante",
  waitForConnections: true,
  connectionLimit: 5, // Menos conexiones para admin
  queueLimit: 0,
});

export async function getConnection() {
  return poolAdmin;
}
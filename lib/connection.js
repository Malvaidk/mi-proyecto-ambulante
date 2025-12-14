// lib/conection.js
import mysql from "mysql2/promise";

// Usamos un pool global para evitar crear demasiadas conexiones en desarrollo
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER_READER || "reader",
  password: process.env.DB_PASS_READER || "reader#$23",
  database: process.env.DB_NAME || "ambulante",
  waitForConnections: true,
  connectionLimit: 10, // Mantiene hasta 10 conexiones vivas
  queueLimit: 0,
});

export async function getConnection() {
  // Con pool, no necesitas verificar si existe "connection".
  // El pool maneja las conexiones por ti.
  return pool;
}
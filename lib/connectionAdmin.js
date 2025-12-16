import mysql from "mysql2/promise";

const isProduction = process.env.DB_HOST ? true : false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  
  // Credenciales de Admin dinámicas
  user: process.env.DB_USER_ADMIN || "adminDoc",
  password: process.env.DB_PASSWORD_ADMIN || "admin100",
  
  database: process.env.DB_NAME || "ambulante",
  port: process.env.DB_PORT || 3306,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // SSL solo en producción
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

export async function getConnection() {
  return pool;
}
import mysql from "mysql2/promise";

// Configuración del Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "reader", 
  password: process.env.DB_PASSWORD || "ambulante123", 
  database: process.env.DB_NAME || "ambulante",
  port: process.env.DB_PORT || 3306, // Importante: TiDB usa 4000, MySQL usa 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
console.log("conectado");
export async function getConnection() {
  return pool;
}
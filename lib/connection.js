import mysql from "mysql2/promise";

// Configuración del Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "adminDoc", // Usamos nombres estándar (DB_USER)
  password: process.env.DB_PASSWORD || "admin100", // Usamos nombres estándar (DB_PASSWORD)
  database: process.env.DB_NAME || "ambulante",
  port: process.env.DB_PORT || 3306, // Importante: TiDB usa 4000, MySQL usa 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ESTO ES VITAL PARA VERCEL / NUBE:
  // Si la variable DB_SSL es 'true', activa el modo seguro. Si es local, lo deja apagado.
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export async function getConnection() {
  return pool;
}
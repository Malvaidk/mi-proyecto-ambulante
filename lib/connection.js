import mysql from "mysql2/promise";

console.log("🔌 INTENTANDO CONECTAR A:");
console.log("   -> Host:", process.env.DB_HOST || "127.0.0.1 (Local por defecto)");
console.log("   -> User:", process.env.DB_USER_READER || "reader (Local por defecto)");
console.log("   -> Port:", process.env.DB_PORT || 3306);

// Detectamos si estamos en producción revisando si existe la variable DB_HOST
const isProduction = process.env.DB_HOST ? true : false;

const pool = mysql.createPool({
  // Si hay variable de entorno, úsala. Si no, usa localhost.
  host: process.env.DB_HOST || "127.0.0.1",
  
  // Usuario y contraseña dinámicos
  user: process.env.DB_USER_READER || "reader",
  password: process.env.DB_PASSWORD_READER || "ambulante123",
  
  database: process.env.DB_NAME || "ambulante",
  port: process.env.DB_PORT || 3306,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // LOGICA SSL: Solo activamos SSL si estamos en la nube (isProduction)
  // Railway y Vercel necesitan esto. Localhost falla si lo activas.
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

export async function getConnection() {
  return pool;
}
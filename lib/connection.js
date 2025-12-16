import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "reader",           // Usuario de solo lectura
  password: "ambulante123", // Contraseña exacta de tu script SQL
  database: "ambulante",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getConnection() {
  return pool;
}
import mysql from "mysql2/promise";

let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "ambulantedummy",
    });
    console.log("Conectado a MySQL");
  }

  return connection;
}

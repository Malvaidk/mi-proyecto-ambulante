import mysql from "mysql2/promise";

let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "adminDoc",
      password: "admin100%real#$23",
      database: "ambulante",
    });
    console.log("Conectado a MySQL");
  }

  return connection;
}

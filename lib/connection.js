import mysql from "mysql2/promise";
//sads
let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "reader",
      password: "reader#$23",
      database: "ambulante",
    });
    console.log("Conectado a MySQL");
  }

  return connection;
}

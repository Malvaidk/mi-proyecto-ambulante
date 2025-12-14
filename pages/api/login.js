import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;

   
    const conn = await mysql.createConnection({
      host: "localhost",
      user: email,
      password: password
    });

    
    await conn.end();

    
    res.status(200).json({
      email,
            role:"admin_documentales"
    });

  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      message: "Credenciales inválidas"
    });
  }
}

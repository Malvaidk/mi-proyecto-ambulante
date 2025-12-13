import bcrypt from "bcrypt";
import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;
    const conn = await getConnection();

    const [rows] = await conn.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el login" });
  }
}

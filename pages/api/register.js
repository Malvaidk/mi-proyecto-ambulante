import bcrypt from "bcrypt";
import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { email, password, role } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

  
    const finalRole = role || "viewer";

    
    const validRoles = ["admin_documentales", "admin_usuarios", "viewer"];
    if (!validRoles.includes(finalRole)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const conn = await getConnection();


    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar
    await conn.execute(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, finalRole]
    );

    res.status(200).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    res.status(500).json({ error: "Error interno en el registro" });
  }
}

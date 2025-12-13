import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID requerido" });
    }

    const conn = await getConnection();

    // 1️⃣ borrar fechas
    await conn.execute(
      "DELETE FROM dateDocumental WHERE idDocumental = ?",
      [id]
    );

    // 2️⃣ borrar documental
    const [result] = await conn.execute(
      "DELETE FROM documental WHERE idDoc = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Documental no encontrado" });
    }

    res.status(200).json({
      message: "Documental eliminado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar documental" });
  }
}

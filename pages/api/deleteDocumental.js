import { getConnection } from "../../lib/connectionAdmin";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método no permitido. Usa DELETE." });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Falta el ID del documental" });
  }

  try {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      "DELETE FROM peliculas WHERE idPelicula = ?",
      [id]
    );

    // 3. Verificar si algo se borró realmente
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró esa película o ya fue eliminada." });
    }

    return res.status(200).json({ message: "Documental eliminado correctamente." });

  } catch (error) {
    console.error("❌ Error eliminando documental:", error);
    return res.status(500).json({ 
      message: "Error interno del servidor al eliminar.", 
      error: error.message 
    });
  }
}
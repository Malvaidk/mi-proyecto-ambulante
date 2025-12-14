import { getConnection } from "@/lib/connectionAdmin";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID requerido" });
  }

  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    /* 1️⃣ Eliminar relaciones */
    await conn.query(`DELETE FROM relPeliIdm WHERE idPelicula=?`, [id]);
    await conn.query(`DELETE FROM relPeliTem WHERE idPelicula=?`, [id]);
    await conn.query(`DELETE FROM relPeliPrem WHERE idPelicula=?`, [id]);

    /* 2️⃣ Eliminar película */
    const [result] = await conn.query(
      `DELETE FROM peliculas WHERE idPelicula=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Documental no encontrado" });
    }

    await conn.commit();

    res.status(200).json({ message: "Documental eliminado correctamente" });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar documental",
      error: error.message
    });
  }
}

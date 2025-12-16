import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Falta ID" });

  try {
    const conn = await getConnection();

    // 1. Película + Nombre Director
    const [rows] = await conn.execute(`
      SELECT p.*, part.nombre as nombre_director
      FROM peliculas p
      LEFT JOIN participantes part ON p.director = part.curp
      WHERE p.idPelicula = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ message: "No encontrado" });
    
    const doc = rows[0];

    //Traer listas de IDs relacionados
    const [idiomas] = await conn.execute("SELECT idIdioma FROM relpeliidm WHERE idPelicula = ?", [id]);
    const [tematicas] = await conn.execute("SELECT idTematica FROM relpelitem WHERE idPelicula = ?", [id]);
    const [premios] = await conn.execute("SELECT idFesPrem FROM relpeliprem WHERE idPelicula = ?", [id]);

    //Respuesta combinada
    res.json({
      ...doc,
      // Usamos el nombre del director para el formulario, no la CURP
      director: doc.nombre_director || "",
      
      // Convertimos los resultados SQL a arrays simples de números [1, 5, 8]
      idiomasIds: idiomas.map(x => x.idIdioma),
      tematicasIds: tematicas.map(x => x.idTematica),
      premiosIds: premios.map(x => x.idFesPrem)
    });

  } catch (error) {
    console.error("❌ Error getById:", error);
    res.status(500).json({ message: error.message });
  }
}
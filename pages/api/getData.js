import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  // Objeto base por si falla algo, que no rompa la página
  const result = {
    idiomas: [],
    tematicas: [],
    premios: [],
    ediciones: [],
    directores: []
  };

  try {
    const conn = await getConnection();

    // 1. IDIOMAS
    try {
      const [rows] = await conn.execute("SELECT * FROM idiomas ORDER BY idioma ASC");
      result.idiomas = rows;
    } catch (e) { console.error("⚠️ Error Idiomas:", e.message); }

    // 2. TEMÁTICAS
    try {
      const [rows] = await conn.execute("SELECT * FROM tematicas ORDER BY tematica ASC");
      result.tematicas = rows;
    } catch (e) { console.error("⚠️ Error Temáticas:", e.message); }

    // 3. PREMIOS 
    try {
      const [rows] = await conn.execute("SELECT * FROM fespremios ORDER BY nombre ASC");
      result.premios = rows;
    } catch (e) { console.error("⚠️ Error Premios:", e.message); }

    // 4. EDICIONES
    try {
      const [rows] = await conn.execute("SELECT * FROM ediciones ORDER BY fechaInicio DESC");
      result.ediciones = rows;
    } catch (e) { console.error("⚠️ Error Ediciones:", e.message); }

    // 5. DIRECTORES
    try {
      const [rows] = await conn.execute(`
        SELECT p.nombre AS director, d.curp
        FROM directores d
        JOIN participantes p ON p.curp = d.curp
        ORDER BY p.nombre ASC
      `);
      result.directores = rows;
    } catch (e) { console.error("⚠️ Error Directores:", e.message); }

    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Error General getData:", error);
    res.status(500).json({ message: "Error de conexión" });
  }
}
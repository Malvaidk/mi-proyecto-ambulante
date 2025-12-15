import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    
    // 1. Intentamos conectar
    const conn = await getConnection();
    
    // 2. Preparamos la consulta
    let query = `SELECT * from vw_fichatecnica`;
    let params = [];

    if (year) {
      query += " WHERE gira = ?";
      params.push(year);
    }

    // 3. Ejecutamos (Aquí suele fallar si la vista no existe)
    console.log("📡 Ejecutando Query:", query, "Con params:", params); 
    const [rows] = await conn.execute(query, params);
    
    // 4. Años disponibles
    const [years] = await conn.execute(`
      SELECT DISTINCT YEAR(fechaInicio) AS year
      FROM ediciones
      ORDER BY year DESC
    `);

    res.status(200).json({
      movies: rows,
      availableYears: years.map(y => y.year)
    });

  } catch (error) {
    // ESTO SALDRÁ EN TU TERMINAL:
    console.error("❌ ERROR CRÍTICO EN API GETDOCUMENTALS:");
    console.error("➡️ Mensaje:", error.message);
    if(error.code) console.error("➡️ Código SQL:", error.code);
    
    res.status(500).json({ error: error.message });
  }
}
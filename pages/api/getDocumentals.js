import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    const conn = await getConnection();

    let query = `SELECT * from vw_fichatecnica`;
    let params = [];

    if (year) {
      // CAMBIO: Usamos '=' en lugar de 'LIKE' porque el año es un número exacto
      query += " WHERE gira = ?";
      params.push(year);
    }

    console.log(`📡 Consultando DB para año: ${year || 'Todos'}`); // Log para debug

    const [rows] = await conn.execute(query, params);
    
    console.log(`✅ Se encontraron ${rows.length} películas`); // Verás esto en tu terminal

    const [years] = await conn.execute(`
      SELECT DISTINCT YEAR(fechaInicio) AS year, idEdicion as Edición
      FROM ediciones
      ORDER BY year DESC
    `);

    res.status(200).json({
      movies: rows,
      availableYears: years.map(y => y.year)
    });

  } catch (error) {
    console.error("❌ Error en API:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
}
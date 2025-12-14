import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    const conn = await getConnection();

 
    let query = `
      SELECT * from vw_FichaTecnica
    `;

    let params = [];

    if (year) {
      query += " WHERE gira LIKE ?";
      params.push(`${year}%`);
    }

    const [rows] = await conn.execute(query, params);

  
    const [years] = await conn.execute(`
      SELECT DISTINCT YEAR(fechaInicio) AS year, idEdicion as Edición
      FROM ediciones
      ORDER BY year 
    `);

    
    res.status(200).json({
      movies: rows,
      availableYears: years.map(y => y.year)
      
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta" });
  }
}

import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    const conn = await getConnection();

 
    let query = `
      SELECT * from DocumentalDirector
    `;

    let params = [];

    if (year) {
      query += " WHERE presentationDate LIKE ?";
      params.push(`${year}%`);
    }

    const [rows] = await conn.execute(query, params);

  
    const [years] = await conn.execute(`
      SELECT DISTINCT YEAR(dd_presentationDate) AS year
      FROM dateDocumental
      WHERE dd_presentationDate IS NOT NULL
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

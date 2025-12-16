import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    
    const conn = await getConnection();
    

    let query = `
      SELECT 
        p.idPelicula,
        p.titulo,
        p.duracion, 
        p.anioPub,
        p.imagen,
        part.nombre AS director,
        e.numEdicion,
        YEAR(e.fechaInicio) AS gira
      FROM peliculas p
      JOIN participantes part ON p.director = part.curp
      JOIN ediciones e ON p.idEdicion = e.idEdicion
    `;
    
    let params = [];

    if (year) {
      query += " WHERE YEAR(e.fechaInicio) = ?";
      params.push(year);
    }

    //Ordenar por año de publicación
    query += " ORDER BY p.anioPub DESC";

    //Ejecutar consulta principal
    const [rows] = await conn.execute(query, params);
    
    //Obtener lista de años para el filtro del Dashboard
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
    console.error("❌ ERROR EN GETDOCUMENTALS:", error.message);
    res.status(500).json({ 
      message: "Error obteniendo datos", 
      error: error.message,
      movies: [], 
      availableYears: [] 
    });
  }
}
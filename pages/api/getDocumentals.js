import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    
    // 1. Conexión (Modo lectura)
    const conn = await getConnection();
    
    // 2. Consulta Directa (Reemplazando la vista para evitar errores de permisos y datos faltantes)
    // Agregamos 'p.duracion' que faltaba en la vista
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

    // 3. Filtro Dinámico por Año
    if (year) {
      query += " WHERE YEAR(e.fechaInicio) = ?";
      params.push(year);
    }

    // Ordenamos por año de publicación
    query += " ORDER BY p.anioPub DESC";

    // 4. Ejecutar consulta principal
    const [rows] = await conn.execute(query, params);
    
    // 5. Obtener lista de años para el filtro del Dashboard
    const [years] = await conn.execute(`
      SELECT DISTINCT YEAR(fechaInicio) AS year
      FROM ediciones
      ORDER BY year DESC
    `);

    // 6. Enviar Respuesta
    res.status(200).json({
      movies: rows,
      availableYears: years.map(y => y.year)
    });

  } catch (error) {
    console.error("❌ ERROR EN GETDOCUMENTALS:", error.message);
    // Respondemos JSON incluso en error para que el frontend no rompa con "SyntaxError"
    res.status(500).json({ 
      message: "Error obteniendo datos", 
      error: error.message,
      movies: [], 
      availableYears: [] 
    });
  }
}
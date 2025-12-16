import { getConnection } from "../../lib/connectionAdmin"; 

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Falta el ID del documental" });
  }

  try {
    const pool = await getConnection();

    const query = `
      SELECT 
        p.*,
        part.nombre as nombre_director,
        
        -- 1. Idiomas
        GROUP_CONCAT(DISTINCT i.idioma SEPARATOR ', ') AS idiomas,

        -- 2. Temáticas
        GROUP_CONCAT(DISTINCT t.tematica SEPARATOR ', ') AS tematicas,

        -- 3. Premios
        GROUP_CONCAT(DISTINCT f.nombre SEPARATOR ', ') AS premios_ganados,

        -- 4. CRÉDITOS (Nuevo)
        -- Creamos un string tipo: "Fotografía:::Juan Pérez|||Edición:::María López"
        GROUP_CONCAT(DISTINCT CONCAT(rpp.rol, ':::', pc.nombre) SEPARATOR '|||') AS lista_creditos

      FROM peliculas p
      
      -- Director Principal
      LEFT JOIN participantes part ON p.director = part.curp
      
      -- Idiomas
      LEFT JOIN relpeliidm ri ON p.idPelicula = ri.idPelicula
      LEFT JOIN idiomas i ON ri.idIdioma = i.idIdioma  
      
      -- Temáticas
      LEFT JOIN relpelitem rt ON p.idPelicula = rt.idPelicula
      LEFT JOIN tematicas t ON rt.idTematica = t.idTematica
      
      -- Premios
      LEFT JOIN relpeliprem rp ON p.idPelicula = rp.idPelicula
      LEFT JOIN fespremios f ON rp.idFesPrem = f.idFesPrem

      -- CRÉDITOS (Participantes extra)
      LEFT JOIN relpeliper rpp ON p.idPelicula = rpp.idPelicula
      LEFT JOIN participantes pc ON rpp.curp = pc.curp

      WHERE p.idPelicula = ?
      GROUP BY p.idPelicula
    `;

    const [rows] = await pool.query(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Documental no encontrado" });
    }
    
    const doc = rows[0];

    res.status(200).json({
      ...doc,
      director: doc.nombre_director || "Desconocido",
      idiomas: doc.idiomas || "No especificado",
      tematicas: doc.tematicas || "General",
      premios_ganados: doc.premios_ganados || null,
      lista_creditos: doc.lista_creditos || "", 
      url_descarga: doc.descarga,
      url_trailer: doc.descarga 
    });

  } catch (error) {
    console.error("❌ Error en getDocumentalById:", error);
    res.status(500).json({ message: "Error interno: " + error.message });
  }
}
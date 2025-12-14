import { getConnection } from "../../lib/connectionAdmin"; // Ajusta la ruta si usas @/lib o ../../lib

export default async function handler(req, res) {
  try {
    const conn = await getConnection();

    // 1. DIRECTORES: Usamos JOIN para traer SOLO a quienes existen en la tabla 'directores'
    const [directors] = await conn.execute(`
      SELECT p.nombre AS director
      FROM participantes p
      INNER JOIN directores d ON p.curp = d.curp
      ORDER BY p.nombre
    `);

    // 2. EDICIONES: Agregamos el año (YEAR) para que en el select se vea "Edición 19 (2024)"
    const [editions] = await conn.execute(`
      SELECT idEdicion AS edicion, numEdicion, YEAR(fechaInicio) as anio
      FROM ediciones 
      ORDER BY numEdicion DESC
    `);

    // 3. PREMIOS
    const [prizes] = await conn.execute(`
      SELECT nombre AS premio, idFesPrem AS idPremio
      FROM fespremios
      ORDER BY premio
    `);

    // 4. IDIOMAS
    const [languages] = await conn.execute(`
      SELECT idIdioma, idioma
      FROM idiomas
      ORDER BY idioma
    `);

    // 5. TEMÁTICAS
    const [topics] = await conn.execute(`
      SELECT idTematica, tematica
      FROM tematicas
      ORDER BY tematica
    `);
    
    res.status(200).json({
      directors,  // Devuelve [{ director: "Nombre" }, ...]
      editions,   // Devuelve [{ edicion: 123, numEdicion: 19, anio: 2024 }, ...]
      prizes,
      languages,
      topics
    });

  } catch (error) {
    console.error("Error en getData:", error);
    res.status(500).json({ error: "Error al obtener datos auxiliares" });
  }
}
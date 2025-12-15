import { getConnection } from "../../lib/connection"; // Verifica que esta ruta sea correcta

// Función auxiliar para calcular diferencias
function diff(actual = [], nuevo = []) {
  if (!Array.isArray(actual)) actual = [];
  if (!Array.isArray(nuevo)) nuevo = [];

  const actualNums = actual.map(Number);
  const nuevoNums = nuevo.map(Number);

  return {
    agregar: nuevoNums.filter(id => !actualNums.includes(id)),
    eliminar: actualNums.filter(id => !nuevoNums.includes(id))
  };
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let conn; // Declaramos la conexión aquí para poder usarla en el finally

  try {
    const pool = await getConnection();
    
    // PASO CRÍTICO: Pedimos una conexión dedicada del pool para la transacción
    conn = await pool.getConnection();

    const { id } = req.query;
    const {
      titulo, duracion, anioPub, sinopsis, imagen, iniciativa,
      descarga, idEdicion, director,
      idiomasIds = [], tematicasIds = [], premiosIds = []
    } = req.body;

    console.log("📝 Iniciando actualización para ID:", id);

    // Iniciamos la transacción en la conexión dedicada
    await conn.beginTransaction();

    /* ---------------------------------------------------------
       1. BUSCAR CURP DEL DIRECTOR
       --------------------------------------------------------- */
    const [rowsDirector] = await conn.execute(
      `SELECT d.curp 
       FROM directores d
       JOIN participantes p ON p.curp = d.curp
       WHERE p.nombre = ?`,
      [director]
    );

    if (rowsDirector.length === 0) {
      await conn.rollback(); // Cancelamos si no existe
      conn.release(); // Liberamos la conexión
      return res.status(400).json({ 
        message: `No se encontró un director con el nombre: "${director}". Revisa la ortografía.` 
      });
    }

    const curpDirector = rowsDirector[0].curp;

    /* ---------------------------------------------------------
       2. ACTUALIZAR PELÍCULA
       --------------------------------------------------------- */
    await conn.execute(
      `UPDATE peliculas
       SET titulo=?, duracion=?, anioPub=?, sinopsis=?, imagen=?, iniciativa=?,
           descarga=?, idEdicion=?, director=?
       WHERE idPelicula=?`,
      [
        titulo, duracion, anioPub, sinopsis, imagen || null, iniciativa || null,
        descarga || null, idEdicion, curpDirector, id
      ]
    );

    /* ---------------------------------------------------------
       3. ACTUALIZAR RELACIONES (Idiomas, Temáticas, Premios)
       --------------------------------------------------------- */
    
    // --- IDIOMAS ---
    const [rowsIdiomas] = await conn.execute(`SELECT idIdioma FROM relpeliidm WHERE idPelicula=?`, [id]);
    const dIdiomas = diff(rowsIdiomas.map(r => r.idIdioma), idiomasIds);

    for (const i of dIdiomas.eliminar) await conn.execute(`DELETE FROM relpeliidm WHERE idPelicula=? AND idIdioma=?`, [id, i]);
    for (const i of dIdiomas.agregar) await conn.execute(`INSERT INTO relpeliidm (idPelicula, idIdioma) VALUES (?,?)`, [id, i]);

    // --- TEMÁTICAS ---
    const [rowsTematicas] = await conn.execute(`SELECT idTematica FROM relpelitem WHERE idPelicula=?`, [id]);
    const dTem = diff(rowsTematicas.map(r => r.idTematica), tematicasIds);

    for (const t of dTem.eliminar) await conn.execute(`DELETE FROM relpelitem WHERE idPelicula=? AND idTematica=?`, [id, t]);
    for (const t of dTem.agregar) await conn.execute(`INSERT INTO relpelitem (idPelicula, idTematica) VALUES (?,?)`, [id, t]);

    // --- PREMIOS ---
    const [rowsPremios] = await conn.execute(`SELECT idFesPrem FROM relpeliprem WHERE idPelicula=?`, [id]);
    const dPrem = diff(rowsPremios.map(r => r.idFesPrem), premiosIds);

    for (const p of dPrem.eliminar) await conn.execute(`DELETE FROM relpeliprem WHERE idPelicula=? AND idFesPrem=?`, [id, p]);
    for (const p of dPrem.agregar) await conn.execute(`INSERT INTO relpeliprem (idPelicula, idFesPrem) VALUES (?,?)`, [id, p]);

    // CONFIRMAR CAMBIOS
    await conn.commit();
    res.status(200).json({ message: "Documental actualizado correctamente" });

  } catch (error) {
    console.error("❌ Error CRÍTICO en update.js:", error);
    if (conn) await conn.rollback(); // Deshacer cambios si hubo error
    
    res.status(500).json({ 
      message: "Error interno del servidor: " + error.message 
    });
  } finally {
    // IMPORTANTE: Siempre liberar la conexión al pool
    if (conn) conn.release();
  }
}
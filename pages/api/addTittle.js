import { getConnection } from "../../lib/connectionAdmin";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const conn = await getConnection();

    const {
      titulo, duracion, anioPub, sinopsis, imagen, iniciativa, descarga,
      numEdicion,     // Ahora recibimos el NÚMERO (ej: 19), no el ID
      directorNombre, // Recibimos el NOMBRE (ej: "Juan Pérez")
      idiomas,        // String separado por comas: "Español, Inglés"
      tematicas,      // String separado por comas
      premios         // String separado por comas
    } = req.body;

    // --- 1. Validaciones ---
    if (!titulo || !directorNombre || !numEdicion) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const [directorRows] = await conn.query(
      `SELECT p.curp FROM participantes p 
       JOIN directores d ON p.curp = d.curp 
       WHERE p.nombre LIKE ? LIMIT 1`,
      [`%${directorNombre}%`] // Búsqueda flexible
    );

    if (directorRows.length === 0) {
      return res.status(400).json({ message: `El director "${directorNombre}" no está registrado. Regístralo primero en la sección de Directores.` });
    }
    const curpDirector = directorRows[0].curp;

    // --- 3. Buscar ID de la Edición por Número ---
    const [edicionRows] = await conn.query(
      "SELECT idEdicion FROM ediciones WHERE numEdicion = ? LIMIT 1",
      [numEdicion]
    );

    if (edicionRows.length === 0) {
      return res.status(400).json({ message: `La edición número ${numEdicion} no existe.` });
    }
    const idEdicionFound = edicionRows[0].idEdicion;

    // --- 4. Generar ID para la Película ---
    const [[{ nextId }]] = await conn.query("SELECT IFNULL(MAX(idPelicula), 0) + 1 AS nextId FROM peliculas");
    const idPelicula = nextId;

    // --- 5. Insertar Película ---
    await conn.query(
      `INSERT INTO peliculas 
      (idPelicula, titulo, duracion, anioPub, sinopsis, imagen, iniciativa, descarga, idEdicion, director)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idPelicula, titulo, duracion, anioPub, sinopsis, imagen || null, iniciativa || null, descarga || null, idEdicionFound, curpDirector]
    );

    // --- FUNCION HELPER PARA ETIQUETAS (Busca o Crea) ---
    async function procesarEtiquetas(texto, tabla, columnaNombre, columnaId, tablaRelacion, colRelId) {
      if (!texto) return;
      const items = texto.split(',').map(s => s.trim()).filter(s => s.length > 0);

      for (const item of items) {
        // A. Buscar si existe
        let [rows] = await conn.query(`SELECT ${columnaId} FROM ${tabla} WHERE ${columnaNombre} = ?`, [item]);
        let idItem;

        if (rows.length > 0) {
          idItem = rows[0][columnaId];
        } else {
          // B. Si no existe, CREARLO
          // Generamos un ID simple basado en timestamp o max+1
           const [[{ maxId }]] = await conn.query(`SELECT IFNULL(MAX(${columnaId}), 0) + 1 AS maxId FROM ${tabla}`);
           idItem = maxId;
           
           await conn.query(`INSERT INTO ${tabla} (${columnaId}, ${columnaNombre}) VALUES (?, ?)`, [idItem, item]);
        }

        // C. Crear la relación
        await conn.query(`INSERT INTO ${tablaRelacion} (${columnaId}, ${colRelId}) VALUES (?, ?)`, [idItem, idPelicula]);
      }
    }

    // --- 6. Procesar Listas Manuales ---
    await procesarEtiquetas(idiomas, 'idiomas', 'idioma', 'idIdioma', 'relpeliidm', 'idPelicula');
    await procesarEtiquetas(tematicas, 'tematicas', 'tematica', 'idTematica', 'relpelitem', 'idPelicula');
    
    // Premios es especial porque la columna ID se llama idFesPrem y la relación es relpeliprem
    await procesarEtiquetas(premios, 'fespremios', 'nombre', 'idFesPrem', 'relpeliprem', 'idPelicula');


    return res.status(200).json({
      message: "Película agregada correctamente",
      id: idPelicula
    });

  } catch (error) {
    console.error("Error en addTittle:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
}
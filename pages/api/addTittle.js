import { getConnection } from "../../lib/connectionAdmin";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let conn;

  try {
    const pool = await getConnection();
    conn = await pool.getConnection();

    const {
      titulo, duracion, anioPub, sinopsis, imagen, iniciativa, descarga,
      numEdicion,     
      directorNombre, 
      idiomas,        
      tematicas,      
      premios         
    } = req.body;

    // --- 1. Validaciones Básicas ---
    if (!titulo || !directorNombre || !numEdicion) {
      return res.status(400).json({ message: "Faltan datos obligatorios (Título, Director o Edición)." });
    }

    await conn.beginTransaction();

    // --- 2. Lógica del DIRECTOR ---
    let curpDirector;
    
    // Buscamos si ya existe alguien con ese nombre
    const [directorRows] = await conn.execute(
      `SELECT d.curp FROM participantes p 
       JOIN directores d ON p.curp = d.curp 
       WHERE p.nombre = ? LIMIT 1`,
      [directorNombre.trim()]
    );

    if (directorRows.length > 0) {
      curpDirector = directorRows[0].curp;
    } else {
      // Si NO existe, creamos una CURP genérica
      // Generamos un string único de 18 caracteres máx
      const randomSuffix = Math.floor(Math.random() * 9999);
      curpDirector = `GEN${Date.now().toString().slice(-10)}${randomSuffix}`.slice(0, 18);
      
      console.log(`Creando director: ${directorNombre} -> ${curpDirector}`);

      await conn.execute(
        `INSERT INTO participantes (curp, nombre) VALUES (?, ?)`,
        [curpDirector, directorNombre.trim()]
      );

      // Insertamos en la tabla de directores
      await conn.execute(
        `INSERT INTO directores (curp) VALUES (?)`,
        [curpDirector]
      );
    }

    // --- 3. Buscar ID de la Edición ---
    const [edicionRows] = await conn.execute(
      "SELECT idEdicion FROM ediciones WHERE numEdicion = ? LIMIT 1",
      [numEdicion]
    );

    if (edicionRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: `La edición número ${numEdicion} no existe.` });
    }
    const idEdicionFound = edicionRows[0].idEdicion;

    // --- 4. Generar ID para la Película ---
    const [[{ nextId }]] = await conn.execute("SELECT IFNULL(MAX(idPelicula), 0) + 1 AS nextId FROM peliculas");
    const idPelicula = nextId;

    // --- 5. Insertar Película ---
    await conn.execute(
      `INSERT INTO peliculas 
      (idPelicula, titulo, duracion, anioPub, sinopsis, imagen, iniciativa, descarga, idEdicion, director)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPelicula, 
        titulo, 
        duracion || 0, 
        anioPub || null, 
        sinopsis || "", 
        imagen || null, 
        iniciativa || null, 
        descarga || null, 
        idEdicionFound, 
        curpDirector
      ]
    );

    // --- FUNCION HELPER PARA ETIQUETAS ---
    async function procesarEtiquetas(texto, tabla, columnaNombre, columnaId, tablaRelacion, colRelId) {
      if (!texto) return;
      const items = texto.split(',').map(s => s.trim()).filter(s => s.length > 0);

      for (const item of items) {
        // A. Buscar ID si existe
        let [rows] = await conn.execute(`SELECT ${columnaId} FROM ${tabla} WHERE ${columnaNombre} = ?`, [item]);
        let idItem;

        if (rows.length > 0) {
          idItem = rows[0][columnaId];
        } else {
          // B. Si no existe, crear
           const [[{ maxId }]] = await conn.execute(`SELECT IFNULL(MAX(${columnaId}), 0) + 1 AS maxId FROM ${tabla}`);
           idItem = maxId;
           
           await conn.execute(`INSERT INTO ${tabla} (${columnaId}, ${columnaNombre}) VALUES (?, ?)`, [idItem, item]);
        }
        
        // Ajustamos el orden dinámicamente:
        if (tablaRelacion === 'relpeliidm') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idIdioma, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        } else if (tablaRelacion === 'relpelitem') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idTematica, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        } else if (tablaRelacion === 'relpeliprem') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idFesPrem, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        }
      }
    }

    // --- 6. Procesar Listas Manuales ---
    if (idiomas) await procesarEtiquetas(idiomas, 'idiomas', 'idioma', 'idIdioma', 'relpeliidm', 'idIdioma');
    if (tematicas) await procesarEtiquetas(tematicas, 'tematicas', 'tematica', 'idTematica', 'relpelitem', 'idTematica'); 
    if (premios) await procesarEtiquetas(premios, 'fespremios', 'nombre', 'idFesPrem', 'relpeliprem', 'idFesPrem');

    await conn.commit();

    return res.status(200).json({
      message: "Película agregada correctamente",
      id: idPelicula,
      director: directorNombre
    });

  } catch (error) {
    console.error("❌ Error en addTittle:", error);
    if (conn) await conn.rollback();
    
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
}
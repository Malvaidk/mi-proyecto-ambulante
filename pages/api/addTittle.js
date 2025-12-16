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

    if (!titulo || !directorNombre || !numEdicion) {
      return res.status(400).json({ message: "Faltan datos obligatorios (Título, Director o Edición)." });
    }

    await conn.beginTransaction();

    let curpDirector;
    
    const [directorRows] = await conn.execute(
      `SELECT d.curp FROM participantes p 
       JOIN directores d ON p.curp = d.curp 
       WHERE p.nombre = ? LIMIT 1`,
      [directorNombre.trim()]
    );

    if (directorRows.length > 0) {
      curpDirector = directorRows[0].curp;
    } else {
      const randomSuffix = Math.floor(Math.random() * 9999);
      curpDirector = `GEN${Date.now().toString().slice(-10)}${randomSuffix}`.slice(0, 18);
      
      console.log(`Creando director: ${directorNombre} -> ${curpDirector}`);

      await conn.execute(
        `INSERT INTO participantes (curp, nombre) VALUES (?, ?)`,
        [curpDirector, directorNombre.trim()]
      );

      await conn.execute(
        `INSERT INTO directores (curp) VALUES (?)`,
        [curpDirector]
      );
    }

    const [edicionRows] = await conn.execute(
      "SELECT idEdicion FROM ediciones WHERE numEdicion = ? LIMIT 1",
      [numEdicion]
    );

    if (edicionRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: `La edición número ${numEdicion} no existe.` });
    }
    const idEdicionFound = edicionRows[0].idEdicion;

    const [[{ nextId }]] = await conn.execute("SELECT IFNULL(MAX(idPelicula), 0) + 1 AS nextId FROM peliculas");
    const idPelicula = nextId;

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

    async function procesarEtiquetas(texto, tabla, columnaNombre, columnaId, tablaRelacion, colRelId) {
      if (!texto) return;
      const items = texto.split(',').map(s => s.trim()).filter(s => s.length > 0);

      for (const item of items) {
        let [rows] = await conn.execute(`SELECT ${columnaId} FROM ${tabla} WHERE ${columnaNombre} = ?`, [item]);
        let idItem;

        if (rows.length > 0) {
          idItem = rows[0][columnaId];
        } else {
           const [[{ maxId }]] = await conn.execute(`SELECT IFNULL(MAX(${columnaId}), 0) + 1 AS maxId FROM ${tabla}`);
           idItem = maxId;
           
           await conn.execute(`INSERT INTO ${tabla} (${columnaId}, ${columnaNombre}) VALUES (?, ?)`, [idItem, item]);
        }
        
        if (tablaRelacion === 'relpeliidm') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idIdioma, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        } else if (tablaRelacion === 'relpelitem') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idTematica, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        } else if (tablaRelacion === 'relpeliprem') {
             await conn.execute(`INSERT INTO ${tablaRelacion} (idFesPrem, idPelicula) VALUES (?, ?)`, [idItem, idPelicula]);
        }
      }
    }

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
import { getConnection } from "@/lib/connectionAdmin";

export default async function handler(req, res) {
  try {
    const conn = await getConnection();

    const {
      titulo,
      duracion,
      anioPub,
      sinopsis,
      imagen,
      iniciativa,
      descarga,
      idEdicion,
      director,   
      idiomas = [],
      tematicas = [],
      premios = []
    } = req.body;

 
    if (
      !titulo ||
      !duracion ||
      !anioPub ||
      !sinopsis ||
      !director ||
      !idEdicion
    ) {
      return res.status(400).json({
        message: "Datos obligatorios incompletos"
      });
    }

   
    const [[dir]] = await conn.query(
      `
      SELECT d.curp
      FROM directores d
      JOIN participantes p ON p.curp = d.curp
      WHERE p.nombre = ?
      `,
      [director]
    );

    if (!dir) {
      return res.status(400).json({
        message: "El director no existe en el sistema"
      });
    }

    const curpDirector = dir.curp;

    
    const [[{ nextId }]] = await conn.query(
      "SELECT IFNULL(MAX(idPelicula),0)+1 AS nextId FROM peliculas"
    );

    const idPelicula = nextId;
    console.log(nextId);

 
    await conn.query(
      "CALL sp_agregar_pelicula_completa(?,?,?,?,?,?,?,?,?,?)",
      [
        idPelicula,
        titulo,
        Number(duracion),
        Number(anioPub),
        sinopsis,
        imagen || null,
        iniciativa || null,
        descarga || null,
        Number(idEdicion),
        curpDirector   
      ]
    );

  
    for (const idIdioma of idiomas) {
      await conn.query(
        "CALL sp_agregar_idioma_pelicula(?,?)",
        [idPelicula, idIdioma]
      );
    }


    for (const idTematica of tematicas) {
      await conn.query(
        "CALL sp_agregar_tematica_pelicula(?,?)",
        [idPelicula, idTematica]
      );
    }


    for (const idPremio of premios) {
      await conn.query(
        "CALL sp_agregar_premio_pelicula(?,?)",
        [idPelicula, idPremio]
      );
    }

    return res.status(200).json({
      message: "Película agregada correctamente",
      idPelicula
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar la película",
      error: error.message
    });
  }
}

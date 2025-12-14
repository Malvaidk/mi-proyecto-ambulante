import { getConnection } from "@/lib/connectionAdmin";

export default async function handler(req, res) {
  try {
    const conn = await getConnection();
    const { pelicula, idiomas, tematicas, premios, participantes } = req.body;
    console.log(req.body);
    if (!pelicula) {
      return res.status(400).json({ message: "Datos de película incompletos" });
    }

    // 🧠 Generar ID
    const [[{ nextId }]] = await conn.query(
      "SELECT IFNULL(MAX(idPelicula),0)+1 AS nextId FROM peliculas"
    );

    const idPelicula = nextId;

    // 1️⃣ Película
    await conn.query(
      "CALL sp_agregar_pelicula_completa(?,?,?,?,?,?,?,?,?,?)",
      [
        idPelicula,
        pelicula.titulo,
        Number(pelicula.duracion),
        Number(pelicula.anioPub),
        pelicula.sinopsis,
        pelicula.imagen,
        pelicula.iniciativa,
        pelicula.descarga,
        Number(pelicula.idEdicion),
        pelicula.director
      ]
    );

    
    for (const idIdioma of idiomas || []) {
      await conn.query("CALL sp_agregar_idioma_pelicula(?,?)", [
        idPelicula,
        idIdioma
      ]);
    }

    
    for (const idTematica of tematicas || []) {
      await conn.query("CALL sp_agregar_tematica_pelicula(?,?)", [
        idPelicula,
        idTematica
      ]);
    }

  
    for (const idPremio of premios || []) {
      await conn.query("CALL sp_agregar_premio_pelicula(?,?)", [
        idPelicula,
        idPremio
      ]);
    }

  
    for (const p of participantes || []) {
      await conn.query("CALL sp_agregar_participante_pelicula(?,?,?)", [
        idPelicula,
        p.curp,
        p.rol
      ]);
    }

    res.status(200).json({
      message: "Película registrada correctamente",
      idPelicula
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar película", error });
  }
}

import { getConnection } from "@/lib/connectionAdmin";

function diff(actual = [], nuevo = []) {
  if (!Array.isArray(actual)) actual = [];
  if (!Array.isArray(nuevo)) nuevo = [];

  return {
    agregar: nuevo.filter(id => !actual.includes(id)),
    eliminar: actual.filter(id => !nuevo.includes(id))
  };
}

export default async function handler(req, res) {
  try {
    const { id } = req.query;
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
      idiomasIds = [],
      tematicasIds = [],
      premiosIds = []
    } = req.body;
console.log(req.body);
    await conn.beginTransaction();
    const [[dir]] = await conn.query(
      `
      SELECT d.curp
      FROM directores d
      JOIN participantes p ON p.curp = d.curp
      WHERE p.nombre = ?
      `,
      [director]
    );

    const curpDirector = dir.curp;

    /* 1️⃣ Actualizar película */
    await conn.query(
      `
      UPDATE peliculas
      SET titulo=?, duracion=?, anioPub=?, sinopsis=?, imagen=?, iniciativa=?,
          descarga=?, idEdicion=?, director=?
      WHERE idPelicula=?
      `,
      [
        titulo,
        duracion,
        anioPub,
        sinopsis,
        imagen || null,
        iniciativa || null,
        descarga || null,
        idEdicion,
        curpDirector,
        id
      ]
    );

    /* 2️⃣ IDIOMAS */
    const [[idiomasActuales]] = await conn.query(
      `SELECT GROUP_CONCAT(idIdioma) AS ids FROM relPeliIdm WHERE idPelicula=?`,
      [id]
    );

    const actualIdiomas = idiomasActuales?.ids
      ? idiomasActuales.ids.split(",").map(Number)
      : [];

    const dIdiomas = diff(actualIdiomas, idiomasIds);

    for (const i of dIdiomas.eliminar) {
      await conn.query(
        `DELETE FROM relPeliIdm WHERE idPelicula=? AND idIdioma=?`,
        [id, i]
      );
    }

    for (const i of dIdiomas.agregar) {
      await conn.query(
        `INSERT INTO relPeliIdm (idPelicula,idIdioma) VALUES (?,?)`,
        [id, i]
      );
    }

    /* 3️⃣ TEMÁTICAS */
    const [[temActuales]] = await conn.query(
      `SELECT GROUP_CONCAT(idTematica) AS ids FROM relPeliTem WHERE idPelicula=?`,
      [id]
    );

    const actualTem = temActuales?.ids
      ? temActuales.ids.split(",").map(Number)
      : [];

    const dTem = diff(actualTem, tematicasIds);

    for (const t of dTem.eliminar) {
      await conn.query(
        `DELETE FROM relPeliTem WHERE idPelicula=? AND idTematica=?`,
        [id, t]
      );
    }

    for (const t of dTem.agregar) {
      await conn.query(
        `INSERT INTO relPeliTem (idPelicula,idTematica) VALUES (?,?)`,
        [id, t]
      );
    }

    /* 4️⃣ PREMIOS */
    const [[premActuales]] = await conn.query(
      `SELECT GROUP_CONCAT(idFesPrem) AS ids FROM relPeliPrem WHERE idPelicula=?`,
      [id]
    );

    const actualPrem = premActuales?.ids
      ? premActuales.ids.split(",").map(Number)
      : [];

    const dPrem = diff(actualPrem, premiosIds);

    for (const p of dPrem.eliminar) {
      await conn.query(
        `DELETE FROM relPeliPrem WHERE idPelicula=? AND idFesPrem=?`,
        [id, p]
      );
    }

    for (const p of dPrem.agregar) {
      await conn.query(
        `INSERT INTO relPeliPrem (idPelicula,idFesPrem) VALUES (?,?)`,
        [id, p]
      );
    }

    await conn.commit();

    res.status(200).json({ message: "Documental actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
}

import { getConnection } from "../../lib/connection";

const parseIds = str =>
  str ? str.split(",").map(Number) : [];

export default async function handler(req, res) {
  const { id } = req.query;
  const conn = await getConnection();

  const [rows] = await conn.execute(
    `SELECT * FROM vw_DetallePelicula WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json(null);
  }

  const [[idiomas]] = await conn.execute(
    `SELECT GROUP_CONCAT(idIdioma) AS ids
     FROM relpeliidm
     WHERE idPelicula = ?`,
    [id]
  );

  const [[tematicas]] = await conn.execute(
    `SELECT GROUP_CONCAT(idTematica) AS ids
     FROM relPeliTem
     WHERE idPelicula = ?`,
    [id]
  );

  const [[premios]] = await conn.execute(
    `SELECT GROUP_CONCAT(idFesPrem) AS ids
     FROM relPeliPrem
     WHERE idPelicula = ?`,
    [id]
  );

  const documental = {
    id: rows[0].id,
    titulo: rows[0].titulo,
    anio_publicacion: rows[0].anio_publicacion,
    director: rows[0].director,
    sinopsis: rows[0].sinopsis,
    url_imagen: rows[0].url_imagen,
    iniciativa: rows[0].iniciativa,
    url_descarga: rows[0].url_descarga,
    edicion_presentada: rows[0].edicion_presentada,
    duracion: rows[0].duracion,

    // Texto (vista)
    idiomas: rows[0].idiomas,
    tematicas: rows[0].tematicas,
    premios_ganados: rows[0].premios_ganados,

    // IDs (form edición)
    idiomasIds: parseIds(idiomas?.ids),
    tematicasIds: parseIds(tematicas?.ids),
    premiosIds: parseIds(premios?.ids)
  };

  res.status(200).json(documental);
}
